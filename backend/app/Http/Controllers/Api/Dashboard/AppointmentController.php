<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    /**
     * @OA\Get(
     *     path="/dashboard/appointments",
     *     tags={"Dashboard - Appointments"},
     *     summary="Get appointments list",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="status", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15)),
     *     @OA\Response(response=200, description="Appointments list")
     * )
     */
    public function index(Request $request)
    {
        $query = Appointment::with(['patient.user', 'doctor.user', 'clinic', 'service']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        // Filter by doctor
        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->doctor_id);
        }

        // Filter by patient
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        // Filter by clinic
        if ($request->has('clinic_id')) {
            $query->where('clinic_id', $request->clinic_id);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $appointments = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    /**
     * @OA\Post(
     *     path="/dashboard/appointments",
     *     tags={"Dashboard - Appointments"},
     *     summary="Create new appointment",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"patient_id","doctor_id","clinic_id","service_id","date","time"},
     *             @OA\Property(property="patient_id", type="integer"),
     *             @OA\Property(property="doctor_id", type="integer"),
     *             @OA\Property(property="clinic_id", type="integer"),
     *             @OA\Property(property="service_id", type="integer"),
     *             @OA\Property(property="date", type="string", format="date"),
     *             @OA\Property(property="time", type="string"),
     *             @OA\Property(property="notes", type="string")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Appointment created")
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'clinic_id' => 'required|exists:clinics,id',
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment = Appointment::create($request->all());
        $appointment->load(['patient.user', 'doctor.user', 'clinic', 'service']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment created successfully',
            'data' => $appointment
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/dashboard/appointments/{id}",
     *     tags={"Dashboard - Appointments"},
     *     summary="Get appointment details",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Appointment details"),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function show($id)
    {
        $appointment = Appointment::with(['patient.user', 'doctor.user', 'clinic', 'service'])
            ->find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $appointment
        ]);
    }

    /**
     * @OA\Put(
     *     path="/dashboard/appointments/{id}",
     *     tags={"Dashboard - Appointments"},
     *     summary="Update appointment",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(@OA\JsonContent(
     *         @OA\Property(property="date", type="string", format="date"),
     *         @OA\Property(property="time", type="string"),
     *         @OA\Property(property="status", type="string")
     *     )),
     *     @OA\Response(response=200, description="Appointment updated")
     * )
     */
    public function update(Request $request, $id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'patient_id' => 'sometimes|exists:patients,id',
            'doctor_id' => 'sometimes|exists:doctors,id',
            'clinic_id' => 'sometimes|exists:clinics,id',
            'service_id' => 'sometimes|exists:services,id',
            'date' => 'sometimes|date',
            'time' => 'sometimes|date_format:H:i',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
            'notes' => 'nullable|string',
            'cancellation_reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment->update($request->all());
        $appointment->load(['patient.user', 'doctor.user', 'clinic', 'service']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment updated successfully',
            'data' => $appointment
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/dashboard/appointments/{id}",
     *     tags={"Dashboard - Appointments"},
     *     summary="Delete appointment",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Appointment deleted")
     * )
     */
    public function destroy($id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        $appointment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Appointment deleted successfully'
        ]);
    }

    /**
     * @OA\Put(
     *     path="/dashboard/appointments/{id}/status",
     *     tags={"Dashboard - Appointments"},
     *     summary="Update appointment status",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"pending","confirmed","cancelled","completed"}),
     *             @OA\Property(property="cancellation_reason", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Status updated")
     * )
     */
    public function updateStatus(Request $request, $id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Appointment not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'cancellation_reason' => 'required_if:status,cancelled|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment->update([
            'status' => $request->status,
            'cancellation_reason' => $request->cancellation_reason ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Appointment status updated successfully',
            'data' => $appointment
        ]);
    }
}
