<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
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
            'date_of_birth' => $this->date_of_birth?->toDateString(),
            'age' => $this->age,
            'gender' => $this->gender,
            'blood_type' => $this->blood_type,
            'allergies' => $this->allergies,
            'allergies_list' => $this->allergies_list,
            'chronic_diseases' => $this->chronic_diseases,
            'chronic_diseases_list' => $this->chronic_diseases_list,
            'emergency_contact' => $this->emergency_contact,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
