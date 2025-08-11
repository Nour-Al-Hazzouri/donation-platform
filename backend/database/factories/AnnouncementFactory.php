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
            'image_urls' => function (array $attributes) {
                if (app()->environment('testing') || !$this->faker->boolean(70)) {
                    return [];
                }

                $imageCount = $this->faker->numberBetween(1, 4);
                $images = [];

                for ($i = 0; $i < $imageCount; $i++) {
                    $image = \Illuminate\Http\UploadedFile::fake()->image('announcement_' . uniqid() . '.jpg', 800, 600);
                    $path = 'announcements/' . uniqid() . '.jpg';
                    \Illuminate\Support\Facades\Storage::disk('public')->put($path, file_get_contents($image));
                    $images[] = $path;
                }

                return $images;
            },
        ];
    }
}
