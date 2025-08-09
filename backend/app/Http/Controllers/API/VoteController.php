<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use App\Models\Vote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class VoteController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

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
                // If different vote type, update the vote
                $existingVote->update(['type' => $type]);
                $message = 'Vote updated successfully';
            }
        } else {
            // Create new vote
            Vote::create([
                'user_id' => $user->id,
                'post_id' => $postId,
                'type' => $type,
            ]);
            $message = 'Vote submitted successfully';
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
}
