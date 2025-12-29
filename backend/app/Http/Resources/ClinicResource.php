<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClinicResource extends JsonResource
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
            'name' => $this->name,
            'name_ar' => $this->name_ar,
            'localized_name' => $this->localized_name,
            'description' => $this->description,
            'description_ar' => $this->description_ar,
            'localized_description' => $this->localized_description,
            'image' => $this->image,
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'working_hours' => $this->working_hours,
            'rating' => $this->rating,
            'is_active' => $this->is_active,
            'active_services_count' => $this->active_services_count,
            'services' => ServiceResource::collection($this->whenLoaded('services')),
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
