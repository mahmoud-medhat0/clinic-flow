<?php

namespace App\Channels;

use App\Jobs\SendWaMessage;
use Illuminate\Notifications\Notification;

class WhatsAppChannel
{
    /**
     * Send the given notification.
     */
    public function send($notifiable, Notification $notification)
    {
        // Get WhatsApp message from notification
        $message = $notification->toWhatsApp($notifiable);

        // Get phone numbers
        $phoneNumber = $notifiable->phone ?? $notifiable->user->phone ?? null;
        $phoneNumber2 = $message['phone_number2'] ?? null;
        $messageText = $message['message'] ?? '';
        $token = $message['token'] ?? env('WA_API_TOKEN');

        if (!$phoneNumber || !$messageText) {
            \Log::warning('WhatsApp notification missing phone or message', [
                'notifiable_id' => $notifiable->id
            ]);
            return;
        }

        // Dispatch job to send WhatsApp message
        SendWaMessage::dispatch($phoneNumber, $phoneNumber2, $messageText, $token);
    }
}
