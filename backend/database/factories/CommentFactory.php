<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\CommunityPost;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
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
            'content' => $this->faker->paragraph(),
        ];
    }
}
