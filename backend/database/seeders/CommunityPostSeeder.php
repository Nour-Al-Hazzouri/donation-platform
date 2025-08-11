<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DonationEvent;
use App\Models\CommunityPost;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommunityPostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $events = DonationEvent::all();
        $tags = ['donation', 'help', 'charity', 'community', 'support', 'volunteer', 'fundraising', 'donate'];

        if ($events->isEmpty()) {
            $this->call(DonationEventSeeder::class);
        }
        // Create 200 community posts
        for ($i = 0; $i < 200; $i++) {
            $imageCount = rand(0, 4);
            $tagCount = rand(0, 3);

            $post = new CommunityPost([
                'user_id' => $users->random()->id,
                'event_id' => $events->random()->id,
                'content' => $this->generatePostContent(),
                'image_urls' => $this->generatePostImages($imageCount),
                'tags' => $tagCount > 0 ? array_rand(array_flip($tags), $tagCount) : [],
            ]);

            // Convert array tags to JSON if it's an array
            if (is_array($post->tags)) {
                $post->tags = json_encode($post->tags);
            }

            $post->save();
        }
    }

    private function generatePostContent(): string
    {
        $contents = [
            "Just wanted to share some updates on our recent activities. The community has been incredibly supportive!",
            "Thank you to everyone who has contributed so far. Your generosity is making a real difference in people's lives.",
            "We're excited to announce some upcoming events. Stay tuned for more details!",
            "A big shoutout to all our volunteers who have been working tirelessly to make this possible.",
            "Your donations are helping us achieve our goals. Here's how we're putting them to good use...",
            "We've reached another milestone! Thanks to your support, we're one step closer to our target.",
            "Meet some of the people whose lives have been changed by your kindness.",
            "Behind the scenes: A day in the life of our team on the ground.",
            "We're facing some challenges but remain committed to our mission. Here's how you can help...",
            "Success story: How your donations transformed a family's life.",
        ];

        // Randomly select 1-3 content pieces and combine them
        $selectedContents = (array) array_rand(array_flip($contents), rand(1, 3));
        return implode("\n\n", $selectedContents);
    }

    private function generatePostImages(int $count): array
    {
        if (app()->environment('testing')) {
            return [];
        }

        $images = [];
        for ($i = 0; $i < $count; $i++) {
            $image = \Illuminate\Http\UploadedFile::fake()->image('post_' . uniqid() . '.jpg', 800, 600);
            $path = 'community/posts/' . uniqid() . '.jpg';
            \Illuminate\Support\Facades\Storage::disk('public')->put($path, file_get_contents($image));
            $images[] = $path;
        }
        return $images;
    }
}
