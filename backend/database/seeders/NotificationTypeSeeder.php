<?php

namespace Database\Seeders;

use App\Models\NotificationType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotificationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $notificationTypes = [
            [
                'name' => 'donation_received',
                'description' => 'You received a donation',
                'template' => 'You received a donation of ${amount} from {donor_name}',
            ],
            [
                'name' => 'donation_goal_reached',
                'description' => 'Donation goal reached',
                'template' => 'Congratulations! You reached your donation goal for {event_title}',
            ],
            [
                'name' => 'new_comment',
                'description' => 'New comment on your post',
                'template' => '{user_name} commented on your post',
            ],
            [
                'name' => 'post_liked',
                'description' => 'Your post was liked',
                'template' => '{user_name} liked your post',
            ],
            [
                'name' => 'verification_approved',
                'description' => 'Verification approved',
                'template' => 'Your verification has been approved',
            ],
            [
                'name' => 'verification_rejected',
                'description' => 'Verification rejected',
                'template' => 'Your verification was rejected: {reason}',
            ],
            [
                'name' => 'event_approved',
                'description' => 'Event approved',
                'template' => 'Your event "{event_title}" has been approved',
            ],
            [
                'name' => 'event_rejected',
                'description' => 'Event rejected',
                'template' => 'Your event "{event_title}" was rejected: {reason}',
            ],
        ];

        foreach ($notificationTypes as $type) {
            NotificationType::firstOrCreate(
                ['name' => $type['name']],
                $type
            );
        }
    }
}
