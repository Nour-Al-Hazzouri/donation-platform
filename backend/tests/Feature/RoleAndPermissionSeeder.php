<?php

namespace Tests\Feature;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()['cache']->forget('spatie.permission.cache');

        // Create permissions
        $permissions = [
            // User permissions
            'view users',
            'create users',
            'edit users',
            'delete users',
            'promote users',
            
            // Donation Event permissions
            'view donation_events',
            'create donation_events',
            'edit donation_events',
            'edit own donation_events',
            'delete donation_events',
            'delete own donation_events',
            'manage donation_events',
            
            // Donation Transaction permissions
            'view donation_transactions',
            'view own donation_transactions',
            'create donation_transactions',
            'view own donation_transactions',
            'edit donation_transactions',
            'edit own donation_transactions',
            'delete donation_transactions',
            'delete own donation_transactions',
            'manage donation_transactions',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign existing permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Create user role with limited permissions
        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userPermissions = [
            'view donation_events',
            'create donation_events',
            'edit own donation_events',
            'delete own donation_events',
            'view donation_transactions',
            'view own donation_transactions',
            'create donation_transactions',
            'edit own donation_transactions',
            'delete own donation_transactions',
        ];
        $userRole->givePermissionTo($userPermissions);
    }
}
