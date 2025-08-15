<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\NotificationService;
use Auth;
use Illuminate\Http\Request;
use App\Http\Requests\StoreDonationEventRequest;
use App\Http\Requests\UpdateDonationEventRequest;
use App\Models\DonationEvent;
use App\Http\Resources\DonationEventResource;
use App\Services\ImageService;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class DonationEventController extends Controller
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
     * @param NotificationService $notificationService
     */
    public function __construct(ImageService $imageService, NotificationService $notificationService)
    {
        $this->imageService = $imageService;
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of Donation Events.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $request->validate([
                'query' => 'sometimes|string|max:255',
                'per_page' => 'sometimes|integer|min:1|max:100',
                'type' => 'sometimes|string|in:all,request,offer',
                'status' => 'sometimes|string|in:active,completed,cancelled,suspended',
                'location_id' => 'sometimes|exists:locations,id',
            ]);

            $searchTerm = $request->query('query');
            $perPage = $request->query('per_page', 15);
            $type = $request->query('type', 'all');
            $status = $request->query('status', 'active');
            $locationId = $request->query('location_id');

            $searchQuery = DonationEvent::query()
                ->with('user', 'location')
                ->join('users', 'donation_events.user_id', '=', 'users.id');

            if ($type === 'all') {
                $searchQuery->where('donation_events.status', 'active');
            } else {
                $searchQuery->where('donation_events.type', $type)
                    ->where('donation_events.status', 'active');
            }

            if ($status !== 'all') {
                $searchQuery->where('donation_events.status', $status);
            }

            if ($locationId) {
                $searchQuery->where('donation_events.location_id', $locationId);
            }

            if ($searchTerm) {
                $searchQuery->where(function ($query) use ($searchTerm) {
                    $query->where('donation_events.title', 'like', '%' . $searchTerm . '%')
                        ->orWhere('users.username', 'like', '%' . $searchTerm . '%')
                        ->orWhere('users.first_name', 'like', '%' . $searchTerm . '%')
                        ->orWhere('users.last_name', 'like', '%' . $searchTerm . '%');
                });
            }

            $donationEvents = $searchQuery->select('donation_events.*')
                ->latest('donation_events.created_at')
                ->paginate($perPage);

            return response()->json([
                'data' => DonationEventResource::collection($donationEvents),
                'meta' => [
                    'current_page' => $donationEvents->currentPage(),
                    'last_page' => $donationEvents->lastPage(),
                    'per_page' => $donationEvents->perPage(),
                    'total' => $donationEvents->total(),
                ],
                'message' => 'Search results retrieved successfully.',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error retrieving donation events: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to retrieve donation events',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display a listing of active Donation Requests.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function requestsIndex(Request $request)
    {
        try {
            $request->validate([
                'per_page' => 'sometimes|integer|min:1|max:100',
            ]);

            $perPage = $request->query('per_page', 15);

            $donationEvents = DonationEvent::with('user', 'location')
                ->where('status', 'active')
                ->where('type', 'request')
                ->latest()
                ->paginate($perPage);

            return response()->json([
                'data' => DonationEventResource::collection($donationEvents),
                'meta' => [
                    'current_page' => $donationEvents->currentPage(),
                    'last_page' => $donationEvents->lastPage(),
                    'per_page' => $donationEvents->perPage(),
                    'total' => $donationEvents->total(),
                ],
                'message' => 'Donation events retrieved successfully.',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error retrieving donation events: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to retrieve donation events',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display a listing of active Donation Offers.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function offersIndex(Request $request)
    {
        try {
            $request->validate([
                'per_page' => 'sometimes|integer|min:1|max:100',
            ]);

            $perPage = $request->query('per_page', 15);
        } catch (\Exception $e) {
            Log::error('Error retrieving donation events: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to retrieve donation events',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $donationEvents = DonationEvent::with('user', 'location')
            ->where('status', 'active')
            ->where('type', 'offer')
            ->latest()
            ->paginate($perPage);
        return response()->json([
            'data' => DonationEventResource::collection($donationEvents),
            'message' => 'Donation events retrieved successfully.',
        ], Response::HTTP_OK);
    }

    /**
     * Display a listing of Donation Events for a specific user.
     *
     * @param User $user
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function userIndex(User $user, Request $request)
    {
        try {
            $request->validate([
                'per_page' => 'sometimes|integer|min:1|max:100',
            ]);

            $perPage = $request->query('per_page', 15);

            $donationEvents = DonationEvent::with('user', 'location')
                ->where('user_id', $user->id)
                ->latest()
                ->paginate($perPage);

            return response()->json([
                'data' => DonationEventResource::collection($donationEvents),
                'meta' => [
                    'current_page' => $donationEvents->currentPage(),
                    'last_page' => $donationEvents->lastPage(),
                    'per_page' => $donationEvents->perPage(),
                    'total' => $donationEvents->total(),
                ],
                'message' => 'Donation events retrieved successfully.',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error retrieving donation events: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to retrieve donation events',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created Donation Event in storage.
     *
     * @param StoreDonationEventRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreDonationEventRequest $request)
    {
        $this->authorize('create', DonationEvent::class);

        $validated = $request->validated();
        $validated['current_amount'] = 0;
        $validated['possible_amount'] = 0;
        $validated['user_id'] = auth()->user()->id;
        $validated['status'] = 'active';

        try {
            // Handle file uploads if any
            $imagePaths = [];

            if ($request->hasFile('image_urls')) {
                foreach ($request->file('image_urls') as $image) {
                    $path = $this->imageService->uploadImage($image, 'donation_events');
                    if ($path) {
                        $imagePaths[] = $path;
                    }
                }
            }

            // Create the donation event with the image paths
            $donationEvent = DonationEvent::create(array_merge($validated, [
                'image_urls' => $imagePaths,
            ]));

            $donationEvent->load('user', 'location');

            $this->notificationService->sendEventCreatedStatus(
                user: $donationEvent->user,
                eventTitle: $donationEvent->title,
                isSuccess: true,
                data: [
                    'user_id' => Auth::id(),
                    'event_id' => $donationEvent->id,
                ]
            );

            return response()->json([
                'data' => new DonationEventResource($donationEvent->load('user', 'location')),
                'message' => 'Donation event created successfully.',
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            Log::error('Error creating donation event: ' . $e->getMessage());

            // Clean up any uploaded files if there was an error
            if (!empty($imagePaths)) {
                foreach ($imagePaths as $path) {
                    $this->imageService->deleteImage($path);
                }
            }

            return response()->json([
                'message' => 'Failed to create donation event',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified Donation Event.
     *
     * @param DonationEvent $donationEvent
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(DonationEvent $donationEvent)
    {
        $this->authorize('view', $donationEvent);
        $donationEvent->load('user', 'location');
        return response()->json([
            'data' => new DonationEventResource($donationEvent),
            'message' => 'Donation event retrieved successfully.',
        ], 200);
    }

    /**
     * Update the specified Donation Event in storage.
     *
     * @param UpdateDonationEventRequest $request
     * @param DonationEvent $donationEvent
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateDonationEventRequest $request, DonationEvent $donationEvent)
    {
        $this->authorize('update', $donationEvent);

        $validated = $request->validated();
        $uploadedImagePaths = [];

        try {
            $imagePaths = $donationEvent->image_urls ?? [];

            // Handle new file uploads
            if ($request->hasFile('image_urls')) {
                foreach ($request->file('image_urls') as $image) {
                    $path = $this->imageService->uploadImage($image, 'donation_events');
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

            // Update the donation event with the new data and image paths
            $donationEvent->update(array_merge($validated, [
                'image_urls' => $imagePaths,
            ]));

            return response()->json([
                'data' => new DonationEventResource($donationEvent->load('user', 'location')),
                'message' => 'Donation event updated successfully.',
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            Log::error('Error updating donation event: ' . $e->getMessage());

            // Clean up any newly uploaded files if there was an error
            if (!empty($uploadedImagePaths)) {
                foreach ($uploadedImagePaths as $path) {
                    $this->imageService->deleteImage($path);
                }
            }

            return response()->json([
                'message' => 'Failed to update donation event',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified donation event.
     *
     * @param DonationEvent $donationEvent
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(DonationEvent $donationEvent)
    {
        $this->authorize('delete', $donationEvent);

        try {
            // Delete all associated images
            if (!empty($donationEvent->image_urls)) {
                foreach ($donationEvent->image_urls as $imagePath) {
                    if (!$this->imageService->deleteImage($imagePath)) {
                        Log::warning('Failed to delete image during donation event deletion: ' . $imagePath);
                    }
                }
            }

            // Delete the donation event
            $donationEvent->delete();

            return response()->json([
                'success' => true,
                'message' => 'Donation event deleted successfully.',
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            Log::error('Error deleting donation event: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete donation event',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Activate a suspended donation event.
     *
     * @param DonationEvent $donationEvent
     * @return \Illuminate\Http\JsonResponse
     */
    public function activate(DonationEvent $donationEvent)
    {
        $this->authorize('update', $donationEvent);

        if ($donationEvent->status !== 'suspended') {
            return response()->json([
                'success' => false,
                'message' => 'Only suspended donation events can be activated.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $donationEvent->status = 'active';
        $donationEvent->save();

        return response()->json([
            'success' => true,
            'message' => 'Donation event activated successfully.',
            'data' => new DonationEventResource($donationEvent->load('user', 'location')),
        ], Response::HTTP_OK);
    }

    /**
     * Cancel an active donation event.
     *
     * @param DonationEvent $donationEvent
     * @return \Illuminate\Http\JsonResponse
     */
    public function cancel(DonationEvent $donationEvent)
    {
        $this->authorize('update', $donationEvent);

        if ($donationEvent->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Only active donation events can be cancelled.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $donationEvent->status = 'cancelled';
        $donationEvent->save();

        return response()->json([
            'success' => true,
            'message' => 'Donation event cancelled successfully.',
            'data' => new DonationEventResource($donationEvent->load('user', 'location')),
        ], Response::HTTP_OK);
    }

    /**
     * Suspend an active donation event.
     *
     * @param DonationEvent $donationEvent
     * @return \Illuminate\Http\JsonResponse
     */
    public function suspend(DonationEvent $donationEvent)
    {
        $this->authorize('update', $donationEvent);

        if ($donationEvent->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Only active donation events can be suspended.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $donationEvent->status = 'suspended';
        $donationEvent->save();

        return response()->json([
            'success' => true,
            'message' => 'Donation event suspended successfully.',
            'data' => new DonationEventResource($donationEvent->load('user', 'location')),
        ], Response::HTTP_OK);
    }
}
