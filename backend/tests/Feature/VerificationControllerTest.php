<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Verification;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VerificationControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $user;
    protected $verification;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->user = User::factory()->create();
        $this->user->assignRole('user');

        $this->verification = Verification::create([
            'user_id' => $this->user->id,
            'document_type' => 'id_card',
            'document_urls' => ['https://example.com/id1.jpg'],
            'status' => 'pending',
        ]);
    }

    /** @test */
    public function user_can_submit_verification()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/verifications', [
            'document_type' => 'passport',
            'documents' => ['https://example.com/passport.jpg']
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('verifications', [
            'user_id' => $this->user->id,
            'document_type' => 'passport',
            'status' => 'pending'
        ]);
    }

    /** @test */
    public function admin_can_view_all_verifications()
    {
        $this->actingAs($this->admin);
        $response = $this->getJson('/api/verifications');
        $response->assertStatus(200);
    }

    /** @test */
    public function user_can_view_own_verification()
    {
        $this->actingAs($this->user);
        $response = $this->getJson("/api/verifications/{$this->verification->id}");
        $response->assertStatus(200);
    }

    /** @test */
    public function user_cannot_view_others_verification()
    {
        $user2 = User::factory()->create();
        $this->actingAs($user2);
        $response = $this->getJson("/api/verifications/{$this->verification->id}");
        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_approve_verification()
    {
        $this->actingAs($this->admin);
        $response = $this->postJson("/api/verifications/{$this->verification->id}/approved", [
            'notes' => 'Approved'
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('verifications', [
            'id' => $this->verification->id,
            'status' => 'approved'
        ]);
    }

    /** @test */
    public function user_cannot_approve_verification()
    {
        $this->actingAs($this->user);
        $response = $this->postJson("/api/verifications/{$this->verification->id}/approved");
        $response->assertStatus(403);
    }

    /** @test */
    public function cannot_submit_with_invalid_document_urls()
    {
        $this->actingAs($this->user);
        $response = $this->postJson('/api/verifications', [
            'document_type' => 'id_card',
            'documents' => ['not-a-url', 'also-not-a-url']
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['documents.0', 'documents.1']);
    }

    /** @test */
    public function cannot_submit_with_missing_required_fields()
    {
        $this->actingAs($this->user);
        $response = $this->postJson('/api/verifications', []);
        
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document_type', 'documents']);
    }

    /** @test */
    public function cannot_update_nonexistent_verification()
    {
        $this->actingAs($this->admin);
        $nonExistentId = 9999;
        $response = $this->postJson("/api/verifications/{$nonExistentId}/approved");
        
        $response->assertStatus(404);
    }

    /** @test */
    public function cannot_submit_with_invalid_document_type()
    {
        $this->actingAs($this->user);
        $response = $this->postJson('/api/verifications', [
            'document_type' => 'invalid_type',
            'documents' => ['https://example.com/doc.jpg']
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document_type']);
    }

    /** @test */
    public function cannot_view_nonexistent_verification()
    {
        $this->actingAs($this->admin);
        $nonExistentId = 9999;
        $response = $this->getJson("/api/verifications/{$nonExistentId}");
        
        $response->assertStatus(404);
    }

    /** @test */
    public function cannot_update_already_processed_verification()
    {
        $this->actingAs($this->admin);
        
        // First update to approved
        $this->postJson("/api/verifications/{$this->verification->id}/approved");
        
        // Try to update again
        $response = $this->postJson("/api/verifications/{$this->verification->id}/rejected");
        
        $response->assertStatus(400)
            ->assertJson(['success' => false]);
    }

    /** @test */
    public function cannot_submit_empty_documents_array()
    {
        $this->actingAs($this->user);
        $response = $this->postJson('/api/verifications', [
            'document_type' => 'id_card',
            'documents' => []
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['documents']);
    }

    /** @test */
    public function cannot_submit_too_many_documents()
    {
        $this->actingAs($this->user);
        $tooManyDocuments = array_fill(0, 11, 'https://example.com/doc.jpg');
        
        $response = $this->postJson('/api/verifications', [
            'document_type' => 'id_card',
            'documents' => $tooManyDocuments
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['documents']);
    }
    public function test_is_verified_changes_on_approval()
{
    $admin = User::factory()->create(['role' => 'admin']);
    $admin->assignRole('admin');
    $user = User::factory()->create(['is_verified' => false]);
    $verification = Verification::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->postJson("/api/verifications/{$verification->id}/approved", [
            'notes' => 'Test approval'
        ])
        ->assertStatus(200);

    $user->refresh();
    $this->assertTrue($user->is_verified);
}
}
