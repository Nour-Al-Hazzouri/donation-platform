<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\CommunityPost;
use App\Models\DonationEvent;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Database\Seeders\NotificationTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $user;
    protected $post;
    protected $event;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        $this->seed(NotificationTypeSeeder::class);

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

        // Create a community post
        $this->post = CommunityPost::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $this->event->id,
            'content' => 'Test post content'
        ]);
    }

    /** @test */
    public function user_can_comment_on_post()
    {
        $this->actingAs($this->user);

        $response = $this->postJson("/api/community-posts/{$this->post->id}/comments", [
            'content' => 'This is a test comment'
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Comment created successfully',
                'data' => [
                    'content' => 'This is a test comment',
                    'user' => [
                        'id' => $this->user->id
                    ]
                ]
            ]);

        $this->assertDatabaseHas('comments', [
            'content' => 'This is a test comment',
            'user_id' => $this->user->id,
            'post_id' => $this->post->id
        ]);
    }

    /** @test */
    public function cannot_comment_on_nonexistent_post()
    {
        $this->actingAs($this->user);

        $response = $this->postJson("/api/community-posts/999/comments", [
            'content' => 'This comment should fail'
        ]);

        $response->assertStatus(404);
    }

    /** @test */
    public function comment_requires_content()
    {
        $this->actingAs($this->user);

        $response = $this->postJson("/api/community-posts/{$this->post->id}/comments", [
            'content' => ''
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['content']);
    }

    /** @test */
    public function can_list_comments_for_post()
    {
        // Create multiple comments
        Comment::factory()->count(5)->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id
        ]);

        $this->actingAs($this->user);

        $response = $this->getJson("/api/community-posts/{$this->post->id}/comments");

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'content', 'user', 'created_at']
                ],
            ]);
    }

    /** @test */
    public function user_can_update_own_comment()
    {
        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id,
            'content' => 'Original comment'
        ]);

        $this->actingAs($this->user);

        $response = $this->putJson("/api/community-posts/{$this->post->id}/comments/{$comment->id}", [
            'content' => 'Updated comment'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Comment updated successfully',
                'data' => [
                    'content' => 'Updated comment'
                ]
            ]);
    }

    /** @test */
    public function cannot_update_other_users_comment()
    {
        $otherUser = User::factory()->create();
        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $otherUser->id,
            'content' => 'Original comment'
        ]);

        $this->actingAs($this->user);

        $response = $this->putJson("/api/community-posts/{$this->post->id}/comments/{$comment->id}", [
            'content' => 'Trying to update someone else\'s comment'
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_update_any_comment()
    {
        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id,
            'content' => 'Original comment'
        ]);

        $this->actingAs($this->admin);

        $response = $this->putJson("/api/community-posts/{$this->post->id}/comments/{$comment->id}", [
            'content' => 'Admin updated this comment'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'content' => 'Admin updated this comment'
                ]
            ]);
    }

    /** @test */
    public function user_can_delete_own_comment()
    {
        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id,
            'content' => 'Comment to be deleted'
        ]);

        $this->actingAs($this->user);

        $response = $this->deleteJson("/api/community-posts/{$this->post->id}/comments/{$comment->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Comment deleted successfully'
            ]);

        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    /** @test */
    public function cannot_delete_other_users_comment()
    {
        $otherUser = User::factory()->create();
        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $otherUser->id,
            'content' => 'Someone else\'s comment'
        ]);

        $this->actingAs($this->user);

        $response = $this->deleteJson("/api/community-posts/{$this->post->id}/comments/{$comment->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('comments', ['id' => $comment->id]);
    }

    /** @test */
    public function admin_can_delete_any_comment()
    {
        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id,
            'content' => 'Comment for admin to delete'
        ]);

        $this->actingAs($this->admin);

        $response = $this->deleteJson("/api/community-posts/{$this->post->id}/comments/{$comment->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    /** @test */
    public function cannot_comment_on_nonexistent_post_route()
    {
        $this->actingAs($this->user);

        $response = $this->postJson("/api/community-posts/999/comments", [
            'content' => 'This should not work'
        ]);

        $response->assertStatus(404);
    }

    /** @test */
    public function cannot_update_comment_on_nonexistent_post()
    {
        $this->actingAs($this->user);

        $response = $this->putJson("/api/community-posts/999/comments/1", [
            'content' => 'This should not work'
        ]);

        $response->assertStatus(404);
    }

    /** @test */
    public function cannot_update_nonexistent_comment()
    {
        $this->actingAs($this->user);

        $response = $this->putJson("/api/community-posts/{$this->post->id}/comments/999", [
            'content' => 'This comment does not exist'
        ]);

        $response->assertStatus(404);
    }
}
