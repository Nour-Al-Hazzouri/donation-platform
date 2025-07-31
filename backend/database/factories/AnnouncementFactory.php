<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first() ?? User::factory(),
            'title' => $this->faker->sentence(),
            'content' => $this->faker->paragraphs(3, true),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            'images' => $this->faker->optional(0.7)->randomElements([
                'https://picsum.photos/800/600?random=1',
                'https://picsum.photos/800/600?random=2',
                'https://picsum.photos/800/600?random=3',
                'https://picsum.photos/800/600?random=4',
            ], $this->faker->numberBetween(1, 4)),
        ];
    }
}
