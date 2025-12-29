<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
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
            'user' => new UserResource($this->whenLoaded('user')),
            'full_name' => $this->full_name,
            'specialization' => $this->specialization,
            'license_number' => $this->license_number,
            'bio' => $this->bio,
            'years_of_experience' => $this->years_of_experience,
            'consultation_fee' => $this->consultation_fee,
            'formatted_fee' => $this->formatted_fee,
            'rating' => $this->rating,
            'available_from' => $this->available_from,
            'available_to' => $this->available_to,
            'is_available' => $this->is_available,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
