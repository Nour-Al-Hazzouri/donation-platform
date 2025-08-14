<?php

namespace Tests\Feature;

use App\Models\CommunityPost;
use App\Models\DonationEvent;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Database\Seeders\NotificationTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CommunityPostImageTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        $this->seed(NotificationTypeSeeder::class);

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

    /** @test */
    public function it_can_create_post_with_images()
    {
        $event = DonationEvent::factory()->create([
            'title' => 'Test Event',
            'status' => 'active',
            'type' => 'request',
            'goal_amount' => 100,
        ]);

        $images = [
            UploadedFile::fake()->image('post1.jpg'),
            UploadedFile::fake()->image('post2.jpg')
        ];

        $response = $this->actingAsUser()
            ->postJson('/api/community-posts', [
                'content' => 'Test post with images',
                'event_id' => $event->id,
                'image_urls' => $images,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'content',
                    'image_urls',
                    'image_full_urls',
                ]
            ]);

        $post = CommunityPost::find($response->json('data.id'));
        $this->assertCount(2, $post->image_urls);
        $this->assertCount(2, $post->image_full_urls);

        // Assert files were stored
        foreach ($post->image_urls as $imagePath) {
            $this->assertTrue(Storage::disk('public')->exists($imagePath));
        }
    }

    /** @test */
    public function it_can_add_images_to_existing_post()
    {
        $event = DonationEvent::factory()->create([
            'title' => 'Test Event',
            'status' => 'active',
            'type' => 'request',
            'goal_amount' => 100,
        ]);

        // Create and store initial images
        $image1 = UploadedFile::fake()->image('post1.jpg');
        $image2 = UploadedFile::fake()->image('post2.jpg');

        $imagePath1 = 'community/posts/' . uniqid() . '.jpg';
        $imagePath2 = 'community/posts/' . uniqid() . '.jpg';

        Storage::disk('public')->put($imagePath1, file_get_contents($image1));
        Storage::disk('public')->put($imagePath2, file_get_contents($image2));

        // Create post with existing images
        $post = CommunityPost::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $event->id,
            'image_urls' => [$imagePath1, $imagePath2]
        ]);

        // New images to add
        $newImages = [
            UploadedFile::fake()->image('new-image.jpg'),
            UploadedFile::fake()->image('new-image2.jpg')
        ];

        $response = $this->actingAsUser()
            ->putJson("/api/community-posts/{$post->id}", [
                'image_urls' => $newImages,
            ]);

        $response->assertStatus(200);

        // Should have 4 images now (2 existing + 2 new)
        $responseData = $response->json('data');
        $this->assertCount(4, $responseData['image_urls']);
        $this->assertCount(4, $responseData['image_full_urls']);

        // Assert files were stored
        foreach ($responseData['image_urls'] as $imagePath) {
            $this->assertTrue(Storage::disk('public')->exists($imagePath));
        }

        // Cleanup - delete the test files
        Storage::disk('public')->delete($imagePath1);
        Storage::disk('public')->delete($imagePath2);
    }

    /** @test */
    public function it_can_remove_images_from_post()
    {
        $event = DonationEvent::factory()->create([
            'title' => 'Test Event',
            'status' => 'active',
            'type' => 'request',
            'goal_amount' => 100,
        ]);

        $imagePath = 'community/posts/' . uniqid() . '.jpg';
        $fakeImage = UploadedFile::fake()->image('test.jpg');
        $imageContent = file_get_contents($fakeImage->getRealPath());
        Storage::disk('public')->put($imagePath, $imageContent);

        $post = CommunityPost::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $event->id,
            'image_urls' => [$imagePath]
        ]);

        $response = $this->actingAsUser()
            ->putJson("/api/community-posts/{$post->id}", [
                'remove_image_urls' => [$imagePath],
            ]);

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data.image_urls'));

        // Assert file was deleted
        $this->assertFalse(Storage::disk('public')->exists($imagePath));
    }

    /** @test */
    public function it_deletes_images_when_post_is_deleted()
    {
        $event = DonationEvent::factory()->create([
            'title' => 'Test Event',
            'status' => 'active',
            'type' => 'request',
            'goal_amount' => 100,
        ]);

        $imagePath = 'community/posts/' . uniqid() . '.jpg';
        $fakeImage = UploadedFile::fake()->image('test.jpg');
        $imageContent = file_get_contents($fakeImage->getRealPath());
        Storage::disk('public')->put($imagePath, $imageContent);

        $post = CommunityPost::factory()->create([
            'user_id' => $this->user->id,
            'event_id' => $event->id,
            'image_urls' => [$imagePath]
        ]);

        $response = $this->actingAsUser()
            ->deleteJson("/api/community-posts/{$post->id}");

        $response->assertStatus(200);

        // Assert file was deleted
        $this->assertFalse(Storage::disk('public')->exists($imagePath));
    }

    /** @test */
    public function it_validates_image_file_types()
    {
        $event = DonationEvent::factory()->create([
            'title' => 'Test Event',
            'status' => 'active',
            'type' => 'request',
            'goal_amount' => 100,
        ]);

        $invalidFile = UploadedFile::fake()->create('document.pdf', 1000);

        $response = $this->actingAsUser()
            ->postJson('/api/community-posts', [
                'content' => 'Test post with invalid image',
                'event_id' => $event->id,
                'image_urls' => [$invalidFile],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['image_urls.0']);
    }
}
