<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryResource extends JsonResource
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
            'item_name' => $this->item_name,
            'item_name_ar' => $this->item_name_ar,
            'localized_name' => $this->localized_name,
            'category' => $this->category,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'total_value' => $this->total_value,
            'reorder_level' => $this->reorder_level,
            'is_low_stock' => $this->is_low_stock,
            'expiry_date' => $this->expiry_date?->toDateString(),
            'is_expired' => $this->is_expired,
            'days_until_expiry' => $this->days_until_expiry,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
