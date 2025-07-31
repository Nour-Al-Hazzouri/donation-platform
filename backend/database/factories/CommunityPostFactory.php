<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\DonationEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CommunityPost>
 */
class CommunityPostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'user_id' => User::factory(),
            'event_id' => DonationEvent::factory(),
            'content' => $this->faker->paragraphs($this->faker->numberBetween(1, 5), true),
            'images' => $this->faker->optional(0.7, [])->randomElements([
                'https://picsum.photos/800/600?random=1',
                'https://picsum.photos/800/600?random=2',
                'https://picsum.photos/800/600?random=3',
                'https://picsum.photos/800/600?random=4',
            ], $this->faker->numberBetween(1, 4)),
            'tags' => $this->faker->optional(0.8, [])->randomElements(
                ['donation', 'help', 'charity', 'community', 'support', 'volunteer', 'fundraising', 'donate'],
                $this->faker->numberBetween(1, 5)
            ),
        ];
    }
}
