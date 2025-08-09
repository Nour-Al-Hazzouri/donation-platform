<?php

namespace App\Policies;

use App\Models\User;
use App\Models\DonationEvent;

class DonationEventPolicy
{
    /**
     * Determine whether the user can view the donation event.
     */
    public function view(User $user, DonationEvent $donationEvent)
    {
        // Allow all authenticated users to view donation events
        return true;
    }

    /**
     * Determine whether the user can create donation events.
     */
    public function create(User $user)
    {
        // User must have at least one approved verification request
        return $user->verificationRequests()->where('status', 'approved')->exists();
    }

    /**
     * Determine whether the user can update the donation event.
     */
    public function update(User $user, DonationEvent $donationEvent)
    {
        // User must own the event or be admin, and must have an approved verification request
        $isVerified = $user->verificationRequests()->where('status', 'approved')->exists();
        $isVerifiedOwner = $user->id === $donationEvent->user_id && $isVerified;
        return $isVerifiedOwner || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the donation event.
     */
    public function delete(User $user, DonationEvent $donationEvent)
    {
        // User must own the event or be admin, and must have an approved verification request
        $isVerified = $user->verificationRequests()->where('status', 'approved')->exists();
        $isVerifiedOwner = $user->id === $donationEvent->user_id && $isVerified;
        return $isVerifiedOwner || $user->hasRole('admin');
    }
}
