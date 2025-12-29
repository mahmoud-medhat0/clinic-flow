<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    /**
     * @OA\Get(
     *     path="/dashboard/patients",
     *     tags={"Dashboard - Patients"},
     *     summary="Get patients list",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="gender", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Patients list")
     * )
     */
    public function index(Request $request)
    {
        $query = Patient::with('user');

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by gender
        if ($request->has('gender')) {
            $query->where('gender', $request->gender);
        }

        $perPage = $request->get('per_page', 15);
        $patients = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $patients
        ]);
    }

    /**
     * @OA\Post(
     *     path="/dashboard/patients",
     *     tags={"Dashboard - Patients"},
     *     summary="Create new patient",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="phone", type="string"),
     *             @OA\Property(property="gender", type="string")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Patient created")
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'blood_type' => 'nullable|string|max:5',
            'allergies' => 'nullable|string',
            'chronic_diseases' => 'nullable|string',
            'emergency_contact' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'patient',
        ]);

        // Create patient profile
        $patient = Patient::create([
            'user_id' => $user->id,
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'blood_type' => $request->blood_type,
            'allergies' => $request->allergies,
            'chronic_diseases' => $request->chronic_diseases,
            'emergency_contact' => $request->emergency_contact,
        ]);

        $patient->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Patient created successfully',
            'data' => $patient
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/dashboard/patients/{id}",
     *     tags={"Dashboard - Patients"},
     *     summary="Get patient details",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Patient details"),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function show($id)
    {
        $patient = Patient::with('user')->find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $patient
        ]);
    }

    /**
     * @OA\Put(
     *     path="/dashboard/patients/{id}",
     *     tags={"Dashboard - Patients"},
     *     summary="Update patient",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Patient updated")
     * )
     */
    public function update(Request $request, $id)
    {
        $patient = Patient::with('user')->find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $patient->user_id,
            'phone' => 'sometimes|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'blood_type' => 'nullable|string|max:5',
            'allergies' => 'nullable|string',
            'chronic_diseases' => 'nullable|string',
            'emergency_contact' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Update user
        if ($request->has('name') || $request->has('email') || $request->has('phone')) {
            $patient->user->update($request->only(['name', 'email', 'phone']));
        }

        // Update patient profile
        $patient->update($request->except(['name', 'email', 'phone', 'password']));

        return response()->json([
            'success' => true,
            'message' => 'Patient updated successfully',
            'data' => $patient
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/dashboard/patients/{id}",
     *     tags={"Dashboard - Patients"},
     *     summary="Delete patient",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Patient deleted")
     * )
     */
    public function destroy($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        // Delete user (will cascade delete patient due to foreign key)
        $patient->user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Patient deleted successfully'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/dashboard/patients/{id}/appointments",
     *     tags={"Dashboard - Patients"},
     *     summary="Get patient appointments",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Patient appointments")
     * )
     */
    public function appointments($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        $appointments = $patient->appointments()
            ->with(['doctor.user', 'clinic', 'service'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    /**
     * @OA\Get(
     *     path="/dashboard/patients/{id}/invoices",
     *     tags={"Dashboard - Patients"},
     *     summary="Get patient invoices",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Patient invoices")
     * )
     */
    public function invoices($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient not found'
            ], 404);
        }

        $invoices = $patient->invoices()
            ->with('appointment')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $invoices
        ]);
    }
}
