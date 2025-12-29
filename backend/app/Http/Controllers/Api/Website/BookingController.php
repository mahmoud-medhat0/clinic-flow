<?php

namespace App\Http\Controllers\Api\Website;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class BookingController extends Controller
{
    /**
     * @OA\Post(
     *     path="/website/booking",
     *     tags={"Website"},
     *     summary="Book appointment (public/guest)",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"doctor_id","clinic_id","service_id","date","time"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="doctor_id", type="integer"),
     *             @OA\Property(property="clinic_id", type="integer"),
     *             @OA\Property(property="service_id", type="integer"),
     *             @OA\Property(property="date", type="string", format="date"),
     *             @OA\Property(property="time", type="string")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Booking created")
     * )
     */
    public function create(Request $request)
    {
        $request->validate([
            // Patient info (for new users)
            'name' => 'required_without:patient_id|string|max:255',
            'email' => 'required_without:patient_id|email',
            'phone' => 'required_without:patient_id|string|max:20',
            
            // Or existing patient
            'patient_id' => 'nullable|exists:patients,id',
            
            // Appointment info
            'doctor_id' => 'required|exists:doctors,id',
            'clinic_id' => 'required|exists:clinics,id',
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'notes' => 'nullable|string',
        ]);

        // Find or create patient
        if ($request->has('patient_id')) {
            $patient = Patient::findOrFail($request->patient_id);
        } else {
            // Check if user exists by email
            $user = User::where('email', $request->email)->first();
            
            if (!$user) {
                // Create new user
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'password' => Hash::make(str()->random(16)), // Random password
                    'role' => 'patient',
                ]);

                // Create patient profile
                $patient = Patient::create([
                    'user_id' => $user->id,
                ]);
            } else {
                // Get or create patient profile
                $patient = Patient::firstOrCreate(
                    ['user_id' => $user->id]
                );
            }
        }

        // Create appointment
        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $request->doctor_id,
            'clinic_id' => $request->clinic_id,
            'service_id' => $request->service_id,
            'date' => $request->date,
            'time' => $request->time,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        // Fire event
        event(new \App\Events\AppointmentCreated($appointment));

        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully. You will receive a confirmation email.',
            'data' => [
                'appointment_id' => $appointment->id,
                'patient_email' => $patient->user->email,
            ]
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/website/available-slots",
     *     tags={"Website"},
     *     summary="Get available time slots",
     *     @OA\Parameter(name="doctor_id", in="query", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="date", in="query", required=true, @OA\Schema(type="string", format="date")),
     *     @OA\Response(response=200, description="Available slots")
     * )
     */
    public function availableSlots(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'date' => 'required|date|after_or_equal:today',
        ]);

        $doctor = \App\Models\Doctor::findOrFail($request->doctor_id);

        // Get all appointments for this doctor on this date
        $bookedSlots = Appointment::where('doctor_id', $request->doctor_id)
            ->whereDate('date', $request->date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->pluck('time')
            ->toArray();

        // Generate available slots (9 AM to 5 PM, 30min intervals)
        $availableSlots = [];
        $startTime = $doctor->available_from ?? '09:00';
        $endTime = $doctor->available_to ?? '17:00';

        $current = \Carbon\Carbon::createFromFormat('H:i', $startTime);
        $end = \Carbon\Carbon::createFromFormat('H:i', $endTime);

        while ($current < $end) {
            $timeSlot = $current->format('H:i');
            
            if (!in_array($timeSlot, $bookedSlots)) {
                $availableSlots[] = $timeSlot;
            }

            $current->addMinutes(30);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $request->date,
                'doctor_id' => $request->doctor_id,
                'available_slots' => $availableSlots,
            ]
        ]);
    }
}
