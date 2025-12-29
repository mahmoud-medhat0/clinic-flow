<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Clinic;
use App\Models\Service;
use App\Models\Appointment;
use App\Events\AppointmentCreated;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class AppointmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create necessary test data
        $this->patient = Patient::factory()->create();
        $this->doctor = Doctor::factory()->create();
        $this->clinic = Clinic::factory()->create(['is_active' => true]);
        $this->service = Service::factory()->create([
            'clinic_id' => $this->clinic->id,
            'is_active' => true
        ]);
    }

    public function test_patient_can_create_appointment()
    {
        Event::fake();

        $user = $this->patient->user;
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/mobile/patient/appointments', [
            'doctor_id' => $this->doctor->id,
            'clinic_id' => $this->clinic->id,
            'service_id' => $this->service->id,
            'date' => now()->addDays(1)->format('Y-m-d'),
            'time' => '10:00',
            'notes' => 'Test appointment'
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data'
                 ]);

        $this->assertDatabaseHas('appointments', [
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctor->id
        ]);

        Event::assertDispatched(AppointmentCreated::class);
    }

    public function test_patient_can_view_their_appointments()
    {
        Appointment::factory()->create([
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctor->id,
            'clinic_id' => $this->clinic->id,
            'service_id' => $this->service->id
        ]);

        $user = $this->patient->user;
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/mobile/patient/appointments');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data'
                 ]);
    }

    public function test_patient_can_cancel_appointment()
    {
        $appointment = Appointment::factory()->create([
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctor->id,
            'clinic_id' => $this->clinic->id,
            'service_id' => $this->service->id,
            'status' => 'pending',
            'date' => now()->addDays(2)
        ]);

        $user = $this->patient->user;
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->putJson("/api/mobile/patient/appointments/{$appointment->id}/cancel", [
            'cancellation_reason' => 'Emergency'
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'cancelled'
        ]);
    }

    public function test_doctor_can_update_appointment_status()
    {
        $appointment = Appointment::factory()->create([
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctor->id,
            'clinic_id' => $this->clinic->id,
            'service_id' => $this->service->id,
            'status' => 'pending'
        ]);

        $user = $this->doctor->user;
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->putJson("/api/mobile/doctor/appointments/{$appointment->id}/status", [
            'status' => 'confirmed'
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'confirmed'
        ]);
    }
}
