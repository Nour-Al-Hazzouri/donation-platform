<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Illuminate\Support\Facades\DB;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    /** @test */
    public function it_can_register_a_new_user()
    {
        $userData = [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'username' => $this->faker->unique()->userName,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => $this->faker->phoneNumber,
        ];

        $response = $this->postJson('/api/auth/register', $userData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'user' => [
                    'id',
                    'first_name',
                    'last_name',
                    'username',
                    'email',
                    'phone',
                ],
                'access_token',
                'token_type'
            ]);

        $this->assertDatabaseHas('users', [
            'email' => $userData['email'],
            'first_name' => $userData['first_name'],
            'last_name' => $userData['last_name'],
            'username' => $userData['username'],
            'phone' => $userData['phone'],
        ]);
    }

    /** @test */
    public function it_validates_registration_data()
    {
        $response = $this->postJson('/api/auth/register', [
            'first_name' => '',
            'last_name' => '',
            'username' => '',
            'email' => 'invalid-email',
            'password' => '123',
            'password_confirmation' => '456',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'first_name',
                'last_name',
                'username',
                'email',
                'password'
            ]);
    }

    /** @test */
    public function it_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user' => ['id', 'first_name', 'last_name', 'username', 'email', 'phone'],
                'access_token',
                'token_type',
                'isAdmin',
            ]);
    }

    /** @test */
    public function it_fails_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function it_can_logout_authenticated_user()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Successfully logged out']);
    }

    /** @test */
    public function it_handles_password_reset_flow()
    {
        // 1. Request password reset
        $user = User::factory()->create(['email' => 'user@example.com']);

        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'user@example.com'
        ]);

        $response->assertStatus(200);

        // Get the reset code from the database
        $resetRecord = DB::table('password_resets_codes')
            ->where('email', 'user@example.com')
            ->first();

        $this->assertNotNull($resetRecord);

        // 2. Reset password with the code
        $response = $this->postJson('/api/auth/reset-password', [
            'email' => 'user@example.com',
            'code' => $resetRecord->code,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200);

        // 3. Verify new password works
        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => 'newpassword123',
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function it_handles_invalid_reset_code()
    {
        $user = User::factory()->create(['email' => 'user@example.com']);

        $response = $this->postJson('/api/auth/reset-password', [
            'email' => 'user@example.com',
            'code' => 'INVALID-CODE',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(422);
    }
}
