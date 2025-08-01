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
        $verifier = User::inRandomOrder()->first() ?? User::factory()->create();
        
        return [
            'user_id' => User::factory(),
            'verifier_id' => $status !== 'pending' ? $verifier->id : null,
            'document_type' => $this->faker->randomElement(['id_card', 'passport', 'driver_license']),
            'document_url' => 'documents/' . $this->faker->uuid() . '.jpg',
            'status' => $status,
            'notes' => $this->faker->optional(0.7)->sentence(),
            'verified_at' => $status !== 'pending' ? $this->faker->dateTimeBetween('-1 year') : null,
        ];
    }
}
