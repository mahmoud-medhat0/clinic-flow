<?php

namespace App\Events;

use App\Models\Invoice;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentReceived
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $invoice;
    public $amount;

    /**
     * Create a new event instance.
     */
    public function __construct(Invoice $invoice, $amount)
    {
        $this->invoice = $invoice;
        $this->amount = $amount;
    }
}
