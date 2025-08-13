<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Verification;
use Database\Seeders\RoleSeeder;
use Database\Seeders\NotificationTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VerificationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $admin;
    protected $token;
    protected $adminToken;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        $this->seed(NotificationTypeSeeder::class);

        // Create regular user
        $this->user = User::factory()->create();
        $this->user->assignRole('user');
        $this->token = $this->user->createToken('test-token')->plainTextToken;

        // Create admin user
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
        $this->adminToken = $this->admin->createToken('admin-token')->plainTextToken;

        // Fake the private storage for verification documents
        Storage::fake('private');
    }

    protected function actingAsUser()
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ]);
    }

    protected function actingAsAdmin()
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
        ]);
    }

    protected function createTestImage($name = 'test.jpg')
    {
        return UploadedFile::fake()->image($name, 800, 600);
    }

    /** @test */
    public function user_can_submit_verification_request()
    {
        $response = $this->actingAsUser()
            ->postJson('/api/verifications', [
                'document_type' => 'id_card',
                'documents' => [
                    $this->createTestImage('front.jpg'),
                    $this->createTestImage('back.jpg'),
                ],
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'user_id',
                    'document_type',
                    'status',
                    'image_urls',
                    'image_full_urls',
                ]
            ]);

        // Assert the verification was created in the database
        $this->assertDatabaseHas('verifications', [
            'user_id' => $this->user->id,
            'status' => 'pending',
            'document_type' => 'id_card',
        ]);

        // Assert files were stored in private storage
        $verification = Verification::first();
        foreach ($verification->image_urls as $imagePath) {
            $this->assertTrue(Storage::disk('private')->exists($imagePath));
        }
    }

    /** @test */
    public function it_validates_document_file_types()
    {
        $invalidFile = UploadedFile::fake()->create('document', 512, 'application/zip');

        $response = $this->actingAsUser()
            ->postJson('/api/verifications', [
                'document_type' => 'id_card',
                'documents' => [$invalidFile],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['documents.0']);
    }

    /** @test */
    public function it_requires_at_least_one_document()
    {
        $response = $this->actingAsUser()
            ->postJson('/api/verifications', [
                'document_type' => 'id_card',
                'documents' => [],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['documents']);
    }

    /** @test */
    public function user_cannot_have_multiple_pending_verifications()
    {
        // Create initial pending verification
        $this->actingAsUser()
            ->postJson('/api/verifications', [
                'document_type' => 'id_card',
                'documents' => [$this->createTestImage('front.jpg')],
            ]);

        // Try to create another one
        $response = $this->actingAsUser()
            ->postJson('/api/verifications', [
                'document_type' => 'passport',
                'documents' => [$this->createTestImage('passport.jpg')],
            ]);

        $response->assertStatus(409);
    }

    /** @test */
    public function admin_can_view_all_verifications()
    {
        // Create a verification from another user
        $otherUser = User::factory()->create();
        $otherUser->assignRole('user');
        $verification = Verification::factory()->create([
            'user_id' => $otherUser->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAsAdmin()
            ->getJson('/api/verifications');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id', 'user_id', 'status', 'document_type',
                        'image_full_urls', 'created_at', 'user'
                    ]
                ],
                'pagination' => [
                    'total', 'per_page', 'current_page', 'last_page', 'from', 'to'
                ]
            ]);
    }

    /** @test */
    public function admin_can_approve_verification()
    {
        $verification = Verification::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAsAdmin()
            ->postJson("/api/verifications/{$verification->id}/approved", [
                'notes' => 'Documents verified successfully'
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('verifications', [
            'id' => $verification->id,
            'status' => 'approved',
            'verifier_id' => $this->admin->id,
        ]);

        $this->assertTrue($verification->fresh()->user->is_verified);
    }

    /** @test */
    public function admin_can_reject_verification()
    {
        $verification = Verification::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAsAdmin()
            ->postJson("/api/verifications/{$verification->id}/rejected", [
                'notes' => 'Documents are not clear'
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('verifications', [
            'id' => $verification->id,
            'status' => 'rejected',
            'verifier_id' => $this->admin->id,
            'notes' => 'Documents are not clear',
        ]);

        $this->assertFalse($verification->fresh()->user->is_verified);
    }

    /** @test */
    public function user_can_view_own_verification()
    {
        $verification = Verification::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAsUser()
            ->getJson("/api/verifications/{$verification->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $verification->id,
                    'user_id' => $this->user->id,
                ]
            ]);
    }

    /** @test */
    public function user_cannot_view_others_verification()
    {
        $otherUser = User::factory()->create();
        $otherUser->assignRole('user');

        $verification = Verification::factory()->create([
            'user_id' => $otherUser->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAsUser()
            ->getJson("/api/verifications/{$verification->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function user_can_delete_own_pending_verification()
    {
        $verification = Verification::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAsUser()
            ->deleteJson("/api/verifications/{$verification->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('verifications', ['id' => $verification->id]);
    }

    /** @test */
    public function user_cannot_delete_processed_verification()
    {
        $verification = Verification::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'approved',
        ]);

        $response = $this->actingAsUser()
            ->deleteJson("/api/verifications/{$verification->id}");

        $response->assertStatus(400);
        $this->assertDatabaseHas('verifications', ['id' => $verification->id]);
    }

    /** @test */
    public function admin_can_delete_any_verification()
    {
        $verification = Verification::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'approved',
        ]);

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/verifications/{$verification->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('verifications', ['id' => $verification->id]);
    }

    /** @test */
    public function it_deletes_images_when_verification_is_deleted()
    {
        // Create a verification with test images
        $verification = Verification::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending',
        ]);

        // Manually add some test files to storage
        $imagePaths = [
            'verifications/' . $this->user->id . '/test1.jpg',
            'verifications/' . $this->user->id . '/test2.jpg',
        ];

        foreach ($imagePaths as $path) {
            Storage::disk('private')->put($path, 'dummy content');
        }

        // Update verification with the test paths
        $verification->update(['image_urls' => $imagePaths]);

        // Delete the verification
        $this->actingAsAdmin()
            ->deleteJson("/api/verifications/{$verification->id}")
            ->assertStatus(200);

        // Assert files were deleted
        foreach ($imagePaths as $path) {
            $this->assertFalse(Storage::disk('private')->exists($path));
        }
    }
}
