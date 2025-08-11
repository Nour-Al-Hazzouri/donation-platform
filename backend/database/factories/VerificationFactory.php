<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Verification>
 */
class VerificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['pending', 'approved', 'rejected']);
        $verifier = User::inRandomOrder()->where('role', 'admin')->first() ?? User::factory()->create(['role' => 'admin']);
        $verifier->assignRole('admin');
        $userId = User::inRandomOrder()->first()?->id ?? User::factory()->create()->id;

        // Generate 1-3 random document paths
        $imageUrls = array_map(function() use ($userId) {
            $timestamp = now()->format('YmdHis');
            $random = $this->faker->uuid();
            return "verifications/{$userId}/{$timestamp}-{$random}.jpg";
        }, range(1, rand(1, 3)));

        return [
            'user_id' => $userId,
            'verifier_id' => $status !== 'pending' ? $verifier->id : null,
            'document_type' => $this->faker->randomElement(['id_card', 'passport', 'driver_license']),
            'image_urls' => $imageUrls,
            'status' => $status,
            'notes' => $status !== 'pending' ? $this->faker->optional(0.7)->sentence() : null,
            'verified_at' => $status !== 'pending' ? $this->faker->dateTimeBetween('-1 year') : null,
            'created_at' => $this->faker->dateTimeBetween('-1 year'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year'),
        ];
    }
}
