<?php

namespace App\Policies;

use App\Models\User;
use App\Models\DonationEvent;

class DonationEventPolicy
{
    /**
     * Determine whether the user can view the donation event.
     */
    public function view(?User $user, DonationEvent $donationEvent)
    {
        // Allow all authenticated users to view donation events
        return true;
    }

    /**
     * Determine whether the user can create donation events.
     */
    public function create(User $user)
    {
        // Admin users can create events without verification
        if ($user->hasRole('admin')) {
            return true;
        }

        // Regular users must have at least one approved verification request
        return $this->isVerified($user);
    }

    /**
     * Determine whether the user can update the donation event.
     */
    public function update(User $user, DonationEvent $donationEvent)
    {
        // User must own the event or be admin, and must have an approved verification request
        $isVerifiedOwner = $user->id === $donationEvent->user_id && $this->isVerified($user);
        return $isVerifiedOwner || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the donation event.
     */
    public function delete(User $user, DonationEvent $donationEvent)
    {
        // User must own the event or be admin, and must have an approved verification request
        $isVerifiedOwner = $user->id === $donationEvent->user_id && $this->isVerified($user);
        return $isVerifiedOwner || $user->hasRole('admin');
    }

    private function isVerified(User $user)
    {
        return $user->verifications()->where('status', 'approved')->exists();
    }
}
