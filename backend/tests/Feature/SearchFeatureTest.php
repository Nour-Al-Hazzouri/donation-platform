<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Verification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class SearchFeatureTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        
        // Create roles and permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminPermissions = [
            'manage users',
            'view users',
            'view verifications',
            'manage verifications'
        ];
        
        foreach ($adminPermissions as $permission) {
            Permission::create(['name' => $permission]);
        }
        
        $adminRole->syncPermissions($adminPermissions);
        
        // Create admin user with all permissions
        $this->admin = User::factory()->create();
        $adminRole = Role::findOrCreate('admin');
        $this->admin->assignRole($adminRole);
        
        // Give admin all permissions
        $permissions = Permission::all();
        $this->admin->givePermissionTo($permissions);
        
        // Refresh the user's permissions
        $this->admin = $this->admin->fresh();
        
        // Create regular user
        $this->user = User::factory()->create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+1234567890',
            'username' => 'johndoe'
        ]);
        
        // Create verification request for the user
        $this->verification = Verification::create([
            'user_id' => $this->user->id,
            'document_type' => 'id_card',
            'image_urls' => ['verifications/test.jpg'],
            'status' => 'pending'
        ]);
        
        // Create some other test data
        User::factory(5)->create();
        Verification::factory(3)->create(['status' => 'pending']);
    }

    /** @test */
    public function admin_can_search_users()
    {
        Sanctum::actingAs($this->admin);
        // Search by first name
        $response = $this->getJson('/api/users/search?query=John');
        $response->assertStatus(200)
            ->assertJsonFragment(['email' => 'john.doe@example.com']);
            
        // Search by last name
        $response = $this->getJson('/api/users/search?query=Doe');
        $response->assertStatus(200)
            ->assertJsonFragment(['email' => 'john.doe@example.com']);
            
        // Search by email
        $response = $this->getJson('/api/users/search?query=john.doe@example.com');
        $response->assertStatus(200)
            ->assertJsonFragment(['email' => 'john.doe@example.com']);
            
        // Search by phone number
        $response = $this->getJson('/api/users/search?query=1234567890');
        $response->assertStatus(200)
            ->assertJsonFragment(['email' => 'john.doe@example.com']);
            
        // Search by username
        $response = $this->getJson('/api/users/search?query=johndoe');
        $response->assertStatus(200)
            ->assertJsonFragment(['email' => 'john.doe@example.com']);
    }
    
    /** @test */
    public function admin_can_search_verification_requests()
    {
        Sanctum::actingAs($this->admin);
        $this->admin->assignRole('admin');
        // Search by user's first name
        $response = $this->getJson('/api/verifications/search?query=John');
        $response->assertStatus(200)
            ->assertJsonFragment(['user_id' => $this->user->id]);
            
        // Search by user's last name
        $response = $this->getJson('/api/verifications/search?query=Doe');
        $response->assertStatus(200)
            ->assertJsonFragment(['user_id' => $this->user->id]);
            
        // Search by user's email
        $response = $this->getJson('/api/verifications/search?query=john.doe@example.com');
        $response->assertStatus(200)
            ->assertJsonFragment(['user_id' => $this->user->id]);
            
        // Search by user's phone number
        $response = $this->getJson('/api/verifications/search?query=1234567890');
        $response->assertStatus(200)
            ->assertJsonFragment(['user_id' => $this->user->id]);
    }
    
    /** @test */
    public function search_requires_authentication()
    {
        // User search
        $response = $this->getJson('/api/users/search?query=test');
        $response->assertStatus(401);
        
        // Verification search
        $response = $this->getJson('/api/verifications/search?query=test');
        $response->assertStatus(401);
    }
    
    /** @test */
    public function search_requires_admin_role()
    {
        Sanctum::actingAs($this->user);       
        // User search
        $response = $this->getJson('/api/users/search?query=test');
        $response->assertStatus(403);
        
        // Verification search
        $response = $this->getJson('/api/verifications/search?query=test');
        $response->assertStatus(403);
    }
    
    /** @test */
    public function search_validates_input()
    {
        Sanctum::actingAs($this->admin);
        $this->admin->assignRole('admin');
        // Missing query parameter
        $response = $this->getJson('/api/users/search');
        $response->assertStatus(422);
        
        // Invalid per_page value
        $response = $this->getJson('/api/users/search?query=test&per_page=invalid');
        $response->assertStatus(422);
    }
    
    /** @test */
    public function search_returns_paginated_results()
    {
        Sanctum::actingAs($this->admin);
        $this->admin->assignRole('admin');  
        
        // Create a single location to use for all test users
        $location = \App\Models\Location::create([
            'governorate' => 'Test Governorate',
            'district' => 'Test District'
        ]);
        
        // Create more users to test pagination without triggering the factory's location creation
        for ($i = 0; $i < 20; $i++) {
            User::create([
                'username' => 'john' . $i,
                'first_name' => 'John',
                'last_name' => 'Doe' . $i,
                'email' => 'john' . $i . '@example.com',
                'password' => bcrypt('password'),
                'phone' => '123456789' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'is_verified' => true,
                'role' => 'user',
                'location_id' => $location->id,
                'email_verified_at' => now()
            ]);
        }
        
        // Test with default pagination (15 per page)
        $response = $this->getJson('/api/users/search?query=John');
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
        $response = $this->getJson('/api/users/search?query=John&per_page=5');
        $response->assertStatus(200)
            ->assertJson([
                'meta' => [
                    'per_page' => 5,
                    'last_page' => 5 // 21 John's total / 5 per page = 5 pages
                ]
            ]);
    }
}
