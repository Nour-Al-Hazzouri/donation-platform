<?php

namespace Tests\Feature;

use App\Models\Location;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class LocationApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * @var \App\Models\User
     */
    protected $admin;

    /**
     * @var \App\Models\User
     */
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles and permissions
        $this->seed(RoleSeeder::class);

        // Create an admin user for testing
        $this->admin = User::factory()->create([
            'email' => 'admin@example.com',
        ]);
        $this->admin->assignRole('admin');

        // Create a regular user for testing
        $this->user = User::factory()->create([
            'email' => 'user@example.com',
        ]);
        $this->user->assignRole('user');
    }

    /** @test */
    public function it_can_list_locations()
    {
        // Create some test locations
        $locations = Location::factory()->count(3)->create();

        // Act as regular user
        Sanctum::actingAs($this->user);

        // Make the request
        $response = $this->getJson('/api/locations');

        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'governorate', 'district', 'created_at', 'updated_at']
                ],
                'message'
            ]);
    }

    /** @test */
    public function it_can_show_a_location()
    {
        $location = Location::factory()->create();

        Sanctum::actingAs($this->user);

        $response = $this->getJson("/api/locations/{$location->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $location->id,
                    'governorate' => $location->governorate,
                    'district' => $location->district,
                ],
                'message' => 'Location retrieved successfully'
            ]);
    }

    /** @test */
    public function it_requires_authentication_to_access_protected_routes()
    {
        $location = Location::factory()->create();

        // Test unauthenticated access
        $this->getJson('/api/locations')->assertStatus(401);
        $this->getJson("/api/locations/{$location->id}")->assertStatus(401);
        $this->postJson('/api/locations', [])->assertStatus(401);
        $this->putJson("/api/locations/{$location->id}", [])->assertStatus(401);
        $this->deleteJson("/api/locations/{$location->id}")->assertStatus(401);
    }

    /** @test */
    public function it_requires_admin_role_to_create_location()
    {
        // Act as regular user (non-admin)
        Sanctum::actingAs($this->user);

        $locationData = [
            'governorate' => $this->faker->city,
            'district' => $this->faker->citySuffix,
        ];

        $response = $this->postJson('/api/locations', $locationData);
        $response->assertStatus(403); // Forbidden for non-admin

        // Now try as admin
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/locations', $locationData);
        $response->assertStatus(201); // Created
    }

    /** @test */
    public function it_validates_required_fields_when_creating_location()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/locations', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['governorate', 'district']);
    }

    /** @test */
    public function it_can_create_a_location()
    {
        Sanctum::actingAs($this->admin);

        $locationData = [
            'governorate' => 'Beirut',
            'district' => 'Achrafieh',
        ];

        $response = $this->postJson('/api/locations', $locationData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'governorate' => 'Beirut',
                    'district' => 'Achrafieh',
                ],
                'message' => 'Location created successfully'
            ]);

        $this->assertDatabaseHas('locations', $locationData);
    }

    /** @test */
    public function it_can_update_a_location()
    {
        $location = Location::factory()->create([
            'governorate' => 'Mount Lebanon',
            'district' => 'Metn',
        ]);

        Sanctum::actingAs($this->admin);

        $updateData = [
            'governorate' => 'North',
            'district' => 'Tripoli',
        ];

        $response = $this->putJson("/api/locations/{$location->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'governorate' => 'North',
                    'district' => 'Tripoli',
                ],
                'message' => 'Location updated successfully'
            ]);

        $this->assertDatabaseHas('locations', [
            'id' => $location->id,
            'governorate' => 'North',
            'district' => 'Tripoli',
        ]);
    }

    /** @test */
    public function it_can_delete_a_location()
    {
        $location = Location::factory()->create();

        Sanctum::actingAs($this->admin);

        $response = $this->deleteJson("/api/locations/{$location->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Location deleted successfully'
            ]);

        $this->assertDatabaseMissing('locations', ['id' => $location->id]);
    }

    /** @test */
    public function it_prevents_non_admin_from_deleting_location()
    {
        $location = Location::factory()->create();

        // Try as regular user
        Sanctum::actingAs($this->user);
        $response = $this->deleteJson("/api/locations/{$location->id}");
        $response->assertStatus(403);

        // Verify location still exists
        $this->assertDatabaseHas('locations', ['id' => $location->id]);
    }
}
