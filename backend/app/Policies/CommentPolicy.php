<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\CommunityPost;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any comments.
     */
    public function viewAny(?User $user, CommunityPost $communityPost): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create comments.
     */
    public function create(User $user, CommunityPost $communityPost): bool
    {
        return $user->can('create comments');
    }

    /**
     * Determine whether the user can update the comment.
     */
    public function update(User $user, Comment $comment): bool
    {
        return $user->can('edit comments') ||
            $user->can('moderate content') ||
            $user->can('edit own comments') &&
            $comment->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the comment.
     */
    public function delete(User $user, Comment $comment): bool
    {
        return $user->can('delete comments') ||
            $user->can('moderate content') ||
            $user->can('delete own comments') &&
            $comment->user_id === $user->id;
    }

    /**
     * Determine whether the user can restore the comment.
     */
    public function restore(User $user, Comment $comment): bool
    {
        return $user->can('moderate content');
    }

    /**
     * Determine whether the user can permanently delete the comment.
     */
    public function forceDelete(User $user, Comment $comment): bool
    {
        return $user->can('moderate content');
    }
}
