<?php

namespace App\Http\Controllers\Api\Website;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Http\Resources\ClinicResource;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\DoctorResource;
use Illuminate\Http\Request;

class ClinicController extends Controller
{
    /**
     * @OA\Get(
     *     path="/website/clinics",
     *     tags={"Website"},
     *     summary="Get all clinics (public)",
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Clinics list")
     * )
     */
    public function index(Request $request)
    {
        $query = Clinic::where('is_active', true);

        // Search by name
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('name_ar', 'like', "%{$search}%");
            });
        }

        $clinics = $query->with('services')->paginate(12);

        return ClinicResource::collection($clinics);
    }

    /**
     * @OA\Get(
     *     path="/website/clinics/{id}",
     *     tags={"Website"},
     *     summary="Get clinic details",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Clinic details")
     * )
     */
    public function show($id)
    {
        $clinic = Clinic::where('is_active', true)
            ->with('services')
            ->findOrFail($id);

        return new ClinicResource($clinic);
    }

    /**
     * @OA\Get(
     *     path="/website/clinics/{id}/services",
     *     tags={"Website"},
     *     summary="Get clinic services",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Services list")
     * )
     */
    public function services($id)
    {
        $clinic = Clinic::where('is_active', true)->findOrFail($id);

        $services = $clinic->services()
            ->where('is_active', true)
            ->get();

        return ServiceResource::collection($services);
    }

    /**
     * @OA\Get(
     *     path="/website/clinics/{id}/doctors",
     *     tags={"Website"},
     *     summary="Get clinic doctors",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Doctors list")
     * )
     */
    public function doctors($id)
    {
        $clinic = Clinic::where('is_active', true)->findOrFail($id);

        // Get doctors who have appointments in this clinic
        $doctorIds = \App\Models\Appointment::where('clinic_id', $clinic->id)
            ->distinct()
            ->pluck('doctor_id');

        $doctors = \App\Models\Doctor::whereIn('id', $doctorIds)
            ->with('user')
            ->get();

        return DoctorResource::collection($doctors);
    }
}
