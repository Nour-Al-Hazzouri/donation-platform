<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AnnouncementTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();

        // Run the RoleSeeder to set up permissions
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    /** @test */
    public function it_can_list_announcements()
    {
        // Create some announcements
        $announcements = Announcement::factory()->count(3)->create();

        // Create a regular user
        $user = User::factory()->create();
        $user->assignRole('user');

        // Authenticate the user
        Sanctum::actingAs($user);

        // Make the request
        $response = $this->getJson('/api/announcements');

        // Assert the response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'content',
                        'priority',
                        'image_urls',
                        'created_at',
                        'user' => [
                            'id',
                            'first_name',
                            'last_name',
                            'username',
                        ]
                    ]
                ],
                'message'
            ]);
    }

    /** @test */
    public function it_can_show_an_announcement()
    {
        // Create an announcement
        $announcement = Announcement::factory()->create();

        // Create a regular user
        $user = User::factory()->create();
        $user->assignRole('user');

        // Authenticate the user
        Sanctum::actingAs($user);

        // Make the request
        $response = $this->getJson("/api/announcements/{$announcement->id}");

        // Assert the response
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'content' => $announcement->content,
                    'image_urls' => $announcement->image_urls,
                ],
                'message' => 'Announcement retrieved successfully'
            ]);
    }

    /** @test */
    public function it_requires_authentication_to_create_announcement()
    {
        $announcementData = [
            'title' => 'Test Announcement',
            'content' => 'This is a test announcement',
            'priority' => 'high',
        ];

        $response = $this->postJson('/api/announcements', $announcementData);
        $response->assertStatus(401);
    }

    /** @test */
    public function it_requires_admin_to_create_announcement()
    {
        // Create a moderator user (non-admin)
        $moderator = User::factory()->create();
        $moderator->assignRole('moderator');

        // Authenticate the moderator
        Sanctum::actingAs($moderator);

        $announcementData = [
            'title' => 'Test Announcement',
            'content' => 'This is a test announcement',
            'priority' => 'high',
        ];

        $response = $this->postJson('/api/announcements', $announcementData);
        $response->assertStatus(403);
    }

    /** @test */
    public function it_can_create_an_announcement()
    {
        // Create an admin user
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        // Authenticate the admin
        Sanctum::actingAs($admin);

        $images = [
            UploadedFile::fake()->image('image1.jpg'),
            UploadedFile::fake()->image('image2.jpg'),
        ];

        $announcementData = [
            'title' => 'Test Announcement',
            'content' => 'This is a test announcement',
            'priority' => 'high',
            'image_urls' => $images
        ];

        $response = $this->postJson('/api/announcements', $announcementData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'title' => 'Test Announcement',
                    'content' => 'This is a test announcement',
                    'priority' => 'high',
                    'user' => [
                        'id' => $admin->id,
                        'first_name' => $admin->first_name,
                        'last_name' => $admin->last_name,
                        'username' => $admin->username
                    ]
                ],
                'message' => 'Announcement created successfully'
            ]);

        $this->assertDatabaseHas('announcements', [
            'title' => 'Test Announcement',
            'content' => 'This is a test announcement',
            'user_id' => $admin->id
        ]);
    }

    /** @test */
    public function it_validates_announcement_creation()
    {
        // Create a moderator user
        $user = User::factory()->create();
        $user->assignRole('admin');

        // Authenticate the user
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/announcements', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'content']);
    }

    /** @test */
    public function it_can_update_an_announcement()
    {
        // Create an admin user
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        // Create an announcement by any user (admin can update any announcement)
        $announcement = Announcement::factory()->create();

        // Authenticate as admin
        Sanctum::actingAs($admin);

        $updateData = [
            'title' => 'Updated Title',
            'content' => 'Updated content',
            'priority' => 'medium'
        ];

        $response = $this->putJson("/api/announcements/{$announcement->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'title' => 'Updated Title',
                    'content' => 'Updated content',
                    'priority' => 'medium',
                    'user' => [
                        'id' => $announcement->user->id,
                        'first_name' => $announcement->user->first_name,
                        'last_name' => $announcement->user->last_name,
                        'username' => $announcement->user->username,
                    ]
                ],
                'message' => 'Announcement updated successfully'
            ]);
    }

    /** @test */
    public function it_prevents_non_admin_updates()
    {
        // Create a moderator user (non-admin)
        $moderator = User::factory()->create();
        $moderator->assignRole('moderator');

        // Create an announcement
        $announcement = Announcement::factory()->create();

        // Authenticate as moderator
        Sanctum::actingAs($moderator);

        $updateData = [
            'title' => 'Unauthorized Update',
            'content' => 'This should not be allowed',
            'priority' => 'low'
        ];

        $response = $this->putJson("/api/announcements/{$announcement->id}", $updateData);
        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_update_any_announcement()
    {
        // Create an admin user
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        // Create a regular user
        $user = User::factory()->create();
        $user->assignRole('user');

        // Create an announcement by the regular user
        $announcement = Announcement::factory()->create(['user_id' => $user->id]);

        // Authenticate as admin
        Sanctum::actingAs($admin);

        $updateData = [
            'title' => 'Admin Update',
            'content' => 'Admin can update any announcement',
            'priority' => 'high'
        ];

        $response = $this->putJson("/api/announcements/{$announcement->id}", $updateData);
        $response->assertStatus(200);
    }

    /** @test */
    public function it_can_delete_an_announcement()
    {
        // Create an admin user
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        // Create an announcement (can be by any user, admin can delete any)
        $announcement = Announcement::factory()->create();

        // Authenticate as admin
        Sanctum::actingAs($admin);

        $response = $this->deleteJson("/api/announcements/{$announcement->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Announcement deleted successfully'
            ]);

        $this->assertDatabaseMissing('announcements', ['id' => $announcement->id]);
    }

    /** @test */
    public function it_prevents_non_admin_deletion()
    {
        // Create a moderator user (non-admin)
        $moderator = User::factory()->create();
        $moderator->assignRole('moderator');

        // Create an announcement
        $announcement = Announcement::factory()->create();

        // Authenticate as moderator
        Sanctum::actingAs($moderator);

        $response = $this->deleteJson("/api/announcements/{$announcement->id}");
        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_delete_any_announcement()
    {
        // Create an admin user
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        // Create a regular user
        $user = User::factory()->create();
        $user->assignRole('user');

        // Create an announcement by the regular user
        $announcement = Announcement::factory()->create(['user_id' => $user->id]);

        // Authenticate as admin
        Sanctum::actingAs($admin);

        $response = $this->deleteJson("/api/announcements/{$announcement->id}");
        $response->assertStatus(200);

        $this->assertDatabaseMissing('announcements', ['id' => $announcement->id]);
    }
}
