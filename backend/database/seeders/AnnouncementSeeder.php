<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Announcement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'admin')->get();
        $priorities = ['low', 'medium', 'high'];

        // Create 10 announcements
        for ($i = 0; $i < 10; $i++) {
            Announcement::create([
                'user_id' => $users->random()->id,
                'title' => $this->generateAnnouncementTitle(),
                'content' => $this->generateAnnouncementContent(),
                'priority' => $priorities[array_rand($priorities)],
                'image_urls' => $this->generateAnnouncementImages(rand(0, 4)),
            ]);
        }
    }

    private function generateAnnouncementTitle(): string
    {
        $titles = [
            'Platform Maintenance Notice',
            'New Features Available!',
            'Important Update: Donation Process',
            'Welcome to Our New Platform',
            'Upcoming Community Event',
            'Success Stories: How Your Donations Help',
            'Monthly Newsletter: Latest Updates',
            'Thank You for Your Support!',
            'How to Get the Most Out of Our Platform',
            'Announcing New Partnership'
        ];

        return $titles[array_rand($titles)];
    }

    private function generateAnnouncementContent(): string
    {
        $paragraphCount = rand(2, 4);

        $contents = [
            "We're excited to announce some important updates to our platform. These changes are designed to improve your experience and make it easier to support the causes you care about.",
            "Thank you for being a valued member of our community. Your support helps us make a real difference in people's lives every day.",
            "We've listened to your feedback and have made several improvements to our platform. Here's what's new...",
            "Join us for an upcoming event where we'll be discussing our latest initiatives and how you can get involved.",
            "We're proud to share some success stories from our community. Your donations are making a real impact!",
            "As part of our ongoing commitment to transparency, we want to share some updates about how your contributions are being used.",
            "We're thrilled to announce a new partnership that will help us expand our reach and support even more people in need.",
            "Our team has been working hard to bring you new features and improvements. Here's what you can expect in the coming weeks...",
            "We want to take a moment to thank all of our amazing donors and volunteers. None of this would be possible without you!",
            "Stay tuned for exciting updates and announcements. We have some big things planned for the future!"
        ];

        $selectedContents = (array) array_rand(array_flip($contents), $paragraphCount);
        return implode("\n\n", $selectedContents);
    }

    private function generateAnnouncementImages(int $count): array
    {
        if (app()->environment('testing')) {
            return [];
        }

        $images = [];
        for ($i = 0; $i < $count; $i++) {
            $image = \Illuminate\Http\UploadedFile::fake()->image('announcement_' . uniqid() . '.jpg', 800, 600);
            $path = 'announcements/' . uniqid() . '.jpg';
            \Illuminate\Support\Facades\Storage::disk('public')->put($path, file_get_contents($image));
            $images[] = $path;
        }
        return $images;
    }
}
