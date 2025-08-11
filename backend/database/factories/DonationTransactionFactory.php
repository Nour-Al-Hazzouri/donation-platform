<?php

namespace Database\Factories;

use App\Models\DonationEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DonationTransaction>
 */
class DonationTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $event = DonationEvent::inRandomOrder()->first() ?? DonationEvent::factory()->create();
        $user = User::inRandomOrder()->first() ?? User::factory()->create();
        
        $type = $this->faker->randomElement(['contribution', 'claim']);
        
        // Ensure amount is valid for claim transactions
        $maxAmount = $type === 'claim' ? $event->current_amount : 1000;
        $amount = $this->faker->numberBetween(1, $maxAmount ?: 1000);
        
        return [
            'user_id' => $user->id,
            'event_id' => $event->id,
            'transaction_type' => $type,
            'amount' => $amount,
            'status' => $this->faker->randomElement(['pending', 'approved', 'declined']),
            'transaction_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
    
    /**
     * Configure the model factory to create a contribution transaction.
     */
    public function contribution(): static
    {
        return $this->state(fn (array $attributes) => [
            'transaction_type' => 'contribution',
        ]);
    }
    
    /**
     * Configure the model factory to create a claim transaction.
     */
    public function claim(): static
    {
        return $this->state(fn (array $attributes) => [
            'transaction_type' => 'claim',
        ]);
    }
    
    /**
     * Configure the model factory to set a specific status.
     */
    public function status(string $status): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => $status,
        ]);
    }
}
