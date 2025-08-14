<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\DonationEvent;
use App\Models\Location;
use App\Models\NotificationType;
use App\Models\Verification;
use Database\Seeders\RoleSeeder;
use Database\Seeders\NotificationTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DonationEventTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $user;
    protected $location;
    protected $donationEvent;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        $this->seed(NotificationTypeSeeder::class);

        // Create admin user
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        // Create regular user
        $this->user = User::factory()->create();
        $this->user->assignRole('user');

        // Create a verification for the user
        Verification::create([
            'user_id' => $this->user->id,
            'document_type' => 'id_card',
            'image_urls' => ['verifications/1/test.jpg'],
            'status' => 'approved',
        ]);

        // Create a location
        $this->location = Location::factory()->create();

        // Create a donation event
        $this->donationEvent = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'location_id' => $this->location->id,
            'title' => 'Test Donation Event',
            'description' => 'This is a test donation event',
            'goal_amount' => 1000.00,
            'current_amount' => 0,
            'possible_amount' => 0,
            'type' => 'request',
            'status' => 'active'
        ]);
    }

    protected function getNotificationTypeId(string $typeName): int
    {
        return NotificationType::where('name', $typeName)->value('id');
    }

    /** @test */
    public function it_can_list_donation_events()
    {
        // Create some test donation events
        DonationEvent::factory()->count(3)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/donation-events');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'description',
                        'goal_amount',
                        'current_amount',
                        'possible_amount',
                        'type',
                        'status',
                        'user' => [
                            'id',
                            'first_name',
                            'last_name',
                        ],
                        'location' => [
                            'id',
                            'governorate',
                            'district',
                        ]
                    ]
                ],
                'message'
            ]);
    }

    /** @test */
    public function it_can_show_a_donation_event()
    {
        $response = $this->actingAs($this->user)
            ->getJson("/api/donation-events/{$this->donationEvent->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $this->donationEvent->id,
                    'title' => $this->donationEvent->title,
                    'description' => $this->donationEvent->description,
                ],
                'message' => 'Donation event retrieved successfully.'
            ]);
    }

    /** @test */
    public function it_requires_authentication_to_create_donation_event()
    {
        $response = $this->postJson('/api/donation-events', []);
        $response->assertStatus(401);
    }

    /** @test */
    public function it_requires_verification_to_create_donation_event()
    {
        // Create an unverified user
        $unverifiedUser = User::factory()->create();
        $unverifiedUser->assignRole('user');

        // Create a location for the test
        $location = Location::factory()->create();

        Sanctum::actingAs($unverifiedUser);

        // Create valid donation event data
        $donationEventData = [
            'title' => 'Test Event',
            'description' => 'Test Description',
            'goal_amount' => 1000,
            'type' => 'request',
            'location_id' => $location->id,
        ];

        $response = $this->postJson('/api/donation-events', $donationEventData);

        // Should be forbidden due to missing verification
        $response->assertStatus(403);
    }

    /** @test */
    public function it_can_create_a_donation_event()
    {
        Sanctum::actingAs($this->user);

        $donationEventData = [
            'title' => 'New Donation Event',
            'description' => 'This is a new donation event',
            'location_id' => $this->location->id,
            'goal_amount' => 2000.00,
            'type' => 'request',
            'status' => 'active',
        ];

        $response = $this->postJson('/api/donation-events', $donationEventData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'title' => 'New Donation Event',
                    'description' => 'This is a new donation event',
                    'goal_amount' => '2000.00',
                    'current_amount' => '0.00',
                    'possible_amount' => '0.00',
                    'type' => 'request',
                    'status' => 'active',
                ],
                'message' => 'Donation event created successfully.'
            ]);

        $this->assertDatabaseHas('donation_events', [
            'title' => 'New Donation Event',
            'user_id' => $this->user->id,
        ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->user->id,
            'type_id' => $this->getNotificationTypeId('event_created_success'),
            'message' => 'Your event "New Donation Event" has been created successfully',
        ]);

    }

    /** @test */
    public function it_validates_required_fields_when_creating_donation_event()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/donation-events', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'title',
                'description',
                'location_id',
                'goal_amount',
                'type',
            ]);
    }

    /** @test */
    public function it_can_update_a_donation_event()
    {
        Sanctum::actingAs($this->user);

        $updateData = [
            'title' => 'Updated Donation Event',
            'description' => 'This is an updated description',
            'goal_amount' => 1500.00,
            'type' => 'request',
        ];

        $response = $this->putJson("/api/donation-events/{$this->donationEvent->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'title' => 'Updated Donation Event',
                    'description' => 'This is an updated description',
                    'goal_amount' => '1500.00',
                    'type' => 'request',
                ],
                'message' => 'Donation event updated successfully.'
            ]);
    }

    /** @test */
    public function it_prevents_unauthorized_updates()
    {
        // Create another user
        $otherUser = User::factory()->create();
        $otherUser->assignRole('user');

        // Create a verification for the other user
        Verification::create([
            'user_id' => $otherUser->id,
            'document_type' => 'id_card',
            'image_urls' => ['verifications/1/test.jpg'],
            'status' => 'approved',
        ]);

        Sanctum::actingAs($otherUser);

        $updateData = [
            'title' => 'Unauthorized Update',
        ];

        $response = $this->putJson("/api/donation-events/{$this->donationEvent->id}", $updateData);
        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_update_any_donation_event()
    {
        Sanctum::actingAs($this->admin);

        $updateData = [
            'title' => 'Admin Updated Event',
            'description' => 'This was updated by admin',
        ];

        $response = $this->putJson("/api/donation-events/{$this->donationEvent->id}", $updateData);
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'title' => 'Admin Updated Event',
                    'description' => 'This was updated by admin',
                ],
                'message' => 'Donation event updated successfully.'
            ]);
    }

    /** @test */
    public function it_can_delete_a_donation_event()
    {
        Sanctum::actingAs($this->user);

        $response = $this->deleteJson("/api/donation-events/{$this->donationEvent->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Donation event deleted successfully.'
            ]);

        $this->assertSoftDeleted('donation_events', [
            'id' => $this->donationEvent->id
        ]);
    }

    /** @test */
    public function it_prevents_unauthorized_deletion()
    {
        // Create another user
        $otherUser = User::factory()->create();
        $otherUser->assignRole('user');

        // Create a verification for the other user
        Verification::create([
            'user_id' => $otherUser->id,
            'document_type' => 'id_card',
            'image_urls' => ['verifications/1/test.jpg'],
            'status' => 'approved',
        ]);

        Sanctum::actingAs($otherUser);

        $response = $this->deleteJson("/api/donation-events/{$this->donationEvent->id}");
        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_delete_any_donation_event()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->deleteJson("/api/donation-events/{$this->donationEvent->id}");
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Donation event deleted successfully.'
            ]);

        $this->assertSoftDeleted('donation_events', [
            'id' => $this->donationEvent->id
        ]);
    }

    /** @test */
    public function it_can_activate_a_suspended_donation_event()
    {
        Sanctum::actingAs($this->user);

        // Create a suspended donation event
        $donationEvent = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'suspended'
        ]);

        $response = $this->postJson("/api/donation-events/{$donationEvent->id}/activate");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Donation event activated successfully.',
                'data' => [
                    'id' => $donationEvent->id,
                    'status' => 'active'
                ]
            ]);

        $this->assertDatabaseHas('donation_events', [
            'id' => $donationEvent->id,
            'status' => 'active'
        ]);
    }

    /** @test */
    public function it_can_cancel_an_active_donation_event()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/donation-events/{$this->donationEvent->id}/cancel");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Donation event cancelled successfully.',
                'data' => [
                    'id' => $this->donationEvent->id,
                    'status' => 'cancelled'
                ]
            ]);

        $this->assertDatabaseHas('donation_events', [
            'id' => $this->donationEvent->id,
            'status' => 'cancelled'
        ]);
    }

    /** @test */
    public function it_can_suspend_an_active_donation_event()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/donation-events/{$this->donationEvent->id}/suspend");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Donation event suspended successfully.',
                'data' => [
                    'id' => $this->donationEvent->id,
                    'status' => 'suspended'
                ]
            ]);

        $this->assertDatabaseHas('donation_events', [
            'id' => $this->donationEvent->id,
            'status' => 'suspended'
        ]);
    }

    /** @test */
    public function it_prevents_activating_non_suspended_events()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/donation-events/{$this->donationEvent->id}/activate");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Only suspended donation events can be activated.'
            ]);
    }

    /** @test */
    public function it_prevents_cancelling_non_active_events()
    {
        Sanctum::actingAs($this->user);

        // Create a cancelled event
        $cancelledEvent = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'cancelled'
        ]);

        $response = $this->postJson("/api/donation-events/{$cancelledEvent->id}/cancel");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Only active donation events can be cancelled.'
            ]);
    }

    /** @test */
    public function it_prevents_suspending_non_active_events()
    {
        Sanctum::actingAs($this->user);

        // Create a completed event
        $completedEvent = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'completed'
        ]);

        $response = $this->postJson("/api/donation-events/{$completedEvent->id}/suspend");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Only active donation events can be suspended.'
            ]);
    }

    /** @test */
    public function it_prevents_unauthorized_status_changes()
    {
        // Create another user
        $otherUser = User::factory()->create();
        $otherUser->assignRole('user');

        // Create a verification for the other user
        Verification::create([
            'user_id' => $otherUser->id,
            'document_type' => 'id_card',
            'image_urls' => ['verifications/2/test.jpg'],
            'status' => 'approved',
        ]);

        Sanctum::actingAs($otherUser);

        // Test activate
        $suspendedEvent = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'suspended'
        ]);

        $response = $this->postJson("/api/donation-events/{$suspendedEvent->id}/activate");
        $response->assertStatus(403);

        // Test cancel
        $activeEvent = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'active'
        ]);

        $response = $this->postJson("/api/donation-events/{$activeEvent->id}/cancel");
        $response->assertStatus(403);

        // Test suspend
        $response = $this->postJson("/api/donation-events/{$this->donationEvent->id}/suspend");
        $response->assertStatus(403);
    }
}
