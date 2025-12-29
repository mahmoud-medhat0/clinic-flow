<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InvoiceController extends Controller
{
    /**
     * @OA\Get(
     *     path="/dashboard/invoices",
     *     tags={"Dashboard - Invoices"},
     *     summary="Get invoices list",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="status", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="patient_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Invoices list")
     * )
     */
    public function index(Request $request)
    {
        $query = Invoice::with(['patient.user', 'appointment']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by patient
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        $perPage = $request->get('per_page', 15);
        $invoices = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $invoices
        ]);
    }

    /**
     * @OA\Post(
     *     path="/dashboard/invoices",
     *     tags={"Dashboard - Invoices"},
     *     summary="Create invoice",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"patient_id","total_amount","paid_amount","status"},
     *             @OA\Property(property="patient_id", type="integer"),
     *             @OA\Property(property="total_amount", type="number"),
     *             @OA\Property(property="paid_amount", type="number"),
     *             @OA\Property(property="status", type="string")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Invoice created")
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'total_amount' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,cancelled',
            'payment_method' => 'nullable|in:cash,card,online',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Generate unique invoice number
        $invoiceNumber = 'INV-' . date('Ymd') . '-' . str_pad(Invoice::count() + 1, 5, '0', STR_PAD_LEFT);

        $invoice = Invoice::create(array_merge($request->all(), [
            'invoice_number' => $invoiceNumber
        ]));

        $invoice->load(['patient.user', 'appointment']);

        return response()->json([
            'success' => true,
            'message' => 'Invoice created successfully',
            'data' => $invoice
        ], 201);
    }

    /**
     * Display the specified invoice
     */
    public function show($id)
    {
        $invoice = Invoice::with(['patient.user', 'appointment'])->find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $invoice
        ]);
    }

    /**
     * Update the specified invoice
     */
    public function update(Request $request, $id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'patient_id' => 'sometimes|exists:patients,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'total_amount' => 'sometimes|numeric|min:0',
            'paid_amount' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:pending,paid,cancelled',
            'payment_method' => 'nullable|in:cash,card,online',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $invoice->update($request->except('invoice_number'));
        $invoice->load(['patient.user', 'appointment']);

        return response()->json([
            'success' => true,
            'message' => 'Invoice updated successfully',
            'data' => $invoice
        ]);
    }

    /**
     * Remove the specified invoice
     */
    public function destroy($id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice not found'
            ], 404);
        }

        $invoice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Invoice deleted successfully'
        ]);
    }

    /**
     * Update invoice status
     */
    public function updateStatus(Request $request, $id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,paid,cancelled',
            'paid_amount' => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $invoice->update($request->only(['status', 'paid_amount']));

        return response()->json([
            'success' => true,
            'message' => 'Invoice status updated successfully',
            'data' => $invoice
        ]);
    }
}
