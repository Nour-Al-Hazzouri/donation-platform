<?php

namespace Tests\Feature;

use App\Models\DonationEvent;
use App\Models\Location;
use App\Models\User;
use App\Models\Verification;
use Database\Seeders\RoleSeeder;
use Database\Seeders\NotificationTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DonationEventImageTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $token;
    protected $location;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        $this->seed(NotificationTypeSeeder::class);

        $this->user = User::factory()->create();
        $this->user->assignRole('user');
        $this->token = $this->user->createToken('test-token')->plainTextToken;

        $this->location = Location::factory()->create();

        // Create a verification for the user
        Verification::create([
            'user_id' => $this->user->id,
            'document_type' => 'id_card',
            'image_urls' => ['verifications/1/test.jpg'],
            'status' => 'approved',
        ]);

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
    public function user_can_create_donation_event_with_images()
    {
        $images = [
            UploadedFile::fake()->image('event1.jpg'),
            UploadedFile::fake()->image('event2.jpg')
        ];

        $response = $this->actingAsUser()
            ->postJson('/api/donation-events', [
                'title' => 'Test Donation Event',
                'description' => 'This is a test donation event with images',
                'goal_amount' => 1000,
                'type' => 'request',
                'location_id' => $this->location->id,
                'image_urls' => $images,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'description',
                    'image_urls',
                    'image_full_urls',
                ]
            ]);

        $event = DonationEvent::find($response->json('data.id'));
        $this->assertCount(2, $event->image_urls);
        $this->assertCount(2, $event->image_full_urls);

        // Assert files were stored
        foreach ($event->image_urls as $imagePath) {
            $this->assertTrue(Storage::disk('public')->exists($imagePath));
        }
    }

    /** @test */
    public function user_can_add_images_to_existing_donation_event()
    {
        $imagePath = 'donation_events/' . uniqid() . '.jpg';
        $fakeImage = UploadedFile::fake()->image('test.jpg');
        $imageContent = file_get_contents($fakeImage->getRealPath());
        Storage::disk('public')->put($imagePath, $imageContent);

        // Create event with existing images
        $event = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'location_id' => $this->location->id,
            'image_urls' => [$imagePath]
        ]);

        // New images to add
        $newImages = [
            UploadedFile::fake()->image('new-image1.jpg'),
            UploadedFile::fake()->image('new-image2.jpg')
        ];

        $response = $this->actingAsUser()
            ->putJson("/api/donation-events/{$event->id}", [
                'image_urls' => $newImages,
            ]);

        $response->assertStatus(200);

        // Should have 3 images now (1 existing + 2 new)
        $responseData = $response->json('data');
        $this->assertCount(3, $responseData['image_urls']);
        $this->assertCount(3, $responseData['image_full_urls']);

        // Assert files were stored
        foreach ($responseData['image_urls'] as $imagePath) {
            $this->assertTrue(Storage::disk('public')->exists($imagePath));
        }
    }

    /** @test */
    public function user_can_remove_images_from_donation_event()
    {
        $imagePath = 'donation_events/' . uniqid() . '.jpg';
        $fakeImage = UploadedFile::fake()->image('test.jpg');
        $imageContent = file_get_contents($fakeImage->getRealPath());
        Storage::disk('public')->put($imagePath, $imageContent);

        $event = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'location_id' => $this->location->id,
            'image_urls' => [$imagePath]
        ]);

        $response = $this->actingAsUser()
            ->putJson("/api/donation-events/{$event->id}", [
                'remove_image_urls' => [$imagePath],
            ]);

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data.image_urls'));

        // Assert file was deleted
        $this->assertFalse(Storage::disk('public')->exists($imagePath));
    }

    /** @test */
    public function it_deletes_images_when_donation_event_is_deleted()
    {
        $imagePath = 'donation_events/' . uniqid() . '.jpg';
        $fakeImage = UploadedFile::fake()->image('test.jpg');
        $imageContent = file_get_contents($fakeImage->getRealPath());
        Storage::disk('public')->put($imagePath, $imageContent);

        $event = DonationEvent::factory()->create([
            'user_id' => $this->user->id,
            'location_id' => $this->location->id,
            'image_urls' => [$imagePath]
        ]);

        $response = $this->actingAsUser()
            ->deleteJson("/api/donation-events/{$event->id}");

        $response->assertStatus(200);

        // Assert file was deleted
        $this->assertFalse(Storage::disk('public')->exists($imagePath));
    }

    /** @test */
    public function it_validates_image_file_types()
    {
        $invalidFile = UploadedFile::fake()->create('document.pdf', 1000);

        $response = $this->actingAsUser()
            ->postJson('/api/donation-events', [
                'title' => 'Test Donation Event',
                'description' => 'This is a test event with invalid image',
                'goal_amount' => 1000,
                'type' => 'request',
                'location_id' => $this->location->id,
                'image_urls' => [$invalidFile],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['image_urls.0']);
    }
}
