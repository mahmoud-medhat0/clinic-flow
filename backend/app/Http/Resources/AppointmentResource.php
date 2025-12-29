<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
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
            'doctor_id' => $this->doctor_id,
            'doctor' => new DoctorResource($this->whenLoaded('doctor')),
            'clinic_id' => $this->clinic_id,
            'clinic' => new ClinicResource($this->whenLoaded('clinic')),
            'service_id' => $this->service_id,
            'service' => new ServiceResource($this->whenLoaded('service')),
            'date' => $this->date?->toDateString(),
            'time' => $this->time,
            'formatted_date_time' => $this->formatted_date_time,
            'status' => $this->status,
            'status_color' => $this->status_color,
            'notes' => $this->notes,
            'cancellation_reason' => $this->cancellation_reason,
            'is_upcoming' => $this->is_upcoming,
            'is_past' => $this->is_past,
            'can_be_cancelled' => $this->can_be_cancelled,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
