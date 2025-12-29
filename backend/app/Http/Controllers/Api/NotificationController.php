<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\DeviceToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    /**
     * @OA\Get(
     *     path="/notifications",
     *     tags={"Notifications"},
     *     summary="Get user notifications",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="type", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="is_read", in="query", @OA\Schema(type="boolean")),
     *     @OA\Response(response=200, description="Notifications list")
     * )
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Notification::where('user_id', $user->id);

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by read status
        if ($request->has('is_read')) {
            $query->where('is_read', $request->is_read);
        }

        $perPage = $request->get('per_page', 20);
        $notifications = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $notifications,
            'unread_count' => Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->count(),
        ]);
    }

    /**
     * @OA\Put(
     *     path="/notifications/{id}/read",
     *     tags={"Notifications"},
     *     summary="Mark notification as read",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Marked as read")
     * )
     */
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();
        
        $notification = Notification::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found'
            ], 404);
        }

        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
            'data' => $notification
        ]);
    }

    /**
     * @OA\Put(
     *     path="/notifications/mark-all-read",
     *     tags={"Notifications"},
     *     summary="Mark all notifications as read",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="All marked as read")
     * )
     */
    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read'
        ]);
    }

    /**
     * Delete a notification
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        
        $notification = Notification::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found'
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted successfully'
        ]);
    }

    /**
     * Get unread notifications count
     */
    public function unreadCount(Request $request)
    {
        $user = $request->user();

        $count = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'unread_count' => $count
        ]);
    }

    /**
     * Register device token for push notifications
     */
    public function registerDevice(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'device_type' => 'required|in:mobile,web',
            'platform' => 'nullable|in:ios,android,web',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Deactivate old tokens for this device
        DeviceToken::where('user_id', $user->id)
            ->where('token', $request->token)
            ->update(['is_active' => false]);

        // Create or update device token
        $deviceToken = DeviceToken::updateOrCreate(
            [
                'user_id' => $user->id,
                'token' => $request->token,
            ],
            [
                'device_type' => $request->device_type,
                'platform' => $request->platform,
                'is_active' => true,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Device token registered successfully',
            'data' => $deviceToken
        ]);
    }

    /**
     * Unregister device token
     */
    public function unregisterDevice(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DeviceToken::where('user_id', $user->id)
            ->where('token', $request->token)
            ->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Device token unregistered successfully'
        ]);
    }

    /**
     * Send a test notification (for testing purposes)
     */
    public function sendTest(Request $request)
    {
        $user = $request->user();

        $notification = Notification::create([
            'user_id' => $user->id,
            'title' => 'Test Notification',
            'title_ar' => 'إشعار تجريبي',
            'body' => 'This is a test notification from ClinicFlow',
            'body_ar' => 'هذا إشعار تجريبي من عيادة فلو',
            'type' => 'general',
        ]);

        // In production, here you would send push notification via FCM
        // Example:
        // $this->sendPushNotification($user, $notification);

        return response()->json([
            'success' => true,
            'message' => 'Test notification sent',
            'data' => $notification
        ]);
    }

    /**
     * Helper method to send push notification via FCM
     * (Implementation requires Firebase Cloud Messaging setup)
     */
    private function sendPushNotification($user, $notification)
    {
        // Get active device tokens for user
        $deviceTokens = DeviceToken::where('user_id', $user->id)
            ->where('is_active', true)
            ->pluck('token')
            ->toArray();

        if (empty($deviceTokens)) {
            return;
        }

        // FCM implementation would go here
        // Example using Firebase Admin SDK:
        /*
        $message = [
            'notification' => [
                'title' => $notification->title,
                'body' => $notification->body,
            ],
            'data' => [
                'notification_id' => $notification->id,
                'type' => $notification->type,
            ],
        ];

        foreach ($deviceTokens as $token) {
            // Send via FCM
            $messaging->send($message->setToken($token));
        }
        */
    }
}
