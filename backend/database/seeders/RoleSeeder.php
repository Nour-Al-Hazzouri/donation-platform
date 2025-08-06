<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Location permissions
            'view locations',
            'create locations',
            'edit locations',
            'delete locations',
            // User permissions
            'view users',
            'create users',
            'edit users',
            'delete users',
            'promote users',
            // Announcement permissions
            'view announcements',
            'create announcements',
            'edit announcements',
            'edit own announcements',
            'delete announcements',
            'delete own announcements',
            // Donation Event permissions
            'view donation_events',
            'create donation_events',
            'edit donation_events',
            'edit own donation_events',
            'delete donation_events',
            'delete own donation_events',
            'manage donation_events',
            // Post permissions
            'view posts',
            'create posts',
            'edit posts',
            'edit own posts',
            'delete posts',
            'delete own posts',
            'manage posts',
            // Comment permissions
            'view comments',
            'create comments',
            'edit comments',
            'edit own comments',
            'delete comments',
            'delete own comments',
            // Verification permissions
            'verify users',
            'manage verifications',
            // Moderation permissions
            'moderate content',
            'view reports',
            'resolve reports',
            // Admin permissions
            'manage settings',
            'manage users',
            'view statistics',
            'promote users',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Define user permissions (base level)
        $userPermissions = [
            'view locations',
            'view donation_events',
            'create donation_events',
            'edit own donation_events',
            'delete own donation_events',
            'view posts',
            'create posts',
            'edit own posts',
            'delete own posts',
            'view comments',
            'create comments',
            'edit own comments',
            'delete own comments',
            'view announcements'
        ];

        // Define additional moderator permissions (on top of user permissions)
        $moderatorOnlyPermissions = [
            'view users',
            'manage donation_events',
            'manage posts',
            'moderate content',
            'view reports',
            'resolve reports'
        ];

        // Combine user and moderator permissions
        $moderatorPermissions = array_merge($userPermissions, $moderatorOnlyPermissions);

        // Define additional admin permissions (on top of moderator permissions)
        $adminOnlyPermissions = [
            'create locations',
            'edit locations',
            'delete locations',
            'create users',
            'edit users',
            'delete users',
            'delete donation_events',
            'delete posts',
            'delete comments',
            'verify users',
            'manage verifications',
            'manage settings',
            'manage users',
            'view statistics',
            'promote users',
            'create announcements',
            'edit own announcements',
            'delete own announcements',
            'edit announcements',
            'delete announcements'
        ];

        // Combine moderator and admin permissions
        $adminPermissions = array_merge($moderatorPermissions, $adminOnlyPermissions);

        // Create roles and assign permissions
        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->syncPermissions($userPermissions);

        $moderatorRole = Role::firstOrCreate(['name' => 'moderator']);
        $moderatorRole->syncPermissions($moderatorPermissions);

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions($adminPermissions);
    }
}
