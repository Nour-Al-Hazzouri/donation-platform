<?php

namespace App\Observers;

use App\Models\DonationTransaction;
use Illuminate\Support\Facades\DB;

class DonationTransactionObserver
{
    /**
     * Handle the DonationTransaction "created" event.
     */
    public function created(DonationTransaction $transaction): void
    {
        // Set default status to pending
        $transaction->status = 'pending';
        $transaction->saveQuietly(); // Save without triggering events
    }

    /**
     * Handle the DonationTransaction "updated" event.
     */
    public function updated(DonationTransaction $transaction): void
    {
        // Only process if the status was changed
        if ($transaction->wasChanged('status')) {
            // Get the authenticated user (if any)
            $user = auth()->user();
            
            // Only allow the event owner to change the status
            if (!$user || $user->id !== $transaction->event->user_id) {
                // Revert the status change if not authorized
                $transaction->status = $transaction->getOriginal('status');
                $transaction->saveQuietly();
                return;
            }
            
            // Process status changes
            if ($transaction->status === 'approved') {
                $this->processApprovedTransaction($transaction);
            } 
            // If status was changed from 'approved' to something else, reverse the amounts
            elseif ($transaction->getOriginal('status') === 'approved') {
                $this->reverseTransactionAmounts($transaction);
            }
        }
    }
    
    /**
     * Process an approved transaction by updating the event amounts
     */
    protected function processApprovedTransaction(DonationTransaction $transaction): void
    {
        $event = $transaction->event;
        
        DB::transaction(function () use ($transaction, $event) {
            if ($transaction->transaction_type === 'contribution') {
                $event->increment('current_amount', $transaction->amount);
            } else { // claim
                $event->decrement('current_amount', $transaction->amount);
                $event->decrement('possible_amount', $transaction->amount);
            }
            
            $event->save();
        });
    }
    
    /**
     * Reverse the amounts for a transaction that was previously approved
     */
    protected function reverseTransactionAmounts(DonationTransaction $transaction): void
    {
        $event = $transaction->event;
        
        DB::transaction(function () use ($transaction, $event) {
            if ($transaction->transaction_type === 'contribution') {
                $event->decrement('current_amount', $transaction->amount);
            } else { // claim
                $event->increment('current_amount', $transaction->amount);
                $event->increment('possible_amount', $transaction->amount);
            }
            
            $event->save();
        });
    }
}
