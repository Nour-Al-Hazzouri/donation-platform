<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\DonationEvent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DonationEventSearchTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        
        // Create roles if they don't exist
        if (!Role::where('name', 'admin')->exists()) {
            // Create permissions
            $permissions = [
                'view donation_events',
                'create donation_events',
                'edit donation_events',
                'delete donation_events',
                'manage donation_events',
            ];
            
            foreach ($permissions as $permission) {
                Permission::firstOrCreate(['name' => $permission]);
            }
            
            // Create admin role and assign permissions
            $adminRole = Role::firstOrCreate(['name' => 'admin']);
            $adminRole->syncPermissions($permissions);
        }
        
        // Create a test user with admin role
        $this->user = User::factory()->create([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'is_verified' => true
        ]);
        
        $this->user->assignRole('admin');
        
        // Authenticate the user for all requests
        $this->actingAs($this->user, 'sanctum');
    }

    /** @test */
    public function it_can_search_donation_requests_by_title()
    {
        // Create test data
        $user1 = User::factory()->create(['username' => 'johndoe']);
        $user2 = User::factory()->create(['username' => 'janedoe']);
        
        $event1 = DonationEvent::factory()->create([
            'user_id' => $user1->id,
            'type' => 'request',
            'title' => 'Help needed for education',
            'status' => 'active'
        ]);
        
        $event2 = DonationEvent::factory()->create([
            'user_id' => $user2->id,
            'type' => 'request',
            'title' => 'Medical bills assistance',
            'status' => 'active'
        ]);

        // Search by title
        $response = $this->getJson('/api/donation-events/requests/search?query=education');
        
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $event1->id);
    }

    /** @test */
    public function it_can_search_donation_requests_by_username()
    {
        // Create test data
        $user1 = User::factory()->create(['username' => 'johndoe']);
        $user2 = User::factory()->create(['username' => 'janedoe']);
        
        $event1 = DonationEvent::factory()->create([
            'user_id' => $user1->id,
            'type' => 'request',
            'title' => 'Help needed for education',
            'status' => 'active'
        ]);
        
        $event2 = DonationEvent::factory()->create([
            'user_id' => $user2->id,
            'type' => 'request',
            'title' => 'Medical bills assistance',
            'status' => 'active'
        ]);

        // Search by username
        $response = $this->getJson('/api/donation-events/requests/search?query=johndoe');
        
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $event1->id);
    }

    /** @test */
    public function it_can_search_donation_offers()
    {
        // Create test data
        $user1 = User::factory()->create(['username' => 'foodlover']);
        
        $event1 = DonationEvent::factory()->create([
            'user_id' => $user1->id,
            'type' => 'offer',
            'title' => 'Free food available',
            'status' => 'active'
        ]);
        
        $event2 = DonationEvent::factory()->create([
            'user_id' => $user1->id,
            'type' => 'offer',
            'title' => 'Clothes donation',
            'status' => 'active'
        ]);

        // Search offers
        $response = $this->getJson('/api/donation-events/offers/search?query=food');
        
        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $event1->id);
    }

    /** @test */
    public function it_returns_empty_when_no_matches_found()
    {
        DonationEvent::factory()->count(3)->create([
            'type' => 'request', 
            'status' => 'active'
        ]);
        
        $response = $this->getJson('/api/donation-events/requests/search?query=nonexistent');
        
        $response->assertStatus(200)
            ->assertJsonCount(0, 'data');
    }

    /** @test */
    public function it_requires_search_query_parameter()
    {
        $response = $this->getJson('/api/donation-events/requests/search');
        
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['query']);
    }

    /** @test */
    public function it_respects_pagination_parameters()
    {
        // Create 25 test events
        $user = User::factory()->create();
        DonationEvent::factory()->count(25)->create([
            'user_id' => $user->id,
            'type' => 'request',
            'status' => 'active',
            'title' => 'Test Event'
        ]);
        
        $response = $this->getJson('/api/donation-events/requests/search?query=Test&per_page=10');
        
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
    public function it_only_returns_active_events()
    {
        $user = User::factory()->create(['username' => 'testcreator']);
        
        // Create active and inactive events
        $activeEvent = DonationEvent::factory()->create([
            'user_id' => $user->id,
            'type' => 'request',
            'title' => 'Active event',
            'status' => 'active'
        ]);
        
        $inactiveEvent = DonationEvent::factory()->create([
            'user_id' => $user->id,
            'type' => 'request',
            'title' => 'Inactive event',
            'status' => 'completed'
        ]);
        
        $response = $this->getJson('/api/donation-events/requests/search?query=event');
        
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $activeEvent->id);
    }
}
