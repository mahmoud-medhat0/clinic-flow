<?php

namespace App\Events;

use App\Models\Appointment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentStatusChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $appointment;
    public $oldStatus;
    public $newStatus;

    /**
     * Create a new event instance.
     */
    public function __construct(Appointment $appointment, $oldStatus, $newStatus)
    {
        $this->appointment = $appointment;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }
}
