<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Comment;
use App\Models\CommunityPost;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $posts = CommunityPost::all();

        // Create 500 comments
        for ($i = 0; $i < 500; $i++) {
            $post = $posts->random();
            $user = $users->random();

            // Create between 1-5 comments per post
            $commentCount = rand(1, 5);

            for ($j = 0; $j < $commentCount; $j++) {
                Comment::create([
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                    'content' => $this->generateCommentContent(),
                ]);

                // Add some delay between comments
                $post->created_at = $post->created_at->addMinutes(rand(1, 60));
                $post->save();
            }
        }
    }

    private function generateCommentContent(): string
    {
        $phrases = [
            "This is amazing work! Keep it up!",
            "I'm so proud of what you're doing for the community.",
            "How can I get involved? I'd love to help!",
            "Thank you for making a difference in people's lives.",
            "I've shared this with my network. Let's spread the word!",
            "Your dedication is truly inspiring. ❤️",
            "This is exactly what our community needs right now.",
            "I've made a small donation. Wishing you all the best!",
            "Could you share more details about your next steps?",
            "I know someone who might be able to help. I'll connect you.",
            "Your work is changing lives. Thank you!",
            "I've been following your progress. Amazing results so far!",
            "This is such an important cause. Count me in!",
            "How can businesses in the area support your efforts?",
            "Sending love and support from [City]. Keep going!"
        ];

        // Randomly select 1-2 phrases and combine them
        $selectedPhrases = (array) array_rand(array_flip($phrases), rand(1, 2));
        return implode(' ', $selectedPhrases);
    }
}
