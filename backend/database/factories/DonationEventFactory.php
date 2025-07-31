<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DonationEvent>
 */
class DonationEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['active', 'completed', 'cancelled', 'suspended'];

        return [
            'user_id' => User::factory(),
            'location_id' => Location::inRandomOrder()->first()->id,
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraphs(3, true),
            'images' => $this->faker->optional(0.7, [])->randomElements([
                'https://picsum.photos/800/600?random=1',
                'https://picsum.photos/800/600?random=2',
                'https://picsum.photos/800/600?random=3',
                'https://picsum.photos/800/600?random=4',
            ], $this->faker->numberBetween(1, 4)),
            'goal_amount' => $this->faker->randomFloat(2, 1000, 100000),
            'current_amount' => fn (array $attributes) => $this->faker->randomFloat(2, 0, $attributes['goal_amount'] * 0.8),
            'possible_amount' => fn (array $attributes) => $this->faker->randomFloat(2, $attributes['current_amount'], $attributes['goal_amount'] * 1.2),
            'status' => $this->faker->randomElement($statuses),
        ];
    }
}
