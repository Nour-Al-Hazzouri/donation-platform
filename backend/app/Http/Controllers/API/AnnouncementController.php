<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use App\Services\ImageService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AnnouncementController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    /**
     * @var ImageService
     */
    protected $imageService;

    /**
     * @var NotificationService
     */
    protected $notificationService;

    /**
     * @param ImageService $imageService
     */
    public function __construct(ImageService $imageService, NotificationService $notificationService)
    {
        $this->imageService = $imageService;
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of the announcements.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'per_page' => 'sometimes|integer|min:1|max:100',
            'query' => 'sometimes|string|max:255',
        ]);
        $perPage = $request->query('per_page', 15);
        $announcements = Announcement::with('user')
            ->when($request->has('query'), function ($query) use ($request) {
                $query->whereHas('user', function ($query) use ($request) {
                    $query->where('username', 'like', '%' . $request->query . '%')
                        ->orWhere('email', 'like', '%' . $request->query . '%')
                        ->orWhere('phone', 'like', '%' . $request->query . '%')
                        ->orWhere('first_name', 'like', '%' . $request->query . '%')
                        ->orWhere('last_name', 'like', '%' . $request->query . '%');
                });
            })
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'data' => AnnouncementResource::collection($announcements),
            'message' => 'Announcements retrieved successfully',
            'meta' => [
                'total' => $announcements->total(),
                'per_page' => $announcements->perPage(),
                'current_page' => $announcements->currentPage(),
                'last_page' => $announcements->lastPage(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created announcement in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Announcement::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'priority' => 'sometimes|string|in:' . implode(',', Announcement::getPriorities()),
            'image_urls' => 'sometimes|array',
            'image_urls.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:5120',
        ]);

        // Set default priority if not provided
        $validated['priority'] ??= Announcement::PRIORITY_MEDIUM;

        try {
            // Handle file uploads if any
            $imagePaths = [];

            if ($request->hasFile('image_urls')) {
                foreach ($request->file('image_urls') as $image) {
                    $path = $this->imageService->uploadImage($image, 'announcements');
                    if ($path) {
                        $imagePaths[] = $path;
                    }
                }
            }

            // Create the announcement with the image paths
            $announcement = Auth::user()->announcements()->create([
                'title' => $validated['title'],
                'content' => $validated['content'],
                'priority' => $validated['priority'],
                'image_urls' => $imagePaths,
            ]);

            $announcement->load('user');

            $this->notificationService->broadcastNewAnnouncement(
                announcementTitle: $announcement->title,
                data: [
                    'user_id' => $announcement->user_id,
                    'announcement_id' => $announcement->id,
                ]
            );

            return response()->json([
                'data' => new AnnouncementResource($announcement->load('user')),
                'message' => 'Announcement created successfully',
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            Log::error('Error creating announcement: ' . $e->getMessage());

            // Clean up any uploaded files if there was an error
            if (!empty($imagePaths)) {
                foreach ($imagePaths as $path) {
                    $this->imageService->deleteImage($path);
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to create announcement',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified announcement.
     *
     * @param  \App\Models\Announcement  $announcement
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Announcement $announcement): JsonResponse
    {
        return response()->json([
            'data' => new AnnouncementResource($announcement->load('user')),
            'message' => 'Announcement retrieved successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified announcement in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Announcement  $announcement
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Announcement $announcement): JsonResponse
    {
        $this->authorize('update', $announcement);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'priority' => 'sometimes|string|in:' . implode(',', Announcement::getPriorities()),
            'image_urls' => 'sometimes|array',
            'image_urls.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'remove_image_urls' => 'sometimes|array',
            'remove_image_urls.*' => 'string',
        ]);

        try {
            $imagePaths = $announcement->image_urls ?? [];
            $uploadedImagePaths = [];

            // Handle new file uploads
            if ($request->hasFile('image_urls')) {
                foreach ($request->file('image_urls') as $image) {
                    $path = $this->imageService->uploadImage($image, 'announcements');
                    if ($path) {
                        $uploadedImagePaths[] = $path;
                    }
                }
                $imagePaths = array_merge($imagePaths, $uploadedImagePaths);
            }

            // Remove images that need to be deleted
            if (!empty($validated['remove_image_urls'])) {
                foreach ($validated['remove_image_urls'] as $imageToRemove) {
                    // Only delete the image if it exists in the current image paths
                    if (($key = array_search($imageToRemove, $imagePaths)) !== false) {
                        unset($imagePaths[$key]);
                        // Delete the actual file from storage
                        $this->imageService->deleteImage($imageToRemove);
                    }
                }
                // Re-index the array to avoid JSON encoding issues
                $imagePaths = array_values($imagePaths);
            }

            // Update the announcement with the new data
            $announcement->update([
                'title' => $validated['title'] ?? $announcement->title,
                'content' => $validated['content'] ?? $announcement->content,
                'priority' => $validated['priority'] ?? $announcement->priority,
                'image_urls' => $imagePaths,
            ]);

            $announcement->load('user');

            $this->notificationService->sendAnnouncementUpdated(
                user: $announcement->user,
                announcementTitle: $announcement->title,
                data: [
                    'user_id' => $announcement->user_id,
                    'announcement_id' => $announcement->id,
                ]
            );

            return response()->json([
                'success' => true,
                'data' => new AnnouncementResource($announcement->load('user')),
                'message' => 'Announcement updated successfully',
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            Log::error('Error updating announcement: ' . $e->getMessage());

            // Clean up any newly uploaded files if there was an error
            if (!empty($uploadedImagePaths)) {
                foreach ($uploadedImagePaths as $path) {
                    $this->imageService->deleteImage($path);
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to update announcement',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified announcement from storage.
     *
     * @param  \App\Models\Announcement  $announcement
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Announcement $announcement): JsonResponse
    {
        $this->authorize('delete', $announcement);

        try {
            // Delete all associated images
            if (!empty($announcement->image_urls)) {
                foreach ($announcement->image_urls as $imagePath) {
                    if (!$this->imageService->deleteImage($imagePath)) {
                        Log::warning('Failed to delete image during announcement deletion: ' . $imagePath);
                    }
                }
            }

            // Delete the announcement
            $announcement->delete();

            return response()->json([
                'success' => true,
                'message' => 'Announcement deleted successfully',
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            Log::error('Error deleting announcement: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete announcement',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
