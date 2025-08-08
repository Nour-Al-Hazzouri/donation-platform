<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Verification;
use App\Models\Location;

class DonationEventPolicyTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
    public function test_user_with_approved_verification_can_create()
{
    $user = User::factory()->create();
    $location = Location::factory()->create();
    Verification::factory()->create([
        'user_id' => $user->id,
        'status' => 'approved'
    ]);

    $this->actingAs($user, 'sanctum');
    $response = $this->postJson('/api/donation-events', [
        'title' => 'Test Event',
        'description' => 'Test Description',
        'goal_amount' => 1000,
        'type' => 'request',
        'location_id' => $location->id,
        // add other required fields if needed
    ]);

    $response->assertStatus(201);
}

public function test_user_without_approved_verification_cannot_create()
{
    $user = User::factory()->create();
    $location = Location::factory()->create();
    $this->actingAs($user, 'sanctum');
    $response = $this->postJson('/api/donation-events', [
        'title' => 'Test Event',
        'description' => 'Test Description',
        'goal_amount' => 1000,
        'type' => 'request',
        'location_id' => $location->id,
        // add other required fields if needed
    ]);

    $response->assertStatus(403); // Forbidden
}
}
