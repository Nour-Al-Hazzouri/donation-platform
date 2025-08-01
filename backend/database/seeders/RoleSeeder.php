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
            // Donation Event permissions
            'view donation_events',
            'create donation_events',
            'edit donation_events',
            'delete donation_events',
            'manage donation_events',
            // Post permissions
            'view posts',
            'create posts',
            'edit posts',
            'delete posts',
            'manage posts',
            // Comment permissions
            'view comments',
            'create comments',
            'edit comments',
            'delete comments',
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
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign created permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $moderatorPermissions = [
            'view locations',
            'view users',
            'view donation_events',
            'manage donation_events',
            'view posts',
            'manage posts',
            'view comments',
            'moderate content',
            'view reports',
            'resolve reports'
        ];

        foreach ($moderatorPermissions as $moderatorPermission) {
            Permission::firstOrCreate(['name' => $moderatorPermission]);
        }

        $moderatorRole = Role::firstOrCreate(['name' => 'moderator']);
        $moderatorRole->givePermissionTo($moderatorPermissions);

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
            'delete own comments'
        ];

        foreach ($userPermissions as $userPermission) {
            Permission::firstOrCreate(['name' => $userPermission]);
        }

        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->givePermissionTo($userPermissions);
    }
}
