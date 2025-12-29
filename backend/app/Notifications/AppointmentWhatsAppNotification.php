<?php

namespace App\Notifications;

use App\Channels\WhatsAppChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AppointmentWhatsAppNotification extends Notification
{
    use Queueable;

    protected $appointment;
    protected $messageType;

    /**
     * Create a new notification instance.
     */
    public function __construct($appointment, $messageType = 'created')
    {
        $this->appointment = $appointment;
        $this->messageType = $messageType;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return [WhatsAppChannel::class];
    }

    /**
     * Get the WhatsApp representation of the notification.
     */
    public function toWhatsApp($notifiable)
    {
        $appointment = $this->appointment;
        $message = $this->buildMessage();

        return [
            'phone_number' => $notifiable->phone ?? $notifiable->user->phone,
            'phone_number2' => null,
            'message' => $message,
            'token' => env('WA_API_TOKEN')
        ];
    }

    /**
     * Build WhatsApp message based on type
     */
    private function buildMessage()
    {
        $locale = app()->getLocale();
        $appointment = $this->appointment;

        switch ($this->messageType) {
            case 'created':
                if ($locale === 'ar') {
                    return "تم حجز موعد جديد\n" .
                           "الطبيب: {$appointment->doctor->user->name}\n" .
                           "العيادة: {$appointment->clinic->name_ar}\n" .
                           "التاريخ: {$appointment->date->format('Y-m-d')}\n" .
                           "الوقت: {$appointment->time}\n" .
                           "يرجى الحضور قبل 10 دقائق من الموعد.";
                }
                return "New Appointment Created\n" .
                       "Doctor: {$appointment->doctor->user->name}\n" .
                       "Clinic: {$appointment->clinic->name}\n" .
                       "Date: {$appointment->date->format('Y-m-d')}\n" .
                       "Time: {$appointment->time}\n" .
                       "Please arrive 10 minutes early.";

            case 'confirmed':
                if ($locale === 'ar') {
                    return "تم تأكيد موعدك\n" .
                           "التاريخ: {$appointment->date->format('Y-m-d')}\n" .
                           "الوقت: {$appointment->time}";
                }
                return "Your appointment has been confirmed\n" .
                       "Date: {$appointment->date->format('Y-m-d')}\n" .
                       "Time: {$appointment->time}";

            case 'cancelled':
                if ($locale === 'ar') {
                    return "تم إلغاء موعدك\n" .
                           "السبب: {$appointment->cancellation_reason}";
                }
                return "Your appointment has been cancelled\n" .
                       "Reason: {$appointment->cancellation_reason}";

            case 'reminder':
                if ($locale === 'ar') {
                    return "تذكير بموعدك غداً\n" .
                           "الطبيب: {$appointment->doctor->user->name}\n" .
                           "الوقت: {$appointment->time}";
                }
                return "Reminder: Your appointment tomorrow\n" .
                       "Doctor: {$appointment->doctor->user->name}\n" .
                       "Time: {$appointment->time}";

            default:
                return "You have an appointment update.";
        }
    }
}
