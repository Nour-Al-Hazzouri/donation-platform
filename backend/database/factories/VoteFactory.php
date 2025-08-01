<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\CommunityPost;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vote>
 */
class VoteFactory extends Factory
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
            'post_id' => CommunityPost::factory(),
            'type' => $this->faker->randomElement(['upvote', 'downvote']),
        ];
    }
}
