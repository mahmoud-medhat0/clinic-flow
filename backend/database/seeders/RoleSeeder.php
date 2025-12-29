<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@clinicflow.com',
            'phone' => '+201234567890',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create Staff User
        User::create([
            'name' => 'Staff Member',
            'email' => 'staff@clinicflow.com',
            'phone' => '+201234567891',
            'password' => bcrypt('password'),
            'role' => 'staff',
            'email_verified_at' => now(),
        ]);

        $this->command->info('Roles seeded successfully!');
    }
}
