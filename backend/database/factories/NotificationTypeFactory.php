<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NotificationType>
 */
class NotificationTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $templates = [
            'donation_received' => 'You received a donation of ${amount} from {donor_name}',
            'donation_goal_reached' => 'Congratulations! You reached your donation goal for {event_title}',
            'new_comment' => '{user_name} commented on your post',
            'post_liked' => '{user_name} liked your post',
            'verification_approved' => 'Your verification has been approved',
            'verification_rejected' => 'Your verification was rejected: {reason}',
            'event_approved' => 'Your event "{event_title}" has been approved',
            'event_rejected' => 'Your event "{event_title}" was rejected: {reason}',
        ];

        $name = $this->faker->unique()->randomElement(array_keys($templates));

        return [
            'name' => $name,
            'description' => ucfirst(str_replace('_', ' ', $name)) . ' notification',
            'template' => $templates[$name],
        ];
    }
}
