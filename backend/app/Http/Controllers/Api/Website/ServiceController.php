<?php

namespace App\Http\Controllers\Api\Website;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Http\Resources\ServiceResource;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * @OA\Get(
     *     path="/website/services",
     *     tags={"Website"},
     *     summary="Get all services (public)",
     *     @OA\Parameter(name="clinic_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Services list")
     * )
     */
    public function index(Request $request)
    {
        $query = Service::where('is_active', true)->with('clinic');

        // Filter by clinic
        if ($request->has('clinic_id')) {
            $query->where('clinic_id', $request->clinic_id);
        }

        // Search by name
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('name_ar', 'like', "%{$search}%");
            });
        }

        $services = $query->paginate(20);

        return ServiceResource::collection($services);
    }

    /**
     * @OA\Get(
     *     path="/website/services/{id}",
     *     tags={"Website"},
     *     summary="Get service details",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Service details")
     * )
     */
    public function show($id)
    {
        $service = Service::where('is_active', true)
            ->with('clinic')
            ->findOrFail($id);

        return new ServiceResource($service);
    }
}
