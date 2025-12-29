<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patient_id' => $this->patient_id,
            'patient' => new PatientResource($this->whenLoaded('patient')),
            'appointment_id' => $this->appointment_id,
            'appointment' => new AppointmentResource($this->whenLoaded('appointment')),
            'invoice_number' => $this->invoice_number,
            'total_amount' => $this->total_amount,
            'paid_amount' => $this->paid_amount,
            'remaining_amount' => $this->remaining_amount,
            'formatted_total' => $this->formatted_total,
            'formatted_paid' => $this->formatted_paid,
            'formatted_remaining' => $this->formatted_remaining,
            'payment_percentage' => $this->payment_percentage,
            'status' => $this->status,
            'is_fully_paid' => $this->is_fully_paid,
            'is_partially_paid' => $this->is_partially_paid,
            'payment_method' => $this->payment_method,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
