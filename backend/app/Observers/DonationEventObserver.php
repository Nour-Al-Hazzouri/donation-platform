<?php

namespace App\Observers;

use App\Models\DonationEvent;
use App\Services\NotificationService;

class DonationEventObserver
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the DonationEvent "updated" event.
     */
    public function updated(DonationEvent $donationEvent)
    {
        // Check if current_amount was changed and it's now equal to or greater than goal_amount
        if (
            $donationEvent->isDirty('current_amount') &&
            $donationEvent->status === 'active' &&
            $donationEvent->current_amount >= $donationEvent->goal_amount
        ) {

            // Update status to completed
            $donationEvent->status = 'completed';
            $donationEvent->saveQuietly(); // Use saveQuietly to prevent observer loop

            // Send notification to the event creator
            $this->notificationService->sendDonationGoalReached(
                $donationEvent->user_id,
                $donationEvent->title,
                [
                    'user_id' => $donationEvent->user_id,
                    'event_title' => $donationEvent->title,
                    'goal_amount' => $donationEvent->goal_amount,
                    'current_amount' => $donationEvent->current_amount
                ]
            );
        }
    }
}
