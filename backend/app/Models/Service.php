<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'clinic_id',
        'name',
        'name_ar',
        'description',
        'description_ar',
        'price',
        'duration_minutes',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration_minutes' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the clinic that owns the service
     */
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Get the appointments for the service
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get localized name (Accessor)
     */
    public function getLocalizedNameAttribute()
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? ($this->name_ar ?? $this->name) : $this->name;
    }

    /**
     * Get localized description (Accessor)
     */
    public function getLocalizedDescriptionAttribute()
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? ($this->description_ar ?? $this->description) : $this->description;
    }

    /**
     * Get formatted price (Accessor)
     */
    public function getFormattedPriceAttribute()
    {
        return number_format($this->price, 2) . ' USD';
    }

    /**
     * Get formatted duration (Accessor)
     */
    public function getFormattedDurationAttribute()
    {
        $hours = floor($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;
        
        if ($hours > 0 && $minutes > 0) {
            return "{$hours}h {$minutes}m";
        } elseif ($hours > 0) {
            return "{$hours}h";
        } else {
            return "{$minutes}m";
        }
    }

    /**
     * Set price (Mutator) - ensure it's positive
     */
    public function setPriceAttribute($value)
    {
        $this->attributes['price'] = max(0, $value);
    }
}
