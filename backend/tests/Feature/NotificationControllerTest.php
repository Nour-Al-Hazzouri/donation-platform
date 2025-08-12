<?php

namespace Tests\Feature;

use App\Enums\NotificationTypeEnum;
use App\Models\Notification;
use App\Models\NotificationType;
use App\Models\User;
use Database\Seeders\NotificationTypeSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class NotificationControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $otherUser;
    protected $admin;
    protected $authToken;
    protected $notifications;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles and permissions
        $this->seed(RoleSeeder::class);

        // Seed notification types
        $this->seed(NotificationTypeSeeder::class);

        // Create test users
        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        // Create auth token for the test user
        $this->authToken = $this->user->createToken('test-token')->plainTextToken;

        // Create some test notifications
        $this->createTestNotifications();
    }

    protected function createTestNotifications(): void
    {
        $types = NotificationType::all();

        // Create 5 unread notifications for the test user
        $this->notifications = Notification::factory()
            ->count(5)
            ->for($this->user)
            ->sequence(fn($sequence) => [
                'type_id' => $types->random()->id,
                'read_at' => null,
                'data' => [
                    'user_id' => $this->otherUser->id,
                ],
            ])
            ->create();

        // Create 5 read notifications for the test user
        $this->notifications = Notification::factory()
            ->count(5)
            ->for($this->user)
            ->sequence(fn($sequence) => [
                'type_id' => $types->random()->id,
                'read_at' => now(),
                'data' => [
                    'user_id' => $this->otherUser->id,
                ],
            ])
            ->create();

        // Create 5 notifications for another user
        Notification::factory()
            ->count(5)
            ->for($this->otherUser)
            ->create();
    }

    protected function actingAsUser()
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->authToken,
            'Accept' => 'application/json',
        ]);
    }

    /** @test */
    public function it_can_list_notifications_for_authenticated_user()
    {
        $response = $this->actingAsUser()
            ->getJson('/api/notifications');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'message',
                        'is_read',
                        'read_at',
                        'created_at',
                        'type' => [
                            'id',
                            'name',
                            'description',
                        ],
                        'related_user',
                    ]
                ],
                'links',
                'meta',
            ]);

        // Should only see user's own notifications
        $response->assertJsonCount(10, 'data');
    }

    /** @test */
    public function it_can_filter_notifications_by_type()
    {
        // Get a specific notification type
        $type = NotificationType::first();

        // Create a notification of this type for the test user
        $notification = Notification::factory()
            ->for($this->user)
            ->create([
                'type_id' => $type->id,
                'data' => [
                    'user_id' => $this->otherUser->id,
                ]
            ]);

        // Now filter by this type
        $response = $this->actingAsUser()
            ->getJson("/api/notifications?type={$type->name}");

        $response->assertStatus(200);

        // Verify the response contains our notification
        $response->assertJsonFragment([
            'id' => $notification->id,
            'type' => [
                'id' => $type->id,
                'name' => $type->name,
                'description' => $type->description,
            ]
        ]);
    }

    /** @test */
    public function it_can_filter_unread_notifications()
    {
        $response = $this->actingAsUser()
            ->getJson('/api/notifications', [
                'unread_only' => true  // Pass as boolean, not string
            ]);

        $response->assertStatus(200);

        // Should only have unread notifications
        $response->assertJsonMissing([
            'data' => [
                ['is_read' => true]
            ]
        ]);
    }

    /** @test */
    public function it_can_mark_notification_as_read()
    {
        // Get an unread notification
        $notification = Notification::where('user_id', $this->user->id)
            ->whereNull('read_at')
            ->first();

        // Make sure we have an unread notification
        $this->assertNull($notification->read_at);

        $response = $this->actingAsUser()
            ->putJson("/api/notifications/{$notification->id}/read");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Notification marked as read',
                'data' => [
                    'id' => $notification->id,
                    'is_read' => true,
                ]
            ]);

        $this->assertNotNull($notification->fresh()->read_at);
    }

    /** @test */
    public function it_can_mark_all_notifications_as_read()
    {
        $unreadCount = $this->user->unreadNotifications()->count();

        $response = $this->actingAsUser()
            ->putJson('/api/notifications/mark-all-read');

        $response->assertStatus(200)
            ->assertJson([
                'message' => "{$unreadCount} notifications marked as read",
            ]);

        $this->assertEquals(0, $this->user->unreadNotifications()->count());
    }

    /** @test */
    public function it_can_get_unread_count()
    {
        $unreadCount = $this->user->unreadNotifications()->count();

        $response = $this->actingAsUser()
            ->getJson('/api/notifications/unread-count');

        $response->assertStatus(200)
            ->assertJson([
                'unread_count' => $unreadCount,
            ]);
    }

    /** @test */
    public function it_can_delete_a_notification()
    {
        $notification = $this->user->notifications()->first();

        $response = $this->actingAsUser()
            ->deleteJson("/api/notifications/{$notification->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Notification deleted successfully',
            ]);

        $this->assertDatabaseMissing('notifications', [
            'id' => $notification->id,
            'user_id' => $this->user->id,
        ]);
    }

    /** @test */
    public function it_cannot_delete_another_users_notification()
    {
        $otherUserNotification = $this->otherUser->notifications()->first();

        $response = $this->actingAsUser()
            ->deleteJson("/api/notifications/{$otherUserNotification->id}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('notifications', [
            'id' => $otherUserNotification->id,
        ]);
    }

    /** @test */
    public function it_can_delete_all_notifications()
    {
        $notificationCount = $this->user->notifications()->count();

        $response = $this->actingAsUser()
            ->deleteJson('/api/notifications');

        $response->assertStatus(200)
            ->assertJson([
                'message' => "{$notificationCount} notifications deleted successfully",
            ]);

        $this->assertEquals(0, $this->user->notifications()->count());
    }

    /** @test */
    public function it_can_delete_all_read_notifications()
    {
        // Create 5 read notifications for the test user
        $this->notifications = Notification::factory()
            ->count(rand(1, 10))
            ->for($this->user)
            ->sequence(fn($sequence) => [
                'type_id' => NotificationType::all()->random()->id,
                'read_at' => now(),
                'data' => [
                    'user_id' => $this->otherUser->id,
                ],
            ])
            ->create();

        $readCount = $this->user->readNotifications()->count();

        $response = $this->actingAsUser()
            ->deleteJson('/api/notifications/read');

        $response->assertStatus(200)
            ->assertJson([
                'message' => "{$readCount} read notifications deleted successfully",
            ]);

        $this->assertEquals(0, $this->user->readNotifications()->count());
    }

    /** @test */
    public function it_can_get_notification_types()
    {
        $response = $this->actingAsUser()
            ->getJson('/api/notifications/types');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'description',
                        'template',
                        'created_at',
                        'updated_at',
                    ]
                ],
                'message',
            ]);
    }

    /** @test */
    public function it_requires_authentication()
    {
        // Test without authentication
        $response = $this->getJson('/api/notifications');
        $response->assertStatus(401);

        // Test with invalid token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid-token',
            'Accept' => 'application/json',
        ])->getJson('/api/notifications');

        $response->assertStatus(401);
    }

    /** @test */
    public function it_handles_pagination()
    {
        // Create more notifications to test pagination
        Notification::factory()
            ->count(20)
            ->for($this->user)
            ->create();

        $response = $this->actingAsUser()
            ->getJson('/api/notifications?per_page=5');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data')
            ->assertJsonStructure([
                'data',
                'links' => [
                    'first',
                    'last',
                    'prev',
                    'next'
                ],
                'meta' => [
                    'current_page',
                    'from',
                    'last_page',
                    'path',
                    'per_page',
                    'to',
                    'total',
                ]
            ]);
    }
}
