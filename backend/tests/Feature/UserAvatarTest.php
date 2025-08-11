<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UserAvatarTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->user = User::factory()->create();
        $this->user->assignRole('user');
        $this->token = $this->user->createToken('test-token')->plainTextToken;

        Storage::fake('public');
    }

    protected function actingAsUser()
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ]);
    }

    protected function generateFakeImage(string $name)
    {
        return UploadedFile::fake()->image($name);
    }

    /** @test */
    public function user_can_upload_avatar()
    {
        $file = $this->generateFakeImage('avatar.jpg');

        $response = $this->actingAsUser()
            ->putJson('/api/user/profile', [
                'avatar_url' => $file,
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'first_name',
                    'last_name',
                    'avatar_url',
                    'avatar_url_full'
                ]
            ]);

        $this->assertNotNull($response->json('data.avatar_url'));
        $this->assertStringContainsString('storage/avatars/', $response->json('data.avatar_url_full'));

        // Assert the file was stored
        $this->assertTrue(Storage::disk('public')->exists($response->json('data.avatar_url')));
    }

    /** @test */
    public function user_can_remove_avatar()
    {
        // First upload an avatar
        $file = UploadedFile::fake()->image('avatar.jpg');

        $uploadResponse = $this->actingAsUser()
            ->putJson('/api/user/profile', [
                'avatar_url' => $file,
            ]);

        $avatarPath = $uploadResponse->json('data.avatar_url');

        // Now remove the avatar by sending null
        $response = $this->actingAsUser()
            ->putJson('/api/user/profile', [
                'delete_avatar' => true,
            ]);

        $response->assertStatus(200);
        $this->assertNull($response->json('data.avatar_url'));

        // Assert the file was deleted
        $this->assertFalse(Storage::disk('public')->exists($avatarPath));
    }

    /** @test */
    public function avatar_must_be_valid_image()
    {
        $file = UploadedFile::fake()->create('document.pdf', 1000);

        $response = $this->actingAsUser()
            ->putJson('/api/user/profile', [
                'avatar_url' => $file,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['avatar_url']);
    }

    /** @test */
    public function avatar_is_updated_when_new_one_is_uploaded()
    {
        // Upload first avatar
        $firstFile = UploadedFile::fake()->image('first.jpg');
        $firstResponse = $this->actingAsUser()
            ->putJson('/api/user/profile', ['avatar_url' => $firstFile]);

        $firstAvatarPath = $firstResponse->json('data.avatar_url');

        // Upload second avatar
        $secondFile = UploadedFile::fake()->image('second.jpg');
        $secondResponse = $this->actingAsUser()
            ->putJson('/api/user/profile', ['avatar_url' => $secondFile]);

        // First avatar should be deleted
        $this->assertFalse(Storage::disk('public')->exists($firstAvatarPath));

        // Second avatar should be stored
        $secondAvatarPath = $secondResponse->json('data.avatar_url');
        $this->assertTrue(Storage::disk('public')->exists($secondAvatarPath));
    }
}
