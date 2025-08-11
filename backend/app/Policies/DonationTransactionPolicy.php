<?php

namespace App\Policies;

use App\Models\User;
use App\Models\DonationTransaction;
use Illuminate\Auth\Access\Response;

class DonationTransactionPolicy
{
    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        // Only verified users can view transactions
        return $this->isUserVerified($user);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DonationTransaction  $donationTransaction
     * @return bool
     */
    public function view(User $user, DonationTransaction $donationTransaction): bool
    {
        // User can view if they are the transaction owner, event owner, or admin
        return $this->isUserVerified($user) && (
            $user->id === $donationTransaction->user_id ||
            ($donationTransaction->event && $user->id === $donationTransaction->event->user_id) ||
            $user->hasRole('admin')
        );
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function create(User $user): bool
    {
        // Only verified users can create transactions
        return $this->isUserVerified($user);
    }

    /**
     * Determine whether the user can update the status of a transaction.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DonationTransaction  $donationTransaction
     * @return bool
     */
    public function updateStatus(User $user, DonationTransaction $donationTransaction): bool
    {
        // Only the event owner can update the status of a transaction
        return $this->isUserVerified($user) && ($donationTransaction->event && $user->id === $donationTransaction->event->user_id);
    }

    /**
     * Determine whether the user can delete the transaction.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DonationTransaction  $donationTransaction
     * @return bool
     */
    public function delete(User $user, DonationTransaction $donationTransaction): bool
    {
        // Only admin can delete transactions
        return $user->hasRole('admin');
    }

    /**
     * Check if the user is verified.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    protected function isUserVerified(User $user): bool
    {
        return $user->verifications()
            ->where('status', 'approved')
            ->exists();
    }
}
