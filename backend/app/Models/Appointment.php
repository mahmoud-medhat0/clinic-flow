<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'clinic_id',
        'service_id',
        'date',
        'time',
        'status',
        'notes',
        'cancellation_reason',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    /**
     * Get the patient for the appointment
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Get the doctor for the appointment
     */
    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    /**
     * Get the clinic for the appointment
     */
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Get the service for the appointment
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the invoice for the appointment
     */
    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    /**
     * Get formatted date and time (Accessor)
     */
    public function getFormattedDateTimeAttribute()
    {
        return $this->date->format('Y-m-d') . ' at ' . $this->time;
    }

    /**
     * Get status badge color (Accessor)
     */
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'pending' => 'warning',
            'confirmed' => 'success',
            'cancelled' => 'danger',
            'completed' => 'info',
            default => 'secondary',
        };
    }

    /**
     * Check if appointment is upcoming (Accessor)
     */
    public function getIsUpcomingAttribute()
    {
        return $this->status === 'confirmed' && $this->date >= today();
    }

    /**
     * Check if appointment is past (Accessor)
     */
    public function getIsPastAttribute()
    {
        return $this->date < today();
    }

    /**
     * Check if appointment can be cancelled (Accessor)
     */
    public function getCanBeCancelledAttribute()
    {
        return in_array($this->status, ['pending', 'confirmed']) && !$this->is_past;
    }
}
