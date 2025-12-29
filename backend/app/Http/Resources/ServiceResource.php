<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
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
            'clinic_id' => $this->clinic_id,
            'clinic' => new ClinicResource($this->whenLoaded('clinic')),
            'name' => $this->name,
            'name_ar' => $this->name_ar,
            'localized_name' => $this->localized_name,
            'description' => $this->description,
            'description_ar' => $this->description_ar,
            'localized_description' => $this->localized_description,
            'price' => $this->price,
            'formatted_price' => $this->formatted_price,
            'duration_minutes' => $this->duration_minutes,
            'formatted_duration' => $this->formatted_duration,
            'icon' => $this->icon,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
