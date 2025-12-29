<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Invoice;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * @OA\Get(
     *     path="/dashboard/statistics",
     *     tags={"Dashboard"},
     *     summary="Get dashboard statistics",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Statistics data",
     *         @OA\JsonContent(
     *             @OA\Property(property="total_patients", type="integer"),
     *             @OA\Property(property="total_doctors", type="integer"),
     *             @OA\Property(property="total_appointments", type="integer"),
     *             @OA\Property(property="pending_appointments", type="integer")
     *         )
     *     )
     * )
     */
    public function statistics(Request $request)
    {
        // Total counts
        $totalPatients = Patient::count();
        $totalDoctors = Doctor::count();
        $totalAppointments = Appointment::count();
        
        // Appointments by status
        $appointmentsByStatus = Appointment::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        // Today's appointments
        $todayAppointments = Appointment::whereDate('date', today())->count();
        
        // Upcoming appointments (next 7 days)
        $upcomingAppointments = Appointment::whereBetween('date', [
            today(),
            today()->addDays(7)
        ])->count();

        // Revenue statistics
        $totalRevenue = Invoice::where('status', 'paid')->sum('total_amount');
        $pendingRevenue = Invoice::where('status', 'pending')->sum('total_amount');
        
        // Monthly revenue (current month)
        $monthlyRevenue = Invoice::where('status', 'paid')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_amount');

        // Low stock items
        $lowStockCount = Inventory::whereRaw('quantity <= reorder_level')->count();

        // Recent appointments (last 5)
        $recentAppointments = Appointment::with(['patient.user', 'doctor.user', 'service'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'totals' => [
                    'patients' => $totalPatients,
                    'doctors' => $totalDoctors,
                    'appointments' => $totalAppointments,
                ],
                'appointments' => [
                    'today' => $todayAppointments,
                    'upcoming' => $upcomingAppointments,
                    'by_status' => $appointmentsByStatus,
                ],
                'revenue' => [
                    'total' => $totalRevenue,
                    'pending' => $pendingRevenue,
                    'monthly' => $monthlyRevenue,
                ],
                'inventory' => [
                    'low_stock_count' => $lowStockCount,
                ],
                'recent_appointments' => $recentAppointments,
            ]
        ]);
    }
}
