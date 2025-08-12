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
            // Donation related
            [
                'name' => 'donation_goal_reached',
                'description' => 'Donation goal reached',
                'template' => 'Congratulations! You reached your donation goal for {event_title}',
            ],
            //donation transaction
            [
                'name' => 'transaction_contribution',
                'description' => 'Donation contribution',
                'template' => '{user_name} contributed ${amount} to {event_title}',
            ],
            [
                'name'=>'transaction_claim',
                'description'=>'Donation transaction claim',
                'template'=>'{user_name} claimed ${amount} from {event_title}',
            ],
            [
                'name'=>'transaction_approved',
                'description'=>'Donation transaction approved',
                'template'=>'Your Transaction on {event_title} has been approved',
            ],
            [
                'name'=>'transaction_rejected',
                'description'=>'Donation transaction rejected',
                'template'=>'Your Transaction on {event_title} has been rejected',
            ],
            
            // Post related
            [
                'name' => 'new_post',
                'description' => 'New community post',
                'template' => '{user_name} created a new post in {event_title}',
            ],
            [
                'name' => 'post_deleted',
                'description' => 'Community post was deleted',
                'template' => 'A post you followed in {event_title} was deleted',
            ],
            
            // Comment related
            [
                'name' => 'new_comment',
                'description' => 'New comment on your post',
                'template' => '{user_name} commented on your post',
            ],
            
            // Vote/Reaction related
            [
                'name' => 'post_upvoted',
                'description' => 'Your post was upvoted',
                'template' => '{user_name} upvoted your post',
            ],
            [
                'name' => 'post_downvoted',
                'description' => 'Your post was downvoted',
                'template' => '{user_name} downvoted your post',
            ],
            
            
            // Verification related
            [
                'name'=>'verification_request_sent',
                'description'=>'Verification request sent',
                'template'=>'Your verification request has been sent',
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
            
            // Event related
            [
                'name'=>'event_created_success',
                'description'=>'Event created successfully',
                'template'=>'Your event "{event_title}" has been created successfully',
            ],
            [
                'name'=>'event_created_failed',
                'description'=>'Event creation failed',
                'template'=>'Your event "{event_title}" creation failed: {reason}',
            ],
            
            // User related
            
            
            // Announcement related
            [
                'name' => 'new_announcement',
                'description' => 'New announcement',
                'template' => 'New announcement: {announcement_title}',
            ],
            [
                'name' => 'announcement_updated',
                'description' => 'Announcement updated',
                'template' => 'Announcement updated: {announcement_title}',
            ],

            // Other
            [
                'name' => 'other',
                'description' => 'Other notification',
                'template' => '{message}',
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
