<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Dashboard\DashboardController;
use App\Http\Controllers\Api\Dashboard\AppointmentController;
use App\Http\Controllers\Api\Dashboard\PatientController;
use App\Http\Controllers\Api\Dashboard\InventoryController;
use App\Http\Controllers\Api\Dashboard\InvoiceController;
use App\Http\Controllers\Api\Dashboard\SettingsController;
use App\Http\Controllers\Api\Mobile\DoctorController;
use App\Http\Controllers\Api\Mobile\PatientAppController;
use App\Http\Controllers\Api\Website\ClinicController;
use App\Http\Controllers\Api\Website\BookingController;
use App\Http\Controllers\Api\Website\ServiceController;
use App\Http\Controllers\Api\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentication Routes (Public)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });
});

// Dashboard Routes (Protected - Admin/Staff)
Route::prefix('dashboard')->middleware('auth:sanctum')->group(function () {
    // Dashboard Statistics
    Route::get('/statistics', [DashboardController::class, 'statistics']);
    
    // Appointments Management
    Route::apiResource('appointments', AppointmentController::class);
    Route::put('appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
    
    // Patients Management
    Route::apiResource('patients', PatientController::class);
    Route::get('patients/{id}/appointments', [PatientController::class, 'appointments']);
    Route::get('patients/{id}/invoices', [PatientController::class, 'invoices']);
    
    // Inventory Management
    Route::apiResource('inventory', InventoryController::class);
    Route::get('inventory/low-stock', [InventoryController::class, 'lowStock']);
    
    // Invoices Management
    Route::apiResource('invoices', InvoiceController::class);
    Route::put('invoices/{id}/status', [InvoiceController::class, 'updateStatus']);
    
    // Settings
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::put('/settings', [SettingsController::class, 'update']);
});

// Mobile App - Doctor Routes (Protected)
Route::prefix('mobile/doctor')->middleware('auth:sanctum')->group(function () {
    Route::get('/appointments', [DoctorController::class, 'appointments']);
    Route::get('/appointments/today', [DoctorController::class, 'todayAppointments']);
    Route::put('/appointments/{id}/status', [DoctorController::class, 'updateAppointmentStatus']);
    Route::get('/patients', [DoctorController::class, 'patients']);
    Route::get('/schedule', [DoctorController::class, 'schedule']);
    Route::put('/schedule', [DoctorController::class, 'updateSchedule']);
    Route::get('/statistics', [DoctorController::class, 'statistics']);
});

// Mobile App - Patient Routes (Protected)
Route::prefix('mobile/patient')->middleware('auth:sanctum')->group(function () {
    Route::get('/appointments', [PatientAppController::class, 'appointments']);
    Route::post('/appointments', [PatientAppController::class, 'createAppointment']);
    Route::put('/appointments/{id}/cancel', [PatientAppController::class, 'cancelAppointment']);
    Route::get('/clinics', [PatientAppController::class, 'clinics']);
    Route::get('/doctors', [PatientAppController::class, 'doctors']);
    Route::get('/services', [PatientAppController::class, 'services']);
    Route::get('/medical-records', [PatientAppController::class, 'medicalRecords']);
});

// Website Routes (Public)
Route::prefix('website')->group(function () {
    // Clinics
    Route::get('/clinics', [ClinicController::class, 'index']);
    Route::get('/clinics/{id}', [ClinicController::class, 'show']);
    Route::get('/clinics/{id}/services', [ClinicController::class, 'services']);
    Route::get('/clinics/{id}/doctors', [ClinicController::class, 'doctors']);
    
    // Services
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{id}', [ServiceController::class, 'show']);
    
    // Booking
    Route::post('/booking', [BookingController::class, 'create']);
    Route::get('/available-slots', [BookingController::class, 'availableSlots']);
});

// Notifications Routes (Protected)
Route::prefix('notifications')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);
    Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
    Route::put('/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/{id}', [NotificationController::class, 'destroy']);
    
    // Device token management
    Route::post('/register-device', [NotificationController::class, 'registerDevice']);
    Route::post('/unregister-device', [NotificationController::class, 'unregisterDevice']);
    
    // Test endpoint
    Route::post('/test', [NotificationController::class, 'sendTest']);
});

// File Management Routes (Protected)
Route::prefix('files')->middleware('auth:sanctum')->group(function () {
    Route::post('/upload', [\App\Http\Controllers\Api\FileController::class, 'upload']);
    Route::post('/delete', [\App\Http\Controllers\Api\FileController::class, 'delete']);
    Route::post('/url', [\App\Http\Controllers\Api\FileController::class, 'getUrl']);
});
