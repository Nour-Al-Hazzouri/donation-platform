<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Location;
use App\Models\DonationEvent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DonationEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $locations = Location::all();
        $statuses = ['active', 'completed', 'cancelled', 'suspended'];
        $types = ['request', 'offer'];

        // Create 50 donation events
        for ($i = 0; $i < 50; $i++) {
            $goalAmount = rand(1000, 50000);
            $currentAmount = rand(0, $goalAmount);
            $imageCount = rand(0, 4);

            DonationEvent::create([
                'user_id' => $users->random()->id,
                'location_id' => $locations->random()->id,
                'title' => $this->generateEventTitle(),
                'description' => $this->generateEventDescription(),
                'images' => $imageCount > 0 ? array_slice([
                    'https://picsum.photos/800/600?random=' . rand(1, 1000),
                    'https://picsum.photos/800/600?random=' . rand(1001, 2000),
                    'https://picsum.photos/800/600?random=' . rand(2001, 3000),
                    'https://picsum.photos/800/600?random=' . rand(3001, 4000),
                ], 0, $imageCount) : [],
                'goal_amount' => $goalAmount,
                'current_amount' => $currentAmount,
                'type' => $types[array_rand($types)],
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }

    private function generateEventTitle(): string
    {
        $prefixes = ['Help', 'Support', 'Donate to', 'Fund', 'Save', 'Assist with'];
        $causes = [
            'medical treatment for',
            'education for',
            'shelter for',
            'food for',
            'recovery of',
            'rebuilding',
            'emergency aid for',
            'relief for'
        ];
        $subjects = [
            'children in need',
            'refugee families',
            'cancer patients',
            'earthquake victims',
            'flood-affected families',
            'orphans',
            'homeless people',
            'disabled individuals',
            'war victims',
            'school reconstruction',
            'hospital equipment',
            'community center'
        ];

        $prefix = $prefixes[array_rand($prefixes)];
        $cause = $causes[array_rand($causes)];
        $subject = $subjects[array_rand($subjects)];

        return "$prefix $cause $subject";
    }

    private function generateEventDescription(): string
    {
        $paragraphs = [];
        $paragraphCount = rand(3, 6);

        for ($i = 0; $i < $paragraphCount; $i++) {
            $sentences = [];
            $sentenceCount = rand(3, 6);

            for ($j = 0; $j < $sentenceCount; $j++) {
                $sentences[] = $this->generateRandomSentence();
            }

            $paragraphs[] = implode(' ', $sentences);
        }

        return implode("\n\n", $paragraphs);
    }

    private function generateRandomSentence(): string
    {
        $subjects = ['We', 'Our team', 'This initiative', 'The community', 'Your support'];
        $verbs = ['aims to', 'strives to', 'works to', 'is determined to', 'hopes to'];
        $actions = [
            'provide essential aid',
            'offer support',
            'make a difference',
            'create opportunities',
            'rebuild lives',
            'restore hope',
            'deliver assistance',
            'ensure access',
            'improve conditions'
        ];
        $targets = [
            'to those in need',
            'for the affected families',
            'in the region',
            'to the community',
            'for a better future',
            'with your generous help',
            'through collective efforts'
        ];

        $subject = $subjects[array_rand($subjects)];
        $verb = $verbs[array_rand($verbs)];
        $action = $actions[array_rand($actions)];
        $target = $targets[array_rand($targets)];

        return ucfirst("$subject $verb $action $target.");
    }
}
