<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommunityPostResource;
use App\Models\CommunityPost;
use App\Models\DonationEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CommunityPostController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    /**
     * Display a listing of the community posts.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $posts = CommunityPost::with(['user', 'event', 'comments', 'votes'])
            ->latest()
            ->paginate(10);

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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', CommunityPost::class);

        $validated = $request->validate([
            'content' => 'required|string',
            'event_id' => 'required|exists:donation_events,id',
            'images' => 'sometimes|array',
            'images.*' => 'url',
            'tags' => 'sometimes|array',
            'tags.*' => 'string|max:50'
        ]);

        $event = DonationEvent::findOrFail($validated['event_id']);
        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found',
            ], Response::HTTP_BAD_REQUEST);
        }

        $post = Auth::user()->communityPosts()->create($validated);

        return response()->json([
            'success' => true,
            'data' => new CommunityPostResource($post->load(['user', 'event'])),
            'message' => 'Community post created successfully',
        ], Response::HTTP_CREATED);
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
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CommunityPost  $communityPost
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, CommunityPost $communityPost): JsonResponse
    {
        $this->authorize('update', $communityPost);

        $validated = $request->validate([
            'content' => 'sometimes|string',
            'images' => 'sometimes|array',
            'images.*' => 'url',
            'tags' => 'sometimes|array',
            'tags.*' => 'string|max:50'
        ]);

        $communityPost->update($validated);

        return response()->json([
            'success' => true,
            'data' => new CommunityPostResource($communityPost->load(['user', 'event'])),
            'message' => 'Community post updated successfully',
        ], Response::HTTP_OK);
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

        $communityPost->delete();

        return response()->json([
            'success' => true,
            'message' => 'Community post deleted successfully',
        ], Response::HTTP_OK);
    }
}
