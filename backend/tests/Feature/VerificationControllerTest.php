<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Verification;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VerificationControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $verifiedUser;
    protected $unverifiedUser;
    protected $verifiedToken;
    protected $unverifiedToken;
    protected $verification;
    protected $adminToken;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        // Create admin user with token
        $this->admin = User::factory()->create(['is_verified' => true]);
        $this->admin->assignRole('admin');
        $this->adminToken = $this->admin->createToken('test-token')->plainTextToken;

        // Create verified user with token
        $this->verifiedUser = User::factory()->create(['is_verified' => false]);
        $this->verifiedUser->assignRole('user');
        $this->verifiedToken = $this->verifiedUser->createToken('test-token')->plainTextToken;

        // Create a verification record
        $this->verification = Verification::create([
            'user_id' => $this->verifiedUser->id,
            'document_type' => 'id_card',
            'image_urls' => ['verifications/1/test.jpg'],
            'status' => 'pending',
        ]);

        // Create unverified user with token
        $this->unverifiedUser = User::factory()->create(['is_verified' => false]);
        $this->unverifiedUser->assignRole('user');
        $this->unverifiedToken = $this->unverifiedUser->createToken('test-token')->plainTextToken;

        // Fake the private storage
        Storage::fake('private');
    }

    protected function actingAsVerifiedUser()
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->verifiedToken,
            'Accept' => 'application/json',
        ]);
    }

    protected function actingAsUnverifiedUser()
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->unverifiedToken,
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
    public function user_can_submit_verification()
    {
        $response = $this->actingAsUnverifiedUser()
            ->postJson('/api/verifications', [
                'document_type' => 'passport',
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

        $this->assertDatabaseHas('verifications', [
            'user_id' => $this->unverifiedUser->id,
            'document_type' => 'passport',
            'status' => 'pending'
        ]);
    }

    /** @test */
    public function admin_can_view_all_verifications()
    {
        $response = $this->actingAsAdmin()
            ->getJson('/api/verifications');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'user_id',
                        'status',
                        'document_type',
                        'image_full_urls',
                        'created_at',
                        'user'
                    ]
                ],
                'pagination' => [
                    'total',
                    'per_page',
                    'current_page',
                    'last_page',
                    'from',
                    'to'
                ]
            ]);
    }

    /** @test */
    public function user_can_view_own_verification()
    {
        $response = $this->actingAsVerifiedUser()
            ->getJson("/api/verifications/{$this->verification->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $this->verification->id,
                    'user_id' => $this->verifiedUser->id,
                ]
            ]);
    }

    /** @test */
    public function user_cannot_view_others_verification()
    {
        $otherUser = User::factory()->create();
        $otherUser->assignRole('user');

        $response = $this
            ->actingAsUnverifiedUser()
            ->getJson("/api/verifications/{$this->verification->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_approve_verification()
    {
        $response = $this->actingAsAdmin()
            ->postJson("/api/verifications/{$this->verification->id}/approved", [
                'notes' => 'Approved'
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('verifications', [
            'id' => $this->verification->id,
            'status' => 'approved',
            'verifier_id' => $this->admin->id,
            'notes' => 'Approved'
        ]);

        $this->assertTrue($this->verifiedUser->fresh()->is_verified);
    }

    /** @test */
    public function user_cannot_approve_verification()
    {
        $response = $this->actingAsVerifiedUser()
            ->postJson("/api/verifications/{$this->verification->id}/approved");

        $response->assertStatus(403);

        $response = $this->actingAsUnverifiedUser()
            ->postJson("/api/verifications/{$this->verification->id}/approved");

        $response->assertStatus(403);
    }

    /** @test */
    public function cannot_submit_with_invalid_document_types()
    {
        $invalidFile = UploadedFile::fake()->create('document', 1000, 'application/zip');

        $response = $this->actingAsUnverifiedUser()
            ->postJson('/api/verifications', [
                'document_type' => 'id_card',
                'documents' => [$invalidFile]
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['documents.0']);
    }

    /** @test */
    public function cannot_submit_with_missing_required_fields()
    {
        $response = $this->actingAsUnverifiedUser()
            ->postJson('/api/verifications', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document_type', 'documents']);
    }

    /** @test */
    public function cannot_update_nonexistent_verification()
    {
        $nonExistentId = 9999;
        $response = $this->actingAsAdmin()
            ->postJson("/api/verifications/{$nonExistentId}/approved");

        $response->assertStatus(404);
    }

    /** @test */
    public function cannot_submit_with_invalid_document_type()
    {
        $response = $this->actingAsUnverifiedUser()
            ->postJson('/api/verifications', [
                'document_type' => 'invalid_type',
                'documents' => [$this->createTestImage('test.jpg')]
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document_type']);
    }

    /** @test */
    public function cannot_view_nonexistent_verification()
    {
        $nonExistentId = 9999;
        $response = $this->actingAsAdmin()
            ->getJson("/api/verifications/{$nonExistentId}");

        $response->assertStatus(404);
    }

    /** @test */
    public function cannot_update_already_processed_verification()
    {
        // First update to approved
        $this->actingAsAdmin()
            ->postJson("/api/verifications/{$this->verification->id}/approved");

        // Try to update again
        $response = $this->actingAsAdmin()
            ->postJson("/api/verifications/{$this->verification->id}/rejected");

        $response->assertStatus(400)
            ->assertJson(['success' => false]);
    }

    /** @test */
    public function cannot_submit_empty_documents_array()
    {
        $response = $this->actingAsUnverifiedUser()
            ->postJson('/api/verifications', [
                'document_type' => 'id_card',
                'documents' => []
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['documents']);
    }

    /** @test */
    public function cannot_submit_too_many_documents()
    {
        $tooManyDocuments = array_fill(0, 8, $this->createTestImage('test.jpg'));

        $response = $this->actingAsUnverifiedUser()
            ->postJson('/api/verifications', [
                'document_type' => 'id_card',
                'documents' => $tooManyDocuments
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['documents']);
    }

    /** @test */
    public function test_is_verified_changes_on_approval()
    {
        $this->verifiedUser->update(['is_verified' => false]);

        $response = $this->actingAsAdmin()
            ->postJson("/api/verifications/{$this->verification->id}/approved");

        $response->assertStatus(200);
        $this->assertTrue($this->verifiedUser->fresh()->is_verified);
    }

    /** @test */
    public function test_rejection_sets_is_verified_to_false()
    {
        // First approve the verification
        $this->actingAsAdmin()
            ->postJson("/api/verifications/{$this->verification->id}/approved");

        $this->assertTrue($this->verifiedUser->fresh()->is_verified);

        // Create a new pending verification
        $verification2 = Verification::create([
            'user_id' => $this->verifiedUser->id,
            'document_type' => 'passport',
            'image_urls' => ['verifications/1/test2.jpg'],
            'status' => 'pending'
        ]);

        // Reject the new verification
        $response = $this->actingAsAdmin()
            ->postJson("/api/verifications/{$verification2->id}/rejected", [
                'notes' => 'Documents not clear'
            ]);

        $response->assertStatus(200);
        $this->assertFalse($this->verifiedUser->fresh()->is_verified);
    }

    /** @test */
    public function it_deletes_images_when_verification_is_deleted()
    {
        // Manually add some test files to storage
        $imagePaths = [
            'verifications/' . $this->verifiedUser->id . '/test1.jpg',
            'verifications/' . $this->verifiedUser->id . '/test2.jpg',
        ];

        foreach ($imagePaths as $path) {
            Storage::disk('private')->put($path, 'dummy content');
        }

        // Update verification with the test paths
        $this->verification->update(['image_urls' => $imagePaths]);

        // Delete the verification
        $response = $this->actingAsAdmin()
            ->deleteJson("/api/verifications/{$this->verification->id}");

        $response->assertStatus(200);

        // Assert files were deleted
        foreach ($imagePaths as $path) {
            $this->assertFalse(Storage::disk('private')->exists($path));
        }
    }
}
