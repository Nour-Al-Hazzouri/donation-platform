<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\DonationEvent;
use App\Models\Location;
use App\Models\NotificationType;
use Database\Seeders\RoleSeeder;
use Database\Seeders\NotificationTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DonationEventSearchTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $location;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        $this->seed(NotificationTypeSeeder::class);

        // Create regular user
        $this->user = User::factory()->create();
        $this->user->assignRole('user');

        // Create a location
        $this->location = Location::factory()->create();

        // Authenticate the user for all requests
        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function it_can_search_donation_events_by_title()
    {
        // Create test data
        $event1 = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'location_id' => $this->location->id,
            'type' => 'request',
            'title' => 'Help needed for education',
            'status' => 'active'
        ]);

        $event2 = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'location_id' => $this->location->id,
            'type' => 'request',
            'title' => 'Medical bills assistance',
            'status' => 'active'
        ]);

        // Search by title
        $response = $this->getJson('/api/donation-events?query=education');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $event1->id);
    }

    /** @test */
    public function it_can_search_donation_events_by_username()
    {
        // Create a test user with a specific username
        $testUser = User::factory()->create([
            'username' => 'testdonor',
            'first_name' => 'Test',
            'last_name' => 'Donor'
        ]);

        $event1 = DonationEvent::factory()->create([
            'user_id' => $testUser->id,
            'location_id' => $this->location->id,
            'type' => 'request',
            'title' => 'Help needed',
            'status' => 'active'
        ]);

        // Search by username
        $response = $this->getJson('/api/donation-events?query=testdonor');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $event1->id);
    }

    /** @test */
    public function it_can_filter_events_by_type()
    {
        // Create test data
        $offerEvent = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'location_id' => $this->location->id,
            'type' => 'offer',
            'title' => 'Free food available',
            'status' => 'active'
        ]);

        $requestEvent = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'location_id' => $this->location->id,
            'type' => 'request',
            'title' => 'Need food assistance',
            'status' => 'active'
        ]);

        // Filter by offer type
        $response = $this->getJson('/api/donation-events?type=offer');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $offerEvent->id);

        // Filter by request type
        $response = $this->getJson('/api/donation-events?type=request');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $requestEvent->id);
    }

    /** @test */
    public function it_returns_empty_when_no_matches_found()
    {
        DonationEvent::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'location_id' => $this->location->id,
            'type' => 'request',
            'status' => 'active'
        ]);

        $response = $this->getJson('/api/donation-events?query=nonexistent');

        $response->assertStatus(200)
            ->assertJsonCount(0, 'data');
    }

    /** @test */
    public function it_does_not_require_search_query_parameter()
    {
        DonationEvent::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'location_id' => $this->location->id,
            'type' => 'request',
            'status' => 'active'
        ]);

        $response = $this->getJson('/api/donation-events');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function it_respects_pagination_parameters()
    {
        // Create 25 test events
        DonationEvent::factory()->count(25)->create([
            'user_id' => $this->user->id,
            'location_id' => $this->location->id,
            'type' => 'request',
            'status' => 'active',
            'title' => 'Test Event'
        ]);

        $response = $this->getJson('/api/donation-events?query=Test&per_page=10');

        $response->assertStatus(200)
            ->assertJson([
                'meta' => [
                    'per_page' => 10,
                    'current_page' => 1,
                    'last_page' => 3,
                    'total' => 25
                ]
            ]);
    }

    /** @test */
    public function it_filters_events_by_location()
    {
        // Create a different location
        $otherLocation = Location::factory()->create();

        // Create events in different locations
        $event1 = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'location_id' => $this->location->id,
            'type' => 'request',
            'title' => 'Event in location 1',
            'status' => 'active'
        ]);

        $event2 = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'location_id' => $otherLocation->id,
            'type' => 'request',
            'title' => 'Event in location 2',
            'status' => 'active'
        ]);

        // Filter by first location
        $response = $this->getJson("/api/donation-events?location_id={$this->location->id}");
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $event1->id);

        // Filter by second location
        $response = $this->getJson("/api/donation-events?location_id={$otherLocation->id}");
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $event2->id);
    }
}
