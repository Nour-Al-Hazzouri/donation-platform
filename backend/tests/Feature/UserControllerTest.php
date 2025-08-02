<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Log;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $user;
    protected $authToken;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        // Create admin user
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        // Create regular user
        $this->user = User::factory()->create();
        $this->user->assignRole('user');

        // Create auth token for admin
        $this->authToken = $this->admin->createToken('test-token')->plainTextToken;
    }

    protected function actingAsAdmin()
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->authToken,
            'Accept' => 'application/json',
        ]);
    }

    /** @test */
    public function it_can_list_all_users_for_admin()
    {
        // Create some test users
        User::factory()->count(3)->create();

        $response = $this->actingAsAdmin()
            ->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'first_name',
                        'last_name',
                        'username',
                        'email',
                        'phone',
                        'email_verified_at',
                        'created_at',
                        'updated_at'
                    ]
                ],
                'message'
            ]);
    }

    /** @test */
    public function it_denies_access_to_list_users_for_unauthorized_users()
    {
        $regularUser = User::factory()->create();
        $token = $regularUser->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ])->getJson('/api/users');

        $response->assertStatus(403);
    }

    /** @test */
    public function it_can_show_a_user()
    {
        $response = $this->actingAsAdmin()
            ->getJson("/api/users/{$this->user->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'first_name',
                    'last_name',
                    'username',
                    'email',
                    'phone',
                    'email_verified_at',
                    'created_at',
                    'updated_at'
                ],
                'message'
            ]);
    }

    /** @test */
    public function it_returns_404_for_nonexistent_user()
    {
        $response = $this->actingAsAdmin()
            ->getJson('/api/users/9999');

        $response->assertStatus(404);
    }

    /** @test */
    public function it_can_update_a_user()
    {
        $updateData = [
            'first_name' => 'Updated',
            'last_name' => 'User',
            'username' => 'updateduser',
            'phone' => '1234567890',
        ];

        $response = $this->actingAsAdmin()
            ->putJson("/api/users/{$this->user->id}", $updateData);

        $response->dump();

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'first_name' => 'Updated',
                    'last_name' => 'User',
                    'username' => 'updateduser',
                    'phone' => '1234567890',
                    // Other fields will be present but we don't need to assert their exact values
                ],
                'message' => 'User updated successfully',
            ]);
    }

    /** @test */
    public function it_validates_update_data()
    {
        $response = $this->actingAsAdmin()
            ->putJson("/api/users/{$this->user->id}", [
                'first_name' => '',
                'last_name' => '',
                'username' => 'a', // too short
                'phone' => str_repeat('1', 16), // too long
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'first_name',
                'last_name',
                'username',
                'phone'
            ]);
    }

    /** @test */
    public function it_can_delete_a_user()
    {
        $userToDelete = User::factory()->create();

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/users/{$userToDelete->id}");

        $response->assertStatus(204);
        $this->assertModelMissing($userToDelete);
    }

    /** @test */
    public function it_can_get_authenticated_user_profile()
    {
        $response = $this->actingAsAdmin()
            ->getJson('/api/user/profile');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'first_name',
                    'last_name',
                    'username',
                    'email',
                    'phone',
                    'email_verified_at',
                    'created_at',
                    'updated_at'
                ],
                'message'
            ]);
    }

    /** @test */
    public function it_can_update_authenticated_user_profile()
    {
        $updateData = [
            'first_name' => 'New',
            'last_name' => 'Profile',
            'username' => 'newprofile',
            'phone' => '0987654321',
        ];

        $response = $this->actingAsAdmin()
            ->putJson('/api/user/profile', $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'first_name' => 'New',
                    'last_name' => 'Profile',
                    'username' => 'newprofile',
                    'phone' => '0987654321',
                    // Other fields will be present but we don't need to assert their exact values
                ],
                'message' => 'User profile updated successfully',
            ]);
    }

    /** @test */
    public function it_validates_profile_update_data()
    {
        $response = $this->actingAsAdmin()
            ->putJson('/api/user/profile', [
                'first_name' => '',
                'last_name' => '',
                'username' => 'a', // too short
                'phone' => str_repeat('1', 16), // too long
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'first_name',
                'last_name',
                'username',
                'phone'
            ]);
    }

    /** @test */
    public function it_prevents_users_from_updating_other_users_profiles()
    {
        $regularUser = User::factory()->create();
        $regularUserToken = $regularUser->createToken('test-token')->plainTextToken;

        // Try to update another user's profile
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $regularUserToken,
            'Accept' => 'application/json',
        ])->putJson("/api/users/{$this->admin->id}", [
                    'first_name' => 'Hacked',
                    'last_name' => 'User',
                    'username' => 'hackeduser',
                ]);

        $response->assertStatus(403);

        // Verify the admin's data wasn't changed
        $this->assertDatabaseHas('users', [
            'id' => $this->admin->id,
            'first_name' => $this->admin->first_name,
            'last_name' => $this->admin->last_name,
            'username' => $this->admin->username,
            'email' => $this->admin->email,
        ]);
    }
}
