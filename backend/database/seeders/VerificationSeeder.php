<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Verification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VerificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $verifiers = User::where('role', 'admin')->get();

        // Create verifications for 30% of users
        $verificationCount = (int) ($users->count() * 0.3);
        $usersToVerify = $users->random($verificationCount);

        foreach ($usersToVerify as $user) {
            $status = $this->getWeightedStatus();
            $imageCount = rand(1, 4);

            $verification = new Verification([
                'user_id' => $user->id,
                'verifier_id' => $status !== 'pending' ? $verifiers->random()->id : null,
                'document_type' => $this->getRandomDocumentType(),
    'image_urls' => $imageCount > 0 ? array_slice([
        'https://picsum.photos/800/600?random=' . rand(1, 1000),
        'https://picsum.photos/800/600?random=' . rand(1001, 2000),
        'https://picsum.photos/800/600?random=' . rand(2001, 3000),
        'https://picsum.photos/800/600?random=' . rand(3001, 4000),
    ], 0, $imageCount) : [],
                'status' => $status,
                'notes' => $status !== 'pending' ? $this->getVerificationNotes($status) : null,
                'verified_at' => $status !== 'pending' ? now()->subDays(rand(1, 60)) : null,
            ]);

            $verification->save();
        }
    }

    private function getWeightedStatus(): string
    {
        $statuses = [
            'approved' => 70, // 70% chance
            'pending' => 20,  // 20% chance
            'rejected' => 10, // 10% chance
        ];

        $total = array_sum($statuses);
        $random = rand(1, $total);
        $current = 0;

        foreach ($statuses as $status => $weight) {
            $current += $weight;
            if ($random <= $current) {
                return $status;
            }
        }

        return 'pending'; // fallback
    }

    private function getRandomDocumentType(): string
    {
        $types = ['id_card', 'passport', 'driver_license'];
        return $types[array_rand($types)];
    }

    private function getVerificationNotes(string $status): string
    {
        if ($status === 'approved') {
            $phrases = [
                'Documents verified successfully.',
                'Identity confirmed.',
                'Verification process completed.',
                'All documents are valid and verified.',
            ];
        } else {
            $phrases = [
                'Document image is blurry.',
                'Incomplete information provided.',
                'Document appears to be altered or tampered with.',
                'Unable to verify identity with provided documents.',
                'Document has expired.',
            ];
        }

        return $phrases[array_rand($phrases)];
    }
}
