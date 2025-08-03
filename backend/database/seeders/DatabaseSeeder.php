<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Location;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\NotificationTypeSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\LocationSeeder;
use Database\Seeders\DonationEventSeeder;
use Database\Seeders\CommunityPostSeeder;
use Database\Seeders\CommentSeeder;
use Database\Seeders\VoteSeeder;
use Database\Seeders\VerificationSeeder;
use Database\Seeders\AnnouncementSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default roles
        $this->call(RoleSeeder::class);

        // Create locations
        $this->call(LocationSeeder::class);

        // Create notification types
        $this->call(NotificationTypeSeeder::class);

        // Create admin user
        $admin = User::factory()->create([
            'username' => 'admin',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@donationplatform.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_verified' => true,
            'location_id' => Location::first()->id
        ]);
        $admin->assignRole('admin');

        // Create test users
        User::factory(10)->create();

        // Create other data
        $this->call([
            DonationEventSeeder::class,
            CommunityPostSeeder::class,
            CommentSeeder::class,
            VoteSeeder::class,
            VerificationSeeder::class,
            AnnouncementSeeder::class,
        ]);
    }
}
