<?php

namespace Tests\Feature;

use App\Models\CommunityPost;
use App\Models\DonationEvent;
use App\Models\NotificationType;
use App\Models\User;
use App\Models\Vote;
use Database\Seeders\RoleSeeder;
use Database\Seeders\NotificationTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class VoteTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $post;
    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        $this->seed(NotificationTypeSeeder::class);

        // Create a regular user
        $this->user = User::factory()->create();
        $this->user->assignRole('user');

        // Create an admin user
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        // Create a community post
        $this->post = CommunityPost::factory()->create([
            'user_id' => $this->admin->id,
            'event_id' => DonationEvent::factory()->create()->id,
            'content' => 'Test post content',
            'image_urls' => [],
            'tags' => ['test', 'php']
        ]);
    }

    private function getNotificationTypeId($name)
    {
        return NotificationType::where('name', $name)->first()->id;
    }

    /** @test */
    public function guest_cannot_vote()
    {
        $response = $this->postJson("/api/community-posts/{$this->post->id}/vote", [
            'type' => 'upvote'
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function user_can_upvote_a_post()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/community-posts/{$this->post->id}/vote", [
                'type' => 'upvote'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Vote submitted successfully',
                'data' => [
                    'upvotes' => 1,
                    'downvotes' => 0,
                    'total_votes' => 1
                ]
            ]);

        $this->assertDatabaseHas('votes', [
            'user_id' => $this->user->id,
            'post_id' => $this->post->id,
            'type' => 'upvote'
        ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->post->user->id,
            'type_id' => $this->getNotificationTypeId('post_upvoted'),
        ]);

        $notification = \App\Models\Notification::where('user_id', $this->post->user->id)
            ->where('type_id', $this->getNotificationTypeId('post_upvoted'))
            ->first();

        $this->assertNotNull($notification);
        $this->assertEquals($this->user->id, $notification->data['user_id']);
        $this->assertEquals($this->post->id, $notification->data['post_id']);
    }

    /** @test */
    public function user_can_downvote_a_post()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/community-posts/{$this->post->id}/vote", [
                'type' => 'downvote'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Vote submitted successfully',
                'data' => [
                    'upvotes' => 0,
                    'downvotes' => 1,
                    'total_votes' => -1
                ]
            ]);

            $this->assertDatabaseHas('votes', [
                'user_id' => $this->user->id,
                'post_id' => $this->post->id,
                'type' => 'downvote'
            ]);

            $this->assertDatabaseHas('notifications', [
                'user_id' => $this->post->user->id,
                'type_id' => $this->getNotificationTypeId('post_downvoted'),
            ]);

            $notification = \App\Models\Notification::where('user_id', $this->post->user->id)
                ->where('type_id', $this->getNotificationTypeId('post_downvoted'))
                ->first();

            $this->assertNotNull($notification);
            $this->assertEquals($this->user->id, $notification->data['user_id']);
            $this->assertEquals($this->post->id, $notification->data['post_id']);
    }

    /** @test */
    public function user_can_change_vote_from_upvote_to_downvote()
    {
        // First upvote
        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/community-posts/{$this->post->id}/vote", [
                'type' => 'upvote'
            ]);

        // Then change to downvote
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/community-posts/{$this->post->id}/vote", [
                'type' => 'downvote'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Vote updated successfully',
                'data' => [
                    'upvotes' => 0,
                    'downvotes' => 1,
                    'total_votes' => -1
                ]
            ]);

            $this->assertDatabaseHas('votes', [
                'user_id' => $this->user->id,
                'post_id' => $this->post->id,
                'type' => 'downvote'
            ]);

            $this->assertDatabaseHas('notifications', [
                'user_id' => $this->post->user->id,
                'type_id' => $this->getNotificationTypeId('post_downvoted'),
            ]);

            $notification = \App\Models\Notification::where('user_id', $this->post->user->id)
                ->where('type_id', $this->getNotificationTypeId('post_downvoted'))
                ->first();

            $this->assertNotNull($notification);
            $this->assertEquals($this->user->id, $notification->data['user_id']);
            $this->assertEquals($this->post->id, $notification->data['post_id']);
    }

    /** @test */
    public function user_can_remove_vote()
    {
        // First upvote
        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/community-posts/{$this->post->id}/vote", [
                'type' => 'upvote'
            ]);

        // Then vote again to remove
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/community-posts/{$this->post->id}/vote", [
                'type' => 'upvote'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Vote removed successfully',
                'data' => [
                    'upvotes' => 0,
                    'downvotes' => 0,
                    'total_votes' => 0
                ]
            ]);

        $this->assertDatabaseMissing('votes', [
            'user_id' => $this->user->id,
            'post_id' => $this->post->id
        ]);
    }

    /** @test */
    public function user_can_get_their_vote_status()
    {
        // Create a vote
        Vote::create([
            'user_id' => $this->user->id,
            'post_id' => $this->post->id,
            'type' => 'upvote'
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/community-posts/{$this->post->id}/my-vote");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'type' => 'upvote'
                ]
            ]);
    }

    /** @test */
    public function returns_null_if_user_has_not_voted()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/community-posts/{$this->post->id}/my-vote");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => null
            ]);
    }

    /** @test */
    public function cannot_vote_on_nonexistent_post()
    {
        $nonExistentId = 9999;

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/community-posts/{$nonExistentId}/vote", [
                'type' => 'upvote'
            ]);

        $response->assertStatus(404);
    }

    /** @test */
    public function vote_type_is_required()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/community-posts/{$this->post->id}/vote", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    /** @test */
    public function vote_type_must_be_valid()
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/community-posts/{$this->post->id}/vote", [
                'type' => 'invalid_vote_type'
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    /** @test */
    public function multiple_users_can_vote_on_same_post()
    {
        // First user votes
        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/community-posts/{$this->post->id}/vote", [
                'type' => 'upvote'
            ]);

        // Second user votes
        $secondUser = User::factory()->create();
        $secondUser->assignRole('user');

        $response = $this->actingAs($secondUser, 'sanctum')
            ->postJson("/api/community-posts/{$this->post->id}/vote", [
                'type' => 'upvote'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'upvotes' => 2,
                    'downvotes' => 0,
                    'total_votes' => 2
                ]
            ]);
    }
}
