<?php

namespace App\Policies;

use App\Models\CommunityPost;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommunityPostPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, CommunityPost $communityPost): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->isVerified($user) &&
            ($user->can('create posts') || $user->can('manage posts'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CommunityPost $communityPost): bool
    {
        if ($user->can('edit posts') || $user->can('manage posts')) {
            return true;
        }

        return $this->isVerified($user) &&
            $user->can('edit own posts') &&
            $communityPost->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CommunityPost $communityPost): bool
    {
        if ($user->can('delete posts') || $user->can('manage posts')) {
            return true;
        }

        return $this->isVerified($user) &&
            $user->can('delete own posts') &&
            $communityPost->user_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CommunityPost $communityPost): bool
    {
        return $this->isVerified($user) &&
            $user->can('manage posts');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CommunityPost $communityPost): bool
    {
        return $this->isVerified($user) &&
            $user->can('manage posts');
    }

    private function isVerified(User $user)
    {
        return $user->verifications()->where('status', 'approved')->exists();
    }
}
