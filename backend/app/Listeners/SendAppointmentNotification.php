<?php

namespace App\Listeners;

use App\Events\AppointmentCreated;
use App\Models\Notification;
use App\Mail\AppointmentCreatedMail;
use Illuminate\Support\Facades\Mail;

class SendAppointmentNotification
{
    /**
     * Handle the event.
     */
    public function handle(AppointmentCreated $event): void
    {
        $appointment = $event->appointment->load(['patient.user', 'doctor.user', 'clinic', 'service']);

        // Send database notification to patient
        Notification::create([
            'user_id' => $appointment->patient->user_id,
            'title' => 'New Appointment Created',
            'title_ar' => 'تم إنشاء موعد جديد',
            'body' => "Your appointment with Dr. {$appointment->doctor->user->name} has been created for {$appointment->date->format('Y-m-d')} at {$appointment->time}",
            'body_ar' => "تم إنشاء موعدك مع د. {$appointment->doctor->user->name} بتاريخ {$appointment->date->format('Y-m-d')} الساعة {$appointment->time}",
            'type' => 'appointment',
            'data' => [
                'appointment_id' => $appointment->id,
                'action' => 'created'
            ],
        ]);

        // Send database notification to doctor
        Notification::create([
            'user_id' => $appointment->doctor->user_id,
            'title' => 'New Appointment',
            'title_ar' => 'موعد جديد',
            'body' => "New appointment with {$appointment->patient->user->name} on {$appointment->date->format('Y-m-d')} at {$appointment->time}",
            'body_ar' => "موعد جديد مع {$appointment->patient->user->name} بتاريخ {$appointment->date->format('Y-m-d')} الساعة {$appointment->time}",
            'type' => 'appointment',
            'data' => [
                'appointment_id' => $appointment->id,
                'action' => 'created'
            ],
        ]);

        // Send email notification (optional, requires mail configuration)
        try {
            Mail::to($appointment->patient->user->email)
                ->send(new AppointmentCreatedMail($appointment));
        } catch (\Exception $e) {
            \Log::error('Failed to send appointment email: ' . $e->getMessage());
        }

        // Send WhatsApp notification (if enabled)
        if (env('WA_API_TOKEN')) {
            try {
                $appointment->patient->user->notify(
                    new \App\Notifications\AppointmentWhatsAppNotification($appointment, 'created')
                );
            } catch (\Exception $e) {
                \Log::error('Failed to send WhatsApp notification: ' . $e->getMessage());
            }
        }
    }
}
