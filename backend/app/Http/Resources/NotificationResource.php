<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $locale = app()->getLocale();
        
        return [
            'id' => $this->id,
            'title' => $locale === 'ar' ? ($this->title_ar ?? $this->title) : $this->title,
            'body' => $locale === 'ar' ? ($this->body_ar ?? $this->body) : $this->body,
            'type' => $this->type,
            'data' => $this->data,
            'is_read' => $this->is_read,
            'read_at' => $this->read_at?->toDateTimeString(),
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
