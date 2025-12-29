<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Http\Resources\AppointmentResource;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    /**
     * @OA\Get(
     *     path="/mobile/doctor/appointments",
     *     tags={"Mobile - Doctor"},
     *     summary="Get doctor's appointments",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="status", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Response(response=200, description="Appointments list")
     * )
     */
    public function appointments(Request $request)
    {
        $doctor = Doctor::where('user_id', $request->user()->id)->firstOrFail();

        $query = Appointment::where('doctor_id', $doctor->id)
            ->with(['patient.user', 'clinic', 'service']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date
        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        $appointments = $query->orderBy('date')->orderBy('time')->paginate(20);

        return AppointmentResource::collection($appointments);
    }

    /**
     * @OA\Get(
     *     path="/mobile/doctor/appointments/today",
     *     tags={"Mobile - Doctor"},
     *     summary="Get today's appointments",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Today's appointments")
     * )
     */
    public function todayAppointments(Request $request)
    {
        $doctor = Doctor::where('user_id', $request->user()->id)->firstOrFail();

        $appointments = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('date', today())
            ->with(['patient.user', 'clinic', 'service'])
            ->orderBy('time')
            ->get();

        return AppointmentResource::collection($appointments);
    }

    /**
     * @OA\Put(
     *     path="/mobile/doctor/appointments/{id}/status",
     *     tags={"Mobile - Doctor"},
     *     summary="Update appointment status",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"confirmed","completed","cancelled"}),
     *             @OA\Property(property="notes", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Status updated")
     * )
     */
    public function updateAppointmentStatus(Request $request, $id)
    {
        $doctor = Doctor::where('user_id', $request->user()->id)->firstOrFail();

        $appointment = Appointment::where('id', $id)
            ->where('doctor_id', $doctor->id)
            ->firstOrFail();

        $request->validate([
            'status' => 'required|in:confirmed,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $oldStatus = $appointment->status;
        $appointment->update([
            'status' => $request->status,
            'notes' => $request->notes ?? $appointment->notes,
        ]);

        // Fire event
        event(new \App\Events\AppointmentStatusChanged($appointment, $oldStatus, $request->status));

        return response()->json([
            'success' => true,
            'message' => 'Appointment status updated',
            'data' => new AppointmentResource($appointment)
        ]);
    }

    /**
     * @OA\Get(
     *     path="/mobile/doctor/patients",
     *     tags={"Mobile - Doctor"},
     *     summary="Get doctor's patients",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Patients list")
     * )
     */
    public function patients(Request $request)
    {
        $doctor = Doctor::where('user_id', $request->user()->id)->firstOrFail();

        $patientIds = Appointment::where('doctor_id', $doctor->id)
            ->distinct()
            ->pluck('patient_id');

        $patients = Patient::whereIn('id', $patientIds)
            ->with('user')
            ->paginate(20);

        return \App\Http\Resources\PatientResource::collection($patients);
    }

    /**
     * @OA\Get(
     *     path="/mobile/doctor/schedule",
     *     tags={"Mobile - Doctor"},
     *     summary="Get doctor schedule",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Doctor schedule")
     * )
     */
    public function schedule(Request $request)
    {
        $doctor = Doctor::where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'available_from' => $doctor->available_from,
                'available_to' => $doctor->available_to,
                'is_available' => $doctor->is_available,
            ]
        ]);
    }

    /**
     * @OA\Put(
     *     path="/mobile/doctor/schedule",
     *     tags={"Mobile - Doctor"},
     *     summary="Update doctor schedule",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"available_from","available_to"},
     *             @OA\Property(property="available_from", type="string", format="time", example="09:00"),
     *             @OA\Property(property="available_to", type="string", format="time", example="17:00")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Schedule updated")
     * )
     */
    public function updateSchedule(Request $request)
    {
        $doctor = Doctor::where('user_id', $request->user()->id)
            ->firstOrFail();

        $request->validate([
            'available_from' => 'required|date_format:H:i',
            'available_to' => 'required|date_format:H:i|after:available_from',
        ]);

        $doctor->update([
            'available_from' => $request->available_from,
            'available_to' => $request->available_to,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Schedule updated successfully',
            'data' => [
                'available_from' => $doctor->available_from,
                'available_to' => $doctor->available_to,
            ]
        ]);
    }

    /**
     * @OA\Get(
     *     path="/mobile/doctor/statistics",
     *     tags={"Mobile - Doctor"},
     *     summary="Get doctor statistics",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Doctor statistics")
     * )
     */
    public function statistics(Request $request)
    {
        $doctor = Doctor::where('user_id', $request->user()->id)->firstOrFail();

        $totalAppointments = Appointment::where('doctor_id', $doctor->id)->count();
        $todayAppointments = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('date', today())
            ->count();
        $upcomingAppointments = Appointment::where('doctor_id', $doctor->id)
            ->where('status', 'confirmed')
            ->where('date', '>=', today())
            ->count();
        $completedAppointments = Appointment::where('doctor_id', $doctor->id)
            ->where('status', 'completed')
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_appointments' => $totalAppointments,
                'today_appointments' => $todayAppointments,
                'upcoming_appointments' => $upcomingAppointments,
                'completed_appointments' => $completedAppointments,
            ]
        ]);
    }
}
