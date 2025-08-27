<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use App\Models\Vote;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class VoteController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    private NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Vote on a community post.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function vote(Request $request, $postId): JsonResponse
    {
        $request->validate([
            'type' => 'required|in:upvote,downvote',
        ]);

        $post = CommunityPost::findOrFail($postId);
        $user = Auth::user();
        $type = $request->input('type');

        // Check if user already voted on this post
        $existingVote = Vote::where('user_id', $user->id)
            ->where('post_id', $postId)
            ->first();

        if ($existingVote) {
            if ($existingVote->type === $type) {
                // If same vote type, remove the vote
                $existingVote->delete();
                $message = 'Vote removed successfully';
            } else {
                // If different vote type, update the vote and send notification
                $existingVote->update(['type' => $type]);
                $message = 'Vote updated successfully';

                // Send notification for the updated vote
                if ($type === 'upvote') {
                    $this->notificationService->sendPostUpvoted(
                        $post->user,
                        $user->username,
                        [
                            'user_id' => $user->id,
                            'post_id' => $postId,
                        ]
                    );
                } elseif ($type === 'downvote') {
                    $this->notificationService->sendPostDownvoted(
                        $post->user,
                        $user->username,
                        [
                            'user_id' => $user->id,
                            'post_id' => $postId,
                        ]
                    );
                }
            }
        } else {
            // Create new vote
            Vote::create([
                'user_id' => $user->id,
                'post_id' => $postId,
                'type' => $type,
            ]);
            $message = 'Vote submitted successfully';

            // Send notification for the new vote
            if ($type === 'upvote') {
                $this->notificationService->sendPostUpvoted(
                    $post->user,
                    $user->username,
                    [
                        'user_id' => $user->id,
                        'post_id' => $postId,
                    ]
                );
            } elseif ($type === 'downvote') {
                $this->notificationService->sendPostDownvoted(
                    $post->user,
                    $user->username,
                    [
                        'user_id' => $user->id,
                        'post_id' => $postId,
                    ]
                );
            }
        }

        // Get vote counts
        $upvotes = $post->votes()->where('type', 'upvote')->count();
        $downvotes = $post->votes()->where('type', 'downvote')->count();
        $totalVotes = $upvotes - $downvotes;

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => [
                'upvotes' => $upvotes,
                'downvotes' => $downvotes,
                'total_votes' => $totalVotes,
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Get the authenticated user's vote on a post.
     *
     * @param  int  $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserVote($postId): JsonResponse
    {
        $user = Auth::user();
        $vote = Vote::where('user_id', $user->id)
            ->where('post_id', $postId)
            ->first();

        return response()->json([
            'success' => true,
            'data' => $vote ? [
                'type' => $vote->type,
                'created_at' => $vote->created_at->toDateTimeString(),
            ] : null,
        ], Response::HTTP_OK);
    }

    /**
     * Remove the authenticated user's vote on a post.
     *
     * @param  int  $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeVote($postId): JsonResponse
    {
        $user = Auth::user();
        $post = CommunityPost::findOrFail($postId);
        $vote = Vote::where('user_id', $user->id)
            ->where('post_id', $postId)
            ->first();

        if ($vote) {
            $vote->delete();
            // Get vote counts
            $upvotes = $post->votes()->where('type', 'upvote')->count();
            $downvotes = $post->votes()->where('type', 'downvote')->count();
            $totalVotes = $upvotes - $downvotes;
            return response()->json([
                'success' => true,
                'message' => 'Vote removed successfully',
                'data' => [
                    'upvotes' => $upvotes,
                    'downvotes' => $downvotes,
                    'total_votes' => $totalVotes,
                ],
            ], Response::HTTP_OK);
        }

        // Get vote counts
        $upvotes = $post->votes()->where('type', 'upvote')->count();
        $downvotes = $post->votes()->where('type', 'downvote')->count();
        $totalVotes = $upvotes - $downvotes;

        return response()->json([
            'success' => false,
            'message' => 'Vote not found',
            'data' => [
                'upvotes' => $upvotes,
                'downvotes' => $downvotes,
                'total_votes' => $totalVotes,
            ],
        ], Response::HTTP_NOT_FOUND);
    }
}
