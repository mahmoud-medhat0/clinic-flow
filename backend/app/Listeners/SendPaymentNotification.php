<?php

namespace App\Listeners;

use App\Events\PaymentReceived;
use App\Models\Notification;

class SendPaymentNotification
{
    /**
     * Handle the event.
     */
    public function handle(PaymentReceived $event): void
    {
        $invoice = $event->invoice->load(['patient.user']);
        $amount = $event->amount;

        // Notify patient
        Notification::create([
            'user_id' => $invoice->patient->user_id,
            'title' => 'Payment Received',
            'title_ar' => 'تم استلام الدفعة',
            'body' => "Payment of $$amount received for invoice #{$invoice->invoice_number}. Remaining: {$invoice->formatted_remaining}",
            'body_ar' => "تم استلام دفعة بمبلغ $$amount للفاتورة رقم {$invoice->invoice_number}. المتبقي: {$invoice->formatted_remaining}",
            'type' => 'payment',
            'data' => [
                'invoice_id' => $invoice->id,
                'amount_paid' => $amount,
                'remaining_amount' => $invoice->remaining_amount
            ],
        ]);
    }
}
