<?php

namespace App\Listeners;

use App\Events\AppointmentStatusChanged;
use App\Models\Notification;

class SendStatusChangeNotification
{
    /**
     * Handle the event.
     */
    public function handle(AppointmentStatusChanged $event): void
    {
        $appointment = $event->appointment->load(['patient.user', 'doctor.user']);
        $newStatus = $event->newStatus;

        $statusMessages = [
            'confirmed' => [
                'en' => 'Your appointment has been confirmed',
                'ar' => 'تم تأكيد موعدك'
            ],
            'cancelled' => [
                'en' => 'Your appointment has been cancelled',
                'ar' => 'تم إلغاء موعدك'
            ],
            'completed' => [
                'en' => 'Your appointment has been completed',
                'ar' => 'تم إكمال موعدك'
            ],
        ];

        if (isset($statusMessages[$newStatus])) {
            // Notify patient (Database)
            Notification::create([
                'user_id' => $appointment->patient->user_id,
                'title' => 'Appointment Status Updated',
                'title_ar' => 'تحديث حالة الموعد',
                'body' => $statusMessages[$newStatus]['en'],
                'body_ar' => $statusMessages[$newStatus]['ar'],
                'type' => 'appointment',
                'data' => [
                    'appointment_id' => $appointment->id,
                    'status' => $newStatus
                ],
            ]);

            // Send WhatsApp notification (if enabled)
            if (env('WA_API_TOKEN')) {
                try {
                    $appointment->patient->user->notify(
                        new \App\Notifications\AppointmentWhatsAppNotification($appointment, $newStatus)
                    );
                } catch (\Exception $e) {
                    \Log::error('Failed to send WhatsApp status notification: ' . $e->getMessage());
                }
            }
        }
    }
}
