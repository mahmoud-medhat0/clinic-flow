<?php

namespace App\Listeners;

use App\Events\InvoiceCreated;
use App\Models\Notification;

class SendInvoiceNotification
{
    /**
     * Handle the event.
     */
    public function handle(InvoiceCreated $event): void
    {
        $invoice = $event->invoice->load(['patient.user', 'appointment']);

        // Notify patient
        Notification::create([
            'user_id' => $invoice->patient->user_id,
            'title' => 'New Invoice Created',
            'title_ar' => 'فاتورة جديدة',
            'body' => "Invoice #{$invoice->invoice_number} created for amount {$invoice->formatted_total}",
            'body_ar' => "تم إنشاء فاتورة رقم {$invoice->invoice_number} بمبلغ {$invoice->formatted_total}",
            'type' => 'invoice',
            'data' => [
                'invoice_id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'total_amount' => $invoice->total_amount
            ],
        ]);
    }
}
