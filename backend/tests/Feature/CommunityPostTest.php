<?php

namespace Tests\Feature;

use App\Models\CommunityPost;
use App\Models\DonationEvent;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CommunityPostTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $user;
    protected $event;

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

        // Create a donation event
        $this->event = DonationEvent::factory()->create([
            'title' => 'Test Event',
            'description' => 'Test event description',
            'image_urls' => [],
            'goal_amount' => 1000,
            'current_amount' => 100,
            'possible_amount' => 500,
            'type' => 'request',
            'status' => 'active'
        ]);

        Storage::fake('public');
    }

    /** @test */
    public function user_can_create_community_post()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/community-posts', [
            'content' => 'Test post content',
            'event_id' => $this->event->id,
            'image_urls' => [],
            'tags' => ['test', 'post']
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Community post created successfully',
                'data' => [
                    'content' => 'Test post content',
                    'tags' => ['test', 'post']
                ]
            ]);

        $this->assertDatabaseHas('community_posts', [
            'content' => 'Test post content',
            'user_id' => $this->user->id,
            'event_id' => $this->event->id,
        ]);
    }

    /** @test */
    public function cannot_create_post_with_invalid_event()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/community-posts', [
            'content' => 'Test post content',
            'event_id' => 999, // Non-existent event
            'image_urls' => [],
            'tags' => ['test']
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['event_id']);
    }

    /** @test */
    public function post_response_includes_vote_data()
    {
        $post = CommunityPost::factory()->create([
            'user_id' => $this->user->id,
        ]);

        // Create some votes
        $post->votes()->createMany([
            ['user_id' => $this->user->id, 'type' => 'upvote'],
            ['user_id' => $this->admin->id, 'type' => 'upvote'],
            ['user_id' => User::factory()->create()->id, 'type' => 'downvote'],
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/community-posts/{$post->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'votes' => [
                        'upvotes',
                        'downvotes',
                        'total',
                        'user_vote'
                    ]
                ]
            ])
            ->assertJson([
                'data' => [
                    'votes' => [
                        'upvotes' => 2,
                        'downvotes' => 1,
                        'total' => 1,
                        'user_vote' => 'upvote'
                    ]
                ]
            ]);
    }

    /** @test */
    public function user_can_view_their_own_posts()
    {
        $post = CommunityPost::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->event->id,
            'content' => 'My test post'
        ]);

        $this->actingAs($this->user);

        $response = $this->getJson("/api/community-posts/{$post->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $post->id,
                    'content' => 'My test post'
                ]
            ]);
    }

    /** @test */
    public function user_can_update_their_own_post()
    {
        $post = CommunityPost::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->event->id,
            'content' => 'Original content'
        ]);

        $this->actingAs($this->user);

        $response = $this->putJson("/api/community-posts/{$post->id}", [
            'content' => 'Updated content',
            'tags' => ['updated', 'tag']
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Community post updated successfully',
                'data' => [
                    'content' => 'Updated content',
                    'tags' => ['updated', 'tag']
                ]
            ]);
    }

    /** @test */
    public function user_cannot_update_other_users_post()
    {
        $otherUser = User::factory()->create();
        $post = CommunityPost::factory()->create([
            'user_id' => $otherUser->id,
            'event_id' => $this->event->id,
            'content' => 'Original content'
        ]);

        $this->actingAs($this->user);

        $response = $this->putJson("/api/community-posts/{$post->id}", [
            'content' => 'Updated content'
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_update_any_post()
    {
        $post = CommunityPost::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->event->id,
            'content' => 'Original content'
        ]);

        $this->actingAs($this->admin);

        $response = $this->putJson("/api/community-posts/{$post->id}", [
            'content' => 'Admin updated content'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'content' => 'Admin updated content'
                ]
            ]);
    }

    /** @test */
    public function user_can_delete_their_own_post()
    {
        $post = CommunityPost::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->event->id
        ]);

        $this->actingAs($this->user);

        $response = $this->deleteJson("/api/community-posts/{$post->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Community post deleted successfully'
            ]);

        $this->assertDatabaseMissing('community_posts', ['id' => $post->id]);
    }

    /** @test */
    public function user_cannot_delete_other_users_post()
    {
        $otherUser = User::factory()->create();
        $post = CommunityPost::factory()->create([
            'user_id' => $otherUser->id,
            'event_id' => $this->event->id
        ]);

        $this->actingAs($this->user);

        $response = $this->deleteJson("/api/community-posts/{$post->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('community_posts', ['id' => $post->id]);
    }

    /** @test */
    public function admin_can_delete_any_post()
    {
        $post = CommunityPost::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->event->id
        ]);

        $this->actingAs($this->admin);

        $response = $this->deleteJson("/api/community-posts/{$post->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('community_posts', ['id' => $post->id]);
    }

    /** @test */
    public function post_requires_content()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/community-posts', [
            'event_id' => $this->event->id,
            'content' => ''
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['content']);
    }

    /** @test */
    public function post_requires_event_id()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/api/community-posts', [
            'content' => 'Test content'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['event_id']);
    }

    /** @test */
    public function can_list_posts_with_pagination()
    {
        // Create multiple posts
        CommunityPost::factory()->count(15)->create([
            'event_id' => $this->event->id
        ]);

        $this->actingAs($this->user);

        $response = $this->getJson('/api/community-posts');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'content', 'user', 'event', 'created_at']
                ],
                'links',
                'meta'
            ]);
    }
}
