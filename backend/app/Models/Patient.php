<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'user_id',
        'date_of_birth',
        'gender',
        'blood_type',
        'allergies',
        'chronic_diseases',
        'emergency_contact',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    /**
     * Get the user that owns the patient profile
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the appointments for the patient
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get the invoices for the patient
     */
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * Get patient's full name (Accessor)
     */
    public function getFullNameAttribute()
    {
        return $this->user ? $this->user->name : null;
    }

    /**
     * Get patient's age (Accessor)
     */
    public function getAgeAttribute()
    {
        if (!$this->date_of_birth) {
            return null;
        }
        
        return $this->date_of_birth->age;
    }

    /**
     * Get formatted allergies list (Accessor)
     */
    public function getAllergiesListAttribute()
    {
        if (!$this->allergies) {
            return [];
        }
        
        return array_map('trim', explode(',', $this->allergies));
    }

    /**
     * Get formatted chronic diseases list (Accessor)
     */
    public function getChronicDiseasesListAttribute()
    {
        if (!$this->chronic_diseases) {
            return [];
        }
        
        return array_map('trim', explode(',', $this->chronic_diseases));
    }

    /**
     * Set allergies (Mutator) - convert array to comma-separated string
     */
    public function setAllergiesAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['allergies'] = implode(', ', $value);
        } else {
            $this->attributes['allergies'] = $value;
        }
    }

    /**
     * Set chronic diseases (Mutator) - convert array to comma-separated string
     */
    public function setChronicDiseasesAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['chronic_diseases'] = implode(', ', $value);
        } else {
            $this->attributes['chronic_diseases'] = $value;
        }
    }
}
