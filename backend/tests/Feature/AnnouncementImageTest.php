<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AnnouncementImageTest extends TestCase
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

        $this->user = User::factory()->create();
        $this->user->assignRole('user');
        $this->token = $this->user->createToken('test-token')->plainTextToken;

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
        $this->adminToken = $this->admin->createToken('admin-token')->plainTextToken;

        Storage::fake('public');
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

    /** @test */
    public function admin_can_create_announcement_with_images()
    {
        $images = [
            UploadedFile::fake()->image('announcement1.jpg'),
            UploadedFile::fake()->image('announcement2.jpg')
        ];

        $response = $this->actingAsAdmin()
            ->postJson('/api/announcements', [
                'title' => 'Test Announcement',
                'content' => 'This is a test announcement with images',
                'priority' => 'high',
                'image_urls' => $images,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'content',
                    'image_urls',
                    'image_full_urls',
                ]
            ]);

        $announcement = Announcement::find($response->json('data.id'));
        $this->assertCount(2, $announcement->image_urls);
        $this->assertCount(2, $announcement->image_full_urls);

        // Assert files were stored
        foreach ($announcement->image_urls as $imagePath) {
            $this->assertTrue(Storage::disk('public')->exists($imagePath));
        }
    }

    /** @test */
    public function admin_can_add_images_to_existing_announcement()
    {
        $imagePath = 'announcements/' . uniqid() . '.jpg';
        $fakeImage = UploadedFile::fake()->image('test.jpg');
        $imageContent = file_get_contents($fakeImage->getRealPath());
        Storage::disk('public')->put($imagePath, $imageContent);

        $announcement = Announcement::factory()->create([
            'user_id' => $this->admin->id,
            'image_urls' => [$imagePath],
        ]);

        // New images to add
        $newImages = [
            UploadedFile::fake()->image('new-image1.jpg'),
            UploadedFile::fake()->image('new-image2.jpg')
        ];

        $response = $this->actingAsAdmin()
            ->putJson("/api/announcements/{$announcement->id}", [
                'image_urls' => $newImages,
            ]);

        $response->assertStatus(200);

        // Should have 4 images now (2 existing + 2 new)
        $responseData = $response->json('data');
        $this->assertCount(3, $responseData['image_urls']);
        $this->assertCount(3, $responseData['image_full_urls']);

        // Assert files were stored
        foreach ($responseData['image_urls'] as $imagePath) {
            $this->assertTrue(Storage::disk('public')->exists($imagePath));
        }
    }

    /** @test */
    public function admin_can_remove_images_from_announcement()
    {
        $imagePath = 'announcements/' . uniqid() . '.jpg';
        $fakeImage = UploadedFile::fake()->image('test.jpg');
        $imageContent = file_get_contents($fakeImage->getRealPath());
        Storage::disk('public')->put($imagePath, $imageContent);

        $announcement = Announcement::factory()->create([
            'user_id' => $this->admin->id,
            'image_urls' => [$imagePath]
        ]);

        $response = $this->actingAsAdmin()
            ->putJson("/api/announcements/{$announcement->id}", [
                'remove_image_urls' => [$imagePath],
            ]);

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data.image_urls'));

        // Assert file was deleted
        $this->assertFalse(Storage::disk('public')->exists($imagePath));
    }

    /** @test */
    public function it_deletes_images_when_announcement_is_deleted()
    {
        $imagePath = 'announcements/' . uniqid() . '.jpg';
        $fakeImage = UploadedFile::fake()->image('test.jpg');
        $imageContent = file_get_contents($fakeImage->getRealPath());
        Storage::disk('public')->put($imagePath, $imageContent);

        $announcement = Announcement::factory()->create([
            'user_id' => $this->admin->id,
            'image_urls' => [$imagePath]
        ]);

        $response = $this->actingAsAdmin()
            ->deleteJson("/api/announcements/{$announcement->id}");

        $response->assertStatus(200);

        // Assert file was deleted
        $this->assertFalse(Storage::disk('public')->exists($imagePath));
    }

    /** @test */
    public function it_validates_image_file_types()
    {
        $invalidFile = UploadedFile::fake()->create('document.pdf', 1000);

        $response = $this->actingAsAdmin()
            ->postJson('/api/announcements', [
                'title' => 'Test Announcement',
                'content' => 'This is a test announcement with invalid image',
                'priority' => 'high',
                'image_urls' => [$invalidFile],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['image_urls.0']);
    }

    /** @test */
    public function non_admin_cannot_create_announcement_with_images()
    {
        $images = [
            UploadedFile::fake()->image('announcement1.jpg'),
        ];

        $response = $this->actingAsUser()
            ->postJson('/api/announcements', [
                'title' => 'Test Announcement',
                'content' => 'This is a test announcement with images',
                'priority' => 'high',
                'image_urls' => $images,
            ]);

        $response->assertStatus(403);
    }
}
