<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clinic extends Model
{
    protected $fillable = [
        'name',
        'name_ar',
        'description',
        'description_ar',
        'image',
        'address',
        'phone',
        'email',
        'working_hours',
        'rating',
        'is_active',
    ];

    protected $casts = [
        'working_hours' => 'array',
        'rating' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the services for the clinic
     */
    public function services()
    {
        return $this->hasMany(Service::class);
    }

    /**
     * Get the appointments for the clinic
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get the inventory items for the clinic
     */
    public function inventory()
    {
        return $this->hasMany(Inventory::class);
    }

    /**
     * Get localized name based on current locale (Accessor)
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
     * Get active services count (Accessor)
     */
    public function getActiveServicesCountAttribute()
    {
        return $this->services()->where('is_active', true)->count();
    }

    /**
     * Set rating (Mutator) - ensure it's between 0 and 5
     */
    public function setRatingAttribute($value)
    {
        $this->attributes['rating'] = max(0, min(5, $value));
    }
}
