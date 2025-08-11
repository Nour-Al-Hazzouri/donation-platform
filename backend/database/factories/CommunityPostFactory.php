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
            'image_urls' => function (array $attributes) {
                if (app()->environment('testing') || !$this->faker->boolean(70)) {
                    return [];
                }

                $imageCount = $this->faker->numberBetween(1, 4);
                $images = [];

                for ($i = 0; $i < $imageCount; $i++) {
                    $image = \Illuminate\Http\UploadedFile::fake()->image('post_' . uniqid() . '.jpg', 800, 600);
                    $path = 'community/posts/' . uniqid() . '.jpg';
                    \Illuminate\Support\Facades\Storage::disk('public')->put($path, file_get_contents($image));
                    $images[] = $path;
                }

                return $images;
            },
            'tags' => $this->faker->optional(0.8, [])->randomElements(
                ['donation', 'help', 'charity', 'community', 'support', 'volunteer', 'fundraising', 'donate'],
                $this->faker->numberBetween(1, 5)
            ),
        ];
    }
}
