<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = [
        'user_id',
        'specialization',
        'license_number',
        'bio',
        'years_of_experience',
        'consultation_fee',
        'rating',
        'available_from',
        'available_to',
    ];

    protected $casts = [
        'years_of_experience' => 'integer',
        'consultation_fee' => 'decimal:2',
        'rating' => 'decimal:2',
    ];

    /**
     * Get the user that owns the doctor profile
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the appointments for the doctor
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get the doctor's full name (Accessor)
     */
    public function getFullNameAttribute()
    {
        return $this->user ? $this->user->name : null;
    }

    /**
     * Get formatted consultation fee (Accessor)
     */
    public function getFormattedFeeAttribute()
    {
        return number_format($this->consultation_fee, 2) . ' USD';
    }

    /**
     * Check if doctor is available (Accessor)
     */
    public function getIsAvailableAttribute()
    {
        if (!$this->available_from || !$this->available_to) {
            return false;
        }
        
        $now = now()->format('H:i');
        return $now >= $this->available_from && $now <= $this->available_to;
    }

    /**
     * Set consultation fee (Mutator) - ensure it's positive
     */
    public function setConsultationFeeAttribute($value)
    {
        $this->attributes['consultation_fee'] = max(0, $value);
    }

    /**
     * Set rating (Mutator) - ensure it's between 0 and 5
     */
    public function setRatingAttribute($value)
    {
        $this->attributes['rating'] = max(0, min(5, $value));
    }
}
