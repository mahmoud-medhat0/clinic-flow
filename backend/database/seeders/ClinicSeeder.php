<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ClinicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinics = [
            [
                'name' => 'Hope Medical Center',
                'name_ar' => 'مركز الأمل الطبي',
                'description' => 'A comprehensive medical center offering various healthcare services.',
                'description_ar' => 'مركز طبي شامل يقدم خدمات صحية متنوعة.',
                'address' => '123 Main Street, Cairo',
                'phone' => '+20212345678',
                'email' => 'info@hopemedical.com',
                'services' => [
                    ['name' => 'General Checkup', 'name_ar' => 'فحص عام', 'price' => 200, 'duration' => 30],
                    ['name' => 'Blood Test', 'name_ar' => 'تحليل دم', 'price' => 150, 'duration' => 15],
                    ['name' => 'X-Ray', 'name_ar' => 'أشعة سينية', 'price' => 300, 'duration' => 20],
                ]
            ],
            [
                'name' => 'Care Plus Clinic',
                'name_ar' => 'عيادة كير بلس',
                'description' => 'Specialized clinic for dental and cosmetic procedures.',
                'description_ar' => 'عيادة متخصصة في الأسنان والتجميل.',
                'address' => '456 Health Ave, Giza',
                'phone' => '+20233456789',
                'email' => 'contact@careplus.com',
                'services' => [
                    ['name' => 'Dental Cleaning', 'name_ar' => 'تنظيف الأسنان', 'price' => 400, 'duration' => 45],
                    ['name' => 'Teeth Whitening', 'name_ar' => 'تبييض الأسنان', 'price' => 800, 'duration' => 60],
                ]
            ],
        ];

        foreach ($clinics as $clinicData) {
            $services = $clinicData['services'];
            unset($clinicData['services']);

            $clinic = Clinic::create($clinicData);

            foreach ($services as $serviceData) {
                Service::create([
                    'clinic_id' => $clinic->id,
                    'name' => $serviceData['name'],
                    'name_ar' => $serviceData['name_ar'],
                    'description' => 'Professional ' . $serviceData['name'] . ' service',
                    'description_ar' => 'خدمة ' . $serviceData['name_ar'] . ' احترافية',
                    'price' => $serviceData['price'],
                    'duration_minutes' => $serviceData['duration'],
                    'is_active' => true,
                ]);
            }
        }

        $this->command->info('Clinics and services seeded successfully!');
    }
}
