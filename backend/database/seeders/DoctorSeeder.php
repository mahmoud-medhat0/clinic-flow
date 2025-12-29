<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Doctor;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $doctors = [
            [
                'name' => 'Dr. Ahmed Hassan',
                'email' => 'ahmed@clinicflow.com',
                'phone' => '+201234567892',
                'specialization' => 'Cardiology',
                'license_number' => 'DOC-001',
                'bio' => 'Experienced cardiologist with 10 years of practice.',
                'years_of_experience' => 10,
                'consultation_fee' => 500.00,
                'available_from' => '09:00',
                'available_to' => '17:00',
            ],
            [
                'name' => 'Dr. Fatima Mohamed',
                'email' => 'fatima@clinicflow.com',
                'phone' => '+201234567893',
                'specialization' => 'Pediatrics',
                'license_number' => 'DOC-002',
                'bio' => 'Specialist in children healthcare.',
                'years_of_experience' => 8,
                'consultation_fee' => 400.00,
                'available_from' => '10:00',
                'available_to' => '16:00',
            ],
            [
                'name' => 'Dr. Omar Ali',
                'email' => 'omar@clinicflow.com',
                'phone' => '+201234567894',
                'specialization' => 'Orthopedics',
                'license_number' => 'DOC-003',
                'bio' => 'Expert in bone and joint treatments.',
                'years_of_experience' => 12,
                'consultation_fee' => 600.00,
                'available_from' => '08:00',
                'available_to' => '15:00',
            ],
        ];

        foreach ($doctors as $doctorData) {
            $user = User::create([
                'name' => $doctorData['name'],
                'email' => $doctorData['email'],
                'phone' => $doctorData['phone'],
                'password' => bcrypt('password'),
                'role' => 'doctor',
                'email_verified_at' => now(),
            ]);

            Doctor::create([
                'user_id' => $user->id,
                'specialization' => $doctorData['specialization'],
                'license_number' => $doctorData['license_number'],
                'bio' => $doctorData['bio'],
                'years_of_experience' => $doctorData['years_of_experience'],
                'consultation_fee' => $doctorData['consultation_fee'],
                'available_from' => $doctorData['available_from'],
                'available_to' => $doctorData['available_to'],
            ]);
        }

        $this->command->info('Doctors seeded successfully!');
    }
}
