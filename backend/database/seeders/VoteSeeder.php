<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vote;
use App\Models\CommunityPost;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $posts = CommunityPost::all();

        // For each post, have 10-30% of users vote on it
        foreach ($posts as $post) {
            $voterCount = max(1, (int) ($users->count() * (rand(10, 30) / 100)));
            $voters = $users->random($voterCount);

            foreach ($voters as $voter) {
                // 80% chance of upvote, 20% chance of downvote
                $type = rand(1, 100) <= 80 ? 'upvote' : 'downvote';

                Vote::create([
                    'user_id' => $voter->id,
                    'post_id' => $post->id,
                    'type' => $type,
                ]);
            }
        }
    }
}
