<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Clinic;
use App\Models\Doctor;
use App\Models\Service;
use App\Http\Resources\AppointmentResource;
use App\Http\Resources\ClinicResource;
use App\Http\Resources\DoctorResource;
use App\Http\Resources\ServiceResource;
use Illuminate\Http\Request;

class PatientAppController extends Controller
{
    /**
     * @OA\Get(
     *     path="/mobile/patient/appointments",
     *     tags={"Mobile - Patient"},
     *     summary="Get patient's appointments",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="status", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Appointments list")
     * )
     */
    public function appointments(Request $request)
    {
        $patient = Patient::where('user_id', $request->user()->id)->firstOrFail();

        $query = Appointment::where('patient_id', $patient->id)
            ->with(['doctor.user', 'clinic', 'service']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $appointments = $query->orderBy('date', 'desc')->orderBy('time')->paginate(20);

        return AppointmentResource::collection($appointments);
    }

    /**
     * @OA\Post(
     *     path="/mobile/patient/appointments",
     *     tags={"Mobile - Patient"},
     *     summary="Book new appointment",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"doctor_id","clinic_id","service_id","date","time"},
     *             @OA\Property(property="doctor_id", type="integer"),
     *             @OA\Property(property="clinic_id", type="integer"),
     *             @OA\Property(property="service_id", type="integer"),
     *             @OA\Property(property="date", type="string", format="date"),
     *             @OA\Property(property="time", type="string")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Appointment booked")
     * )
     */
    public function createAppointment(Request $request)
    {
        $patient = Patient::where('user_id', $request->user()->id)->firstOrFail();

        $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'clinic_id' => 'required|exists:clinics,id',
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'notes' => 'nullable|string',
        ]);

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
            'message' => 'Appointment created successfully',
            'data' => new AppointmentResource($appointment->load(['doctor.user', 'clinic', 'service']))
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/mobile/patient/appointments/{id}/cancel",
     *     tags={"Mobile - Patient"},
     *     summary="Cancel appointment",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"cancellation_reason"},
     *             @OA\Property(property="cancellation_reason", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Appointment cancelled")
     * )
     */
    public function cancelAppointment(Request $request, $id)
    {
        $patient = Patient::where('user_id', $request->user()->id)->firstOrFail();

        $appointment = Appointment::where('id', $id)
            ->where('patient_id', $patient->id)
            ->firstOrFail();

        if (!$appointment->can_be_cancelled) {
            return response()->json([
                'success' => false,
                'message' => 'This appointment cannot be cancelled'
            ], 400);
        }

        $request->validate([
            'cancellation_reason' => 'required|string',
        ]);

        $oldStatus = $appointment->status;
        $appointment->update([
            'status' => 'cancelled',
            'cancellation_reason' => $request->cancellation_reason,
        ]);

        // Fire event
        event(new \App\Events\AppointmentStatusChanged($appointment, $oldStatus, 'cancelled'));

        return response()->json([
            'success' => true,
            'message' => 'Appointment cancelled successfully'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/mobile/patient/clinics",
     *     tags={"Mobile - Patient"},
     *     summary="Get available clinics",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Clinics list")
     * )
     */
    public function clinics(Request $request)
    {
        $clinics = Clinic::where('is_active', true)
            ->with('services')
            ->get();

        return ClinicResource::collection($clinics);
    }

    /**
     * @OA\Get(
     *     path="/mobile/patient/doctors",
     *     tags={"Mobile - Patient"},
     *     summary="Get available doctors",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="specialization", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Doctors list")
     * )
     */
    public function doctors(Request $request)
    {
        $query = Doctor::with('user');

        // Filter by specialization
        if ($request->has('specialization')) {
            $query->where('specialization', $request->specialization);
        }

        $doctors = $query->get();

        return DoctorResource::collection($doctors);
    }

    /**
     * @OA\Get(
     *     path="/mobile/patient/services",
     *     tags={"Mobile - Patient"},
     *     summary="Get available services",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="clinic_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Services list")
     * )
     */
    public function services(Request $request)
    {
        $query = Service::where('is_active', true)->with('clinic');

        // Filter by clinic
        if ($request->has('clinic_id')) {
            $query->where('clinic_id', $request->clinic_id);
        }

        $services = $query->get();

        return ServiceResource::collection($services);
    }

    /**
     * @OA\Get(
     *     path="/mobile/patient/medical-records",
     *     tags={"Mobile - Patient"},
     *     summary="Get patient's medical records",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Medical records")
     * )
     */
    public function medicalRecords(Request $request)
    {
        $patient = Patient::where('user_id', $request->user()->id)->firstOrFail();

        $appointments = Appointment::where('patient_id', $patient->id)
            ->where('status', 'completed')
            ->with(['doctor.user', 'clinic', 'service'])
            ->orderBy('date', 'desc')
            ->get();

        return AppointmentResource::collection($appointments);
    }
}
