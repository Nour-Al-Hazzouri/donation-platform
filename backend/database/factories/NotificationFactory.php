<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\NotificationType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = NotificationType::inRandomOrder()->first() ?? 
                NotificationType::factory()->create();
                
        return [
            'user_id' => User::factory(),
            'type_id' => $type->id,
            'title' => ucfirst(str_replace('_', ' ', $type->name)),
            'message' => $this->generateMessageFromTemplate($type->template),
            'data' => $this->generateNotificationData($type->name),
            'read_at' => $this->faker->optional(0.7)->dateTimeBetween('-1 month'),
        ];
    }
    
    /**
     * Generate a message based on the template and random data
     */
    protected function generateMessageFromTemplate(string $template): string
    {
        $replacements = [
            '{amount}' => '$' . $this->faker->randomFloat(2, 10, 1000),
            '{donor_name}' => $this->faker->name,
            '{event_title}' => $this->faker->sentence(3),
            '{user_name}' => $this->faker->name,
            '{reason}' => $this->faker->optional()->sentence(),
        ];
        
        return str_replace(
            array_keys($replacements),
            array_values($replacements),
            $template
        );
    }
    
    /**
     * Generate appropriate data based on notification type
     */
    protected function generateNotificationData(string $type): ?array
    {
        $data = [
            'type' => $type,
            'timestamp' => now()->toIso8601String(),
        ];
        
        // Add type-specific data
        switch ($type) {
            case 'donation_received':
                $data['amount'] = $this->faker->randomFloat(2, 10, 1000);
                $data['donor_id'] = User::inRandomOrder()->first()?->id;
                break;
                
            case 'donation_goal_reached':
                $data['event_id'] = $this->faker->randomNumber();
                $data['goal_amount'] = $this->faker->randomFloat(2, 1000, 10000);
                break;
                
            case 'new_comment':
            case 'post_liked':
                $data['post_id'] = $this->faker->randomNumber();
                $data['actor_id'] = User::inRandomOrder()->first()?->id;
                break;
                
            case 'verification_approved':
            case 'verification_rejected':
                $data['verification_id'] = $this->faker->randomNumber();
                break;
                
            case 'event_approved':
            case 'event_rejected':
                $data['event_id'] = $this->faker->randomNumber();
                break;
        }
        
        return $data;
    }
}
