<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommunityPostRequest;
use App\Http\Requests\UpdateCommunityPostRequest;
use App\Http\Resources\CommunityPostResource;
use App\Models\CommunityPost;
use App\Models\DonationEvent;
use App\Services\ImageService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CommunityPostController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    /**
     * @var ImageService
     */
    private $imageService;
    /**
     * @var NotificationService
     */
    private $notificationService;

    public function __construct(ImageService $imageService, NotificationService $notificationService)
    {
        $this->imageService = $imageService;
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of the community posts.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'query' => 'sometimes|string|max:255',
            'per_page' => 'sometimes|integer|min:1|max:100',
        ]);

        $perPage = $request->query('per_page', 15);
        $searchTerm = $request->query('query');

        $posts = CommunityPost::with([
            'user',
            'event',
            'comments',
            'votes'
        ])
            ->withCount([
                'votes as upvotes_count' => function ($query) {
                    $query->where('type', 'upvote');
                },
                'votes as downvotes_count' => function ($query) {
                    $query->where('type', 'downvote');
                }
            ])
            ->when($searchTerm, function ($query) use ($searchTerm) {
                $query->where('content', 'like', '%' . $searchTerm . '%');
            })
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => CommunityPostResource::collection($posts),
            'links' => [
                'first' => $posts->url(1),
                'last' => $posts->url($posts->lastPage()),
                'prev' => $posts->previousPageUrl(),
                'next' => $posts->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $posts->currentPage(),
                'from' => $posts->firstItem(),
                'last_page' => $posts->lastPage(),
                'path' => $posts->path(),
                'per_page' => $posts->perPage(),
                'to' => $posts->lastItem(),
                'total' => $posts->total(),
            ],
            'message' => 'Community posts retrieved successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created community post in storage.
     *
     * @param  \App\Http\Requests\StoreCommunityPostRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreCommunityPostRequest $request): JsonResponse
    {
        $this->authorize('create', CommunityPost::class);

        $validated = $request->validated();
        $uploadedImages = [];

        try {
            // Handle image uploads if present
            if ($request->hasFile('image_urls')) {
                foreach ($request->file('image_urls') as $image) {
                    $path = $this->imageService->uploadImage(
                        $image,
                        'community/posts',
                        true, // isPublic
                        1200, // maxWidth
                        85    // quality
                    );

                    if ($path) {
                        $uploadedImages[] = $path;
                    } else {
                        Log::error('Failed to upload image: ' . $image->getClientOriginalName());
                        throw new \Exception('Failed to process one or more images');
                    }
                }
                $validated['image_urls'] = $uploadedImages;
            }

            $user = Auth::user();
            $post = $user->communityPosts()->create($validated);

            $loadedPost = $post->load(['user', 'event']);
            $this->notificationService->sendNewPost(
                $user,
                $user->username,
                $loadedPost->event->title,
                [
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                    'event_id' => $loadedPost->event_id,
                ]
            );

            return response()->json([
                'success' => true,
                'data' => new CommunityPostResource($loadedPost),
                'message' => 'Community post created successfully',
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            // Clean up any uploaded images if there was an error
            foreach ($uploadedImages as $imagePath) {
                $this->imageService->deleteImage($imagePath);
            }

            Log::error('Error creating post: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create post: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified community post.
     *
     * @param  \App\Models\CommunityPost  $communityPost
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(CommunityPost $communityPost): JsonResponse
    {
        $communityPost->load(['user', 'event', 'comments.user', 'votes']);

        return response()->json([
            'success' => true,
            'data' => new CommunityPostResource($communityPost),
            'message' => 'Community post retrieved successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified community post in storage.
     *
     * @param  \App\Http\Requests\UpdateCommunityPostRequest  $request
     * @param  \App\Models\CommunityPost  $communityPost
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateCommunityPostRequest $request, CommunityPost $communityPost): JsonResponse
    {
        $this->authorize('update', $communityPost);

        $validated = $request->validated();
        $uploadedImages = [];
        $currentImages = $communityPost->image_urls ?? [];

        try {
            // Handle new image uploads
            if ($request->hasFile('image_urls')) {
                foreach ($request->file('image_urls') as $image) {
                    $path = $this->imageService->uploadImage(
                        $image,
                        'community/posts',
                        true, // isPublic
                        1200, // maxWidth
                        85    // quality
                    );

                    if ($path) {
                        $uploadedImages[] = $path;
                    } else {
                        Log::error('Failed to upload image: ' . $image->getClientOriginalName());
                        throw new \Exception('Failed to process one or more images');
                    }
                }

                // Merge new images with existing ones if there are any
                $validated['image_urls'] = array_merge($currentImages, $uploadedImages);
            }

            // Handle image removals if requested
            if ($request->has('remove_image_urls') && is_array($request->remove_image_urls)) {
                $imagesToRemove = $request->remove_image_urls;

                // Filter out any images that don't belong to this post
                $imagesToRemove = array_intersect($imagesToRemove, $currentImages);

                foreach ($imagesToRemove as $imageToRemove) {
                    if (!$this->imageService->deleteImage($imageToRemove)) {
                        Log::warning('Failed to delete image: ' . $imageToRemove);
                    }

                    // Remove from current images array
                    $key = array_search($imageToRemove, $currentImages);
                    if ($key !== false) {
                        unset($currentImages[$key]);
                    }
                }

                // Update the validated images array with remaining images
                $validated['image_urls'] = array_values($currentImages);
            }

            $communityPost->update($validated);
            $communityPost->refresh();

            return response()->json([
                'success' => true,
                'data' => new CommunityPostResource($communityPost->load(['user', 'event'])),
                'message' => 'Community post updated successfully',
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            // Clean up any uploaded images if there was an error
            foreach ($uploadedImages as $imagePath) {
                $this->imageService->deleteImage($imagePath);
            }

            Log::error('Error updating post: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update post: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified community post from storage.
     *
     * @param  \App\Models\CommunityPost  $communityPost
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(CommunityPost $communityPost): JsonResponse
    {
        $this->authorize('delete', $communityPost);

        try {
            // Delete all associated images
            if (!empty($communityPost->image_urls)) {
                foreach ($communityPost->image_urls as $imagePath) {
                    if (!$this->imageService->deleteImage($imagePath)) {
                        Log::warning('Failed to delete image during post deletion: ' . $imagePath);
                    }
                }
            }
            $loadedPost = $communityPost->load(['user', 'event']);

            $this->notificationService->sendPostDeleted(
                $loadedPost->user,
                $loadedPost->event->title,
                [
                    'user_id' => $loadedPost->user->id,
                    'post_id' => $loadedPost->id,
                    'event_id' => $loadedPost->event_id,
                ]
            );

            // Delete the post
            $communityPost->delete();

            return response()->json([
                'success' => true,
                'message' => 'Community post deleted successfully',
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            Log::error('Error deleting post: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete post: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
