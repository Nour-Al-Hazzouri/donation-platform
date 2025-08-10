<?php

namespace App\Policies;

use App\Models\User;
use App\Models\DonationTransaction;
use App\Models\DonationEvent;

class DonationTransactionPolicy
{
    /**
     * Determine whether the user can view any transactions.
     */
    public function viewAny(User $user): bool
    {
        // Only verified users can view transactions
        return $this->isUserVerified($user);
    }

    /**
     * Determine whether the user can view the transaction.
     */
    public function view(User $user, DonationTransaction $transaction): bool
    {
        // User can view if they are the transaction owner, event owner, or admin
        return $this->isUserVerified($user) && (
            $user->id === $transaction->user_id ||
            $user->id === $transaction->event->user_id ||
            $user->hasRole('admin')
        );
    }

    /**
     * Determine whether the user can create transactions.
     */
    public function create(User $user): bool
    {
        // Only verified users can create transactions
        return $this->isUserVerified($user);
    }

    /**
     * Determine whether the user can update the transaction.
     * Only the event owner can update the transaction status.
     */
    public function update(User $user, DonationTransaction $transaction): bool
    {
        // Only the event owner can update transaction status
        // Note: Admins are not allowed to bypass this restriction
        return $user->id === $transaction->event->user_id;
    }

    /**
     * Determine whether the user can delete the transaction.
     */
    public function delete(User $user, DonationTransaction $transaction): bool
    {
        // Only admin can delete transactions
        return $user->hasRole('admin');
    }

    /**
     * Check if the user is verified.
     */
    protected function isUserVerified(User $user): bool
    {
        return $user->verificationRequests()
            ->where('status', 'approved')
            ->exists();
    }
}
