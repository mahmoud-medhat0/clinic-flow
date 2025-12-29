<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Invoice;
use App\Events\AppointmentCreated;
use App\Events\InvoiceCreated;
use App\Events\LowStockAlert;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class EventTest extends TestCase
{
    use RefreshDatabase;

    public function test_appointment_created_event_is_dispatched()
    {
        Event::fake();

        $appointment = Appointment::factory()->create();
        
        event(new AppointmentCreated($appointment));

        Event::assertDispatched(AppointmentCreated::class, function ($event) use ($appointment) {
            return $event->appointment->id === $appointment->id;
        });
    }

    public function test_invoice_created_event_is_dispatched()
    {
        Event::fake();

        $invoice = Invoice::factory()->create();
        
        event(new InvoiceCreated($invoice));

        Event::assertDispatched(InvoiceCreated::class, function ($event) use ($invoice) {
            return $event->invoice->id === $invoice->id;
        });
    }

    public function test_low_stock_alert_event_is_dispatched()
    {
        Event::fake();

        $item = \App\Models\Inventory::factory()->create([
            'quantity' => 5,
            'reorder_level' => 10
        ]);
        
        event(new LowStockAlert($item));

        Event::assertDispatched(LowStockAlert::class);
    }

    public function test_appointment_created_creates_notifications()
    {
        $appointment = Appointment::factory()->create();
        
        event(new AppointmentCreated($appointment));

        // Check if notifications were created
        $this->assertDatabaseHas('notifications', [
            'user_id' => $appointment->patient->user_id,
            'type' => 'appointment'
        ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $appointment->doctor->user_id,
            'type' => 'appointment'
        ]);
    }
}
