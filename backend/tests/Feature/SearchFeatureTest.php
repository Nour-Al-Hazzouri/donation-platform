<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Verification;
use App\Models\Location;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class SearchFeatureTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $user;
    protected $verification;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        
        // Create admin role and permissions
        $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        
        $permissions = [
            'manage users',
            'view users',
            'view verifications',
            'manage verifications',
        ];
        
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }
        
        // Create admin user
        $this->admin = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);
        
        $this->admin->assignRole($adminRole);
        $this->admin->givePermissionTo($permissions);
        
        // Create a location
        $location = Location::create([
            'governorate' => 'Test Governorate',
            'district' => 'Test District',
            'sub_district' => 'Test Sub-District',
            'village' => 'Test Village'
        ]);
        
        // Create regular user
        $this->user = User::factory()->create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+1234567890',
            'username' => 'johndoe',
            'location_id' => $location->id,
            'password' => bcrypt('password'),
        ]);
        
        // Create verification request for the user
        $this->verification = Verification::create([
            'user_id' => $this->user->id,
            'document_type' => 'id_card',
            'image_urls' => ['verifications/test.jpg'],
            'status' => 'pending',
            'verified_at' => null,
            'rejection_reason' => null,
        ]);
        
        // Create additional test data
        User::factory(5)->create(['location_id' => $location->id]);
        Verification::factory(3)->create(['status' => 'pending']);
    }

    /** @test */
    public function it_can_search_users_by_different_criteria()
    {
        Sanctum::actingAs($this->admin);
        
        // Search by first name
        $response = $this->getJson('/api/users?query=John');
        $response->assertStatus(200)
            ->assertJsonFragment(['email' => 'john.doe@example.com']);
            
        // Search by last name
        $response = $this->getJson('/api/users?query=Doe');
        $response->assertStatus(200)
            ->assertJsonFragment(['email' => 'john.doe@example.com']);
            
        // Search by email
        $response = $this->getJson('/api/users?query=john.doe@example.com');
        $response->assertStatus(200)
            ->assertJsonFragment(['email' => 'john.doe@example.com']);
            
        // Search by phone number
        $response = $this->getJson('/api/users?query=1234567890');
        $response->assertStatus(200)
            ->assertJsonFragment(['email' => 'john.doe@example.com']);
            
        // Search by username
        $response = $this->getJson('/api/users?query=johndoe');
        $response->assertStatus(200)
            ->assertJsonFragment(['email' => 'john.doe@example.com']);
    }
    
    /** @test */
    public function it_can_search_verification_requests()
    {
        Sanctum::actingAs($this->admin);
        
        // Search by user's first name
        $response = $this->getJson('/api/verifications?query=John');
        $response->assertStatus(200)
            ->assertJsonFragment(['user_id' => $this->user->id]);
            
        // Search by user's last name
        $response = $this->getJson('/api/verifications?query=Doe');
        $response->assertStatus(200)
            ->assertJsonFragment(['user_id' => $this->user->id]);
            
        // Search by user's email
        $response = $this->getJson('/api/verifications?query=john.doe@example.com');
        $response->assertStatus(200)
            ->assertJsonFragment(['user_id' => $this->user->id]);
    }
    
    /** @test */
    public function it_requires_authentication_to_search()
    {
        // User search
        $response = $this->getJson('/api/users?query=test');
        $response->assertStatus(401);
        
        // Verification search
        $response = $this->getJson('/api/verifications?query=test');
        $response->assertStatus(401);
    }
    
    /** @test */
    public function it_requires_admin_role_to_search()
    {
        Sanctum::actingAs($this->user);
        
        // User search
        $response = $this->getJson('/api/users?query=test');
        $response->assertStatus(403);
        
        // Verification search
        $response = $this->getJson('/api/verifications?query=test');
        $response->assertStatus(403);
    }
    
    /** @test */
    public function it_validates_search_input()
    {
        Sanctum::actingAs($this->admin);
        
        // Missing query parameter (should be allowed as it's optional)
        $response = $this->getJson('/api/users');
        $response->assertStatus(200);
        
        // Invalid per_page value
        $response = $this->getJson('/api/users?query=test&per_page=invalid');
        $response->assertStatus(422);
        
        // Valid per_page value
        $response = $this->getJson('/api/users?query=test&per_page=5');
        $response->assertStatus(200);
    }
    
    /** @test */
    public function it_returns_paginated_results()
    {
        Sanctum::actingAs($this->admin);
        
        // Create more users to test pagination
        $location = Location::first();
        
        for ($i = 0; $i < 20; $i++) {
            User::create([
                'username' => 'testuser' . $i,
                'first_name' => 'Test',
                'last_name' => 'User' . $i,
                'email' => 'test' . $i . '@example.com',
                'password' => bcrypt('password'),
                'phone' => '98765432' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'is_verified' => true,
                'location_id' => $location->id,
                'email_verified_at' => now()
            ]);
        }
        
        // Test with default pagination (15 per page)
        $response = $this->getJson('/api/users?query=Test');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'first_name', 'last_name', 'email']
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total'
                ]
            ])
            ->assertJson([
                'meta' => [
                    'per_page' => 15,
                    'current_page' => 1
                ]
            ]);
            
        // Test with custom pagination
        $response = $this->getJson('/api/users?query=Test&per_page=5');
        $response->assertStatus(200)
            ->assertJson([
                'meta' => [
                    'per_page' => 5,
                    'last_page' => 4 // 20 Test's total / 5 per page = 4 pages
                ]
            ]);
    }
}
