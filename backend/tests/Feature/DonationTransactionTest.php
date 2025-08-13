<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\DonationEvent;
use App\Models\DonationTransaction;
use App\Models\NotificationType;
use Database\Seeders\RoleSeeder;
use Database\Seeders\NotificationTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class DonationTransactionTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $eventOwner;
    protected $donationRequest;
    protected $donationOffer;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles and permissions
        $this->seed(RoleSeeder::class);
        $this->seed(NotificationTypeSeeder::class);

        // Create test users
        $this->user = User::factory()->create();
        $this->user->assignRole('user');

        // Create approved verification request for user
        $this->user->verifications()->create([
            'document_type' => 'id_card',
            'image_urls' => ['verifications/1/test.jpg'],
            'status' => 'approved',
            'verified_at' => now()
        ]);

        $this->eventOwner = User::factory()->create();
        $this->eventOwner->assignRole('user');

        // Create approved verification request for event owner
        $this->eventOwner->verifications()->create([
            'document_type' => 'id_card',
            'image_urls' => ['verifications/1/test.jpg'],
            'status' => 'approved',
            'verified_at' => now()
        ]);

        // Create test events
        $this->donationRequest = DonationEvent::factory()->create([
            'user_id' => $this->eventOwner->id,
            'type' => 'request',
            'goal_amount' => 1000,
            'current_amount' => 0,
            'possible_amount' => 0,
            'status' => 'active'
        ]);

        $this->donationOffer = DonationEvent::factory()->create([
            'user_id' => $this->eventOwner->id,
            'type' => 'offer',
            'goal_amount' => 1000,
            'current_amount' => 500, // Start with some amount for testing claims
            'possible_amount' => 500,
            'status' => 'active'
        ]);
    }

    protected function getNotificationTypeId(string $typeName): int
    {
        return NotificationType::where('name', $typeName)->value('id');
    }

    /** @test */
    public function unauthenticated_user_cannot_create_transaction()
    {
        $response = $this->postJson("/api/donation-events/{$this->donationRequest->id}/transactions", [
            'amount' => 100
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function unverified_user_cannot_create_transaction()
    {
        // Create a user without verification
        $unverifiedUser = User::factory()->create();
        $unverifiedUser->assignRole('user');

        $response = $this->actingAs($unverifiedUser)
            ->postJson("/api/donation-events/{$this->donationRequest->id}/transactions", [
                'amount' => 100,
            ]);

        $response->assertStatus(403);

        // Verify no transaction was created
        $this->assertDatabaseCount('donation_transactions', 0);
    }

    /** @test */
    public function user_can_create_contribution_transaction()
    {
        $this->actingAs($this->user);

        $response = $this->postJson("/api/donation-events/{$this->donationRequest->id}/transactions", [
            'amount' => 100,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'amount',
                    'status',
                    'transaction_type',
                    'user' => ['id', 'username'],
                    'event' => ['id', 'title']
                ]
            ]);

        $this->assertDatabaseHas('donation_transactions', [
            'user_id' => $this->user->id,
            'event_id' => $this->donationRequest->id,
            'transaction_type' => 'contribution',
            'amount' => 100,
            'status' => 'pending'
        ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->eventOwner->id,
            'type_id' => $this->getNotificationTypeId('transaction_contribution'),
        ]);

        // Verify the notification data contains the expected fields
        $notification = \App\Models\Notification::where('user_id', $this->eventOwner->id)
            ->where('type_id', $this->getNotificationTypeId('transaction_contribution'))
            ->first();

        $this->assertNotNull($notification);
        $this->assertEquals($this->user->id, $notification->data['user_id']);
        $this->assertEquals($this->donationRequest->id, $notification->data['event_id']);
        $this->assertEquals($response->json('data.id'), $notification->data['transaction_id']);
    }

    /** @test */
    public function user_can_create_claim_transaction()
    {
        $this->actingAs($this->user);

        $response = $this->postJson("/api/donation-events/{$this->donationOffer->id}/transactions", [
            'amount' => 100,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'transaction_type' => 'claim',
                    'status' => 'pending'
                ]
            ]);

            $this->assertDatabaseHas('donation_transactions', [
                'user_id' => $this->user->id,
                'event_id' => $this->donationOffer->id,
                'transaction_type' => 'claim',
                'amount' => 100,
                'status' => 'pending'
            ]);

            $this->assertDatabaseHas('notifications', [
                'user_id' => $this->eventOwner->id,
                'type_id' => $this->getNotificationTypeId('transaction_claim'),
            ]);

            // Verify the notification data contains the expected fields
            $notification = \App\Models\Notification::where('user_id', $this->eventOwner->id)
                ->where('type_id', $this->getNotificationTypeId('transaction_claim'))
                ->first();

            $this->assertNotNull($notification);
            $this->assertEquals($this->user->id, $notification->data['user_id']);
            $this->assertEquals($this->donationOffer->id, $notification->data['event_id']);
            $this->assertEquals($response->json('data.id'), $notification->data['transaction_id']);
    }

    /** @test */
    public function cannot_claim_more_than_available()
    {
        $this->actingAs($this->user);

        // Try to claim more than what's available
        $response = $this->postJson("/api/donation-events/{$this->donationOffer->id}/transactions", [
            'amount' => 600, // Only 500 available
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseCount('donation_transactions', 0);
    }

    /** @test */
    public function event_owner_can_approve_transaction()
    {
        // Create a pending transaction
        $transaction = DonationTransaction::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->donationRequest->id,
            'transaction_type' => 'contribution',
            'amount' => 100,
            'status' => 'pending'
        ]);

        // Act as event owner
        $this->actingAs($this->eventOwner);

        $response = $this->putJson("/api/donation-transactions/{$transaction->id}/status", [
            'status' => 'approved'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'status' => 'approved'
                ]
            ]);

        // Verify event amounts were updated
        $this->assertEquals(100, $this->donationRequest->fresh()->current_amount);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->user->id,
            'type_id' => $this->getNotificationTypeId('transaction_approved'),
        ]);

        // Verify the notification data contains the expected fields
        $notification = \App\Models\Notification::where('user_id', $this->user->id)
            ->where('type_id', $this->getNotificationTypeId('transaction_approved'))
            ->first();

        $this->assertNotNull($notification);
        $this->assertEquals($this->user->id, $notification->data['user_id']);
        $this->assertEquals($this->donationRequest->id, $notification->data['event_id']);
        $this->assertEquals($response->json('data.id'), $notification->data['transaction_id']);
    }

    /** @test */
    public function non_owner_cannot_approve_transaction()
    {
        $transaction = DonationTransaction::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->donationRequest->id,
            'transaction_type' => 'contribution',
            'amount' => 100,
            'status' => 'pending'
        ]);

        // Act as a different user
        $otherUser = User::factory()->create();
        $this->actingAs($otherUser);

        $response = $this->putJson("/api/donation-transactions/{$transaction->id}/status", [
            'status' => 'approved'
        ]);

        $response->assertStatus(403);

        // Verify status wasn't changed
        $this->assertEquals('pending', $transaction->fresh()->status);

        $this->assertDatabaseMissing('notifications', [
            'user_id' => $this->user->id,
            'type_id' => $this->getNotificationTypeId('transaction_approved'),
        ]);
    }

    /** @test */
    public function user_can_view_own_transactions()
    {
        // Create some transactions
        $transactions = DonationTransaction::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'event_id' => $this->donationRequest->id,
            'transaction_type' => 'contribution',
            'amount' => 100,
            'status' => 'pending'
        ]);

        // Create transactions by other users
        DonationTransaction::factory()->count(2)->create([
            'user_id' => $this->eventOwner->id,
            'event_id' => $this->donationRequest->id,
            'transaction_type' => 'contribution',
            'amount' => 50,
            'status' => 'pending'
        ]);

        $this->actingAs($this->user);

        $response = $this->getJson('/api/donation-transactions');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function user_can_view_own_transaction_details()
    {
        $transaction = DonationTransaction::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->donationRequest->id,
            'transaction_type' => 'contribution',
            'amount' => 100,
            'status' => 'pending'
        ]);

        $this->actingAs($this->user);

        $response = $this->getJson("/api/donation-transactions/{$transaction->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $transaction->id,
                    'amount' => 100,
                    'status' => 'pending',
                    'transaction_type' => 'contribution'
                ]
            ]);
    }

    /** @test */
    public function user_cannot_view_others_transaction_details()
    {
        $otherUser = User::factory()->create();
        $transaction = DonationTransaction::factory()->create([
            'user_id' => $otherUser->id,
            'event_id' => $this->donationRequest->id,
            'transaction_type' => 'contribution',
            'amount' => 100,
            'status' => 'pending'
        ]);

        $this->actingAs($this->user);

        $response = $this->getJson("/api/donation-transactions/{$transaction->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function event_owner_can_view_transactions_for_their_events()
    {
        // Create a transaction for the event
        $transaction = DonationTransaction::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->donationRequest->id,
            'transaction_type' => 'contribution',
            'amount' => 100,
            'status' => 'pending'
        ]);

        // Log in as event owner
        $this->actingAs($this->eventOwner);

        // Test listing transactions for a specific event
        $response = $this->getJson("/api/donation-events/{$this->donationRequest->id}/transactions");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'id' => $transaction->id,
                        'amount' => '100.00',
                        'transaction_type' => 'contribution',
                        'status' => 'pending',
                        'user' => [
                            'id' => $this->user->id,
                            'username' => $this->user->username
                        ],
                        'event' => [
                            'id' => $this->donationRequest->id
                        ]
                    ]
                ]
            ]);
    }

    /** @test */
    public function transaction_amounts_are_updated_when_approved()
    {
        // Test contribution
        $contribution = DonationTransaction::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->donationRequest->id,
            'transaction_type' => 'contribution',
            'amount' => 100,
            'status' => 'pending'
        ]);

        $this->actingAs($this->eventOwner);

        // Approve the contribution
        $this->putJson("/api/donation-transactions/{$contribution->id}/status", [
                'status' => 'approved'
            ]);

        $this->assertEquals(100, $this->donationRequest->fresh()->current_amount);

        // Test claim
        $claim = DonationTransaction::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->donationOffer->id,
            'transaction_type' => 'claim',
            'amount' => 100,
            'status' => 'pending'
        ]);

        // Approve the claim
        $this->putJson("/api/donation-transactions/{$claim->id}/status", [
            'status' => 'approved'
        ]);

        $this->assertEquals(400, $this->donationOffer->fresh()->current_amount);
        $this->assertEquals(400, $this->donationOffer->fresh()->possible_amount);
    }

    /** @test */
    public function transaction_status_can_be_declined()
    {
        $transaction = DonationTransaction::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->donationRequest->id,
            'transaction_type' => 'contribution',
            'amount' => 100,
            'status' => 'pending'
        ]);

        $response = $this->actingAs($this->eventOwner)
            ->putJson("/api/donation-transactions/{$transaction->id}/status", [
                'status' => 'declined'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'status' => 'declined'
                ]
            ]);

        $this->assertDatabaseHas('donation_transactions', [
            'id' => $transaction->id,
            'status' => 'declined'
        ]);

        $this->assertEquals(0, $this->donationRequest->fresh()->current_amount);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->user->id,
            'type_id' => $this->getNotificationTypeId('transaction_rejected'),
        ]);

        $notification = \App\Models\Notification::where('user_id', $this->user->id)
            ->where('type_id', $this->getNotificationTypeId('transaction_rejected'))
            ->first();

        $this->assertNotNull($notification);
        $this->assertEquals($this->user->id, $notification->data['user_id']);
        $this->assertEquals($this->donationRequest->id, $notification->data['event_id']);
        $this->assertEquals($response->json('data.id'), $notification->data['transaction_id']);
    }

    /** @test */
    public function event_status_updates_to_completed_when_goal_reached()
    {
        // Set the current amount to be just below the goal
        $this->donationRequest->update([
            'current_amount' => 900,
            'goal_amount' => 1000,
            'status' => 'active'
        ]);

        // Create a transaction that will reach the goal when approved
        $transaction = DonationTransaction::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->donationRequest->id,
            'transaction_type' => 'contribution',
            'amount' => 100,
            'status' => 'pending'
        ]);

        // Approve the transaction
        $response = $this->actingAs($this->eventOwner, 'sanctum')
            ->putJson("/api/donation-transactions/{$transaction->id}/status", [
                'status' => 'approved'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'status' => 'approved'
                ]
            ]);

        // Refresh the event from database
        $this->donationRequest->refresh();

        // Assert the event status is now completed
        $this->assertEquals('completed', $this->donationRequest->status);
        $this->assertEquals(1000, $this->donationRequest->current_amount);

        // Assert notification was created
        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->eventOwner->id,
            'type_id' => $this->getNotificationTypeId('donation_goal_reached'),
        ]);

        $notification = \App\Models\Notification::where('user_id', $this->eventOwner->id)
            ->where('type_id', $this->getNotificationTypeId('donation_goal_reached'))
            ->first();

        $this->assertNotNull($notification);
        $this->assertEquals($this->eventOwner->id, $notification->data['user_id']);
        $this->assertEquals($this->donationRequest->title, $notification->data['event_title']);
        $this->assertEquals(1000, $notification->data['goal_amount']);
        $this->assertEquals(1000, $notification->data['current_amount']);
    }
}
