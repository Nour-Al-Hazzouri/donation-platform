<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\CommunityPost;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CommentController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    private NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of the comments for a community post.
     *
     * @param  \App\Models\CommunityPost  $communityPost
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(CommunityPost $communityPost): JsonResponse
    {
        $comments = $communityPost->comments()
            ->with('user')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => CommentResource::collection($comments),
            'message' => 'Comments retrieved successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created comment in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CommunityPost  $communityPost
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, CommunityPost $communityPost): JsonResponse
    {
        $this->authorize('create', [Comment::class, $communityPost]);

        $validated = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $comment = $communityPost->comments()->create([
            'user_id' => Auth::id(),
            'content' => $validated['content'],
        ]);

        $loadedComment = $comment->load('user');
        $this->notificationService->sendNewComment(
            $loadedComment->user,
            $loadedComment->user->username,
            [
                'user_id' => Auth::id(),
                'post_id' => $loadedComment->post_id,
                'comment_id' => $loadedComment->id,
            ]
        );

        return response()->json([
            'success' => true,
            'data' => new CommentResource($comment->load('user')),
            'message' => 'Comment created successfully',
        ], Response::HTTP_CREATED);
    }

    /**
     * Update the specified comment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CommunityPost  $communityPost
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, CommunityPost $communityPost, Comment $comment): JsonResponse
    {
        // Ensure the comment belongs to the specified community post
        if ($comment->post_id !== $communityPost->id) {
            return response()->json([
                'success' => false,
                'message'=> 'Comment not found for this post',
            ], Response::HTTP_NOT_FOUND);
        }

        $this->authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $comment->update([
            'content' => $validated['content'],
        ]);

        return response()->json([
            'success' => true,
            'data' => new CommentResource($comment->load('user')),
            'message' => 'Comment updated successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified comment from storage.
     *
     * @param  \App\Models\CommunityPost  $communityPost
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(CommunityPost $communityPost, Comment $comment): JsonResponse
    {
        // Ensure the comment belongs to the specified community post
        if ($comment->post_id !== $communityPost->id) {
            return response()->json([
                'success' => false,
                'message'=> 'Comment not found for this post',
            ], Response::HTTP_NOT_FOUND);
        }

        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully',
        ], Response::HTTP_OK);
    }
}
