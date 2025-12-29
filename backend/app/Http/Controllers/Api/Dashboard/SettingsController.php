<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/dashboard/settings",
     *     tags={"Dashboard - Settings"},
     *     summary="Get application settings",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Settings data")
     * )
     */
    public function index()
    {
        // For now, returning cached/static settings
        // In production, these would be stored in a settings table
        $settings = Cache::remember('app_settings', 3600, function () {
            return [
                'clinic_name' => env('APP_NAME', 'ClinicFlow'),
                'clinic_name_ar' => 'عيادة فلو',
                'timezone' => env('APP_TIMEZONE', 'UTC'),
                'date_format' => 'Y-m-d',
                'time_format' => 'H:i',
                'currency' => 'USD',
                'currency_symbol' => '$',
                'appointment_duration' => 30, // minutes
                'working_hours' => [
                    'start' => '09:00',
                    'end' => '17:00',
                ],
                'notifications' => [
                    'email_enabled' => true,
                    'sms_enabled' => false,
                    'push_enabled' => true,
                    'whatsapp_enabled' => env('WA_API_TOKEN') ? true : false,
                ],
                'whatsapp' => [
                    'enabled' => env('WA_API_TOKEN') ? true : false,
                    'api_endpoint' => env('WA_API_ENDPOINT', ''),
                    'api_token' => env('WA_API_TOKEN') ? '***' : '', // Hidden for security
                ],
                'appointment_reminders' => [
                    'enabled' => true,
                    'hours_before' => 24,
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * @OA\Put(
     *     path="/dashboard/settings",
     *     tags={"Dashboard - Settings"},
     *     summary="Update settings",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="clinic_name", type="string"),
     *             @OA\Property(property="timezone", type="string"),
     *             @OA\Property(property="currency", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Settings updated")
     * )
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clinic_name' => 'sometimes|string|max:255',
            'clinic_name_ar' => 'sometimes|string|max:255',
            'timezone' => 'sometimes|string',
            'currency' => 'sometimes|string|max:10',
            'currency_symbol' => 'sometimes|string|max:5',
            'appointment_duration' => 'sometimes|integer|min:15',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // In production, save to database
        // For now, update cache
        $currentSettings = Cache::get('app_settings', []);
        $updatedSettings = array_merge($currentSettings, $request->all());
        
        Cache::put('app_settings', $updatedSettings, 3600);

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
            'data' => $updatedSettings
        ]);
    }
}
