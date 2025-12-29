<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/dashboard/inventory",
     *     tags={"Dashboard - Inventory"},
     *     summary="Get inventory items",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="clinic_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="category", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Inventory list")
     * )
     */
    public function index(Request $request)
    {
        $query = Inventory::with('clinic');

        // Filter by clinic
        if ($request->has('clinic_id')) {
            $query->where('clinic_id', $request->clinic_id);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Search by name
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('item_name', 'like', "%{$search}%")
                  ->orWhere('item_name_ar', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        $items = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    /**
     * @OA\Post(
     *     path="/dashboard/inventory",
     *     tags={"Dashboard - Inventory"},
     *     summary="Create inventory item",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"clinic_id","item_name","quantity","unit_price","reorder_level"},
     *             @OA\Property(property="clinic_id", type="integer"),
     *             @OA\Property(property="item_name", type="string"),
     *             @OA\Property(property="quantity", type="integer"),
     *             @OA\Property(property="unit_price", type="number")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Item created")
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clinic_id' => 'required|exists:clinics,id',
            'item_name' => 'required|string|max:255',
            'item_name_ar' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'reorder_level' => 'required|integer|min:0',
            'expiry_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $item = Inventory::create($request->all());
        $item->load('clinic');

        return response()->json([
            'success' => true,
            'message' => 'Inventory item created successfully',
            'data' => $item
        ], 201);
    }

    /**
     * Display the specified inventory item
     */
    public function show($id)
    {
        $item = Inventory::with('clinic')->find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Inventory item not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $item
        ]);
    }

    /**
     * Update the specified inventory item
     */
    public function update(Request $request, $id)
    {
        $item = Inventory::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Inventory item not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'clinic_id' => 'sometimes|exists:clinics,id',
            'item_name' => 'sometimes|string|max:255',
            'item_name_ar' => 'sometimes|string|max:255',
            'category' => 'nullable|string|max:255',
            'quantity' => 'sometimes|integer|min:0',
            'unit_price' => 'sometimes|numeric|min:0',
            'reorder_level' => 'sometimes|integer|min:0',
            'expiry_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $item->update($request->all());
        $item->load('clinic');

        return response()->json([
            'success' => true,
            'message' => 'Inventory item updated successfully',
            'data' => $item
        ]);
    }

    /**
     * Remove the specified inventory item
     */
    public function destroy($id)
    {
        $item = Inventory::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Inventory item not found'
            ], 404);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Inventory item deleted successfully'
        ]);
    }

    /**
     * Get low stock items
     */
    public function lowStock(Request $request)
    {
        $items = Inventory::with('clinic')
            ->whereRaw('quantity <= reorder_level')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }
}
