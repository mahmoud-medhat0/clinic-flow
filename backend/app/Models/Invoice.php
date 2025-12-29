<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'patient_id',
        'appointment_id',
        'invoice_number',
        'total_amount',
        'paid_amount',
        'status',
        'payment_method',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
    ];

    /**
     * Get the patient for the invoice
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Get the appointment for the invoice
     */
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    /**
     * Get remaining amount (Accessor)
     */
    public function getRemainingAmountAttribute()
    {
        return max(0, $this->total_amount - $this->paid_amount);
    }

    /**
     * Check if invoice is fully paid (Accessor)
     */
    public function getIsFullyPaidAttribute()
    {
        return $this->paid_amount >= $this->total_amount;
    }

    /**
     * Check if invoice is partially paid (Accessor)
     */
    public function getIsPartiallyPaidAttribute()
    {
        return $this->paid_amount > 0 && $this->paid_amount < $this->total_amount;
    }

    /**
     * Get payment percentage (Accessor)
     */
    public function getPaymentPercentageAttribute()
    {
        if ($this->total_amount == 0) {
            return 0;
        }
        
        return round(($this->paid_amount / $this->total_amount) * 100, 2);
    }

    /**
     * Get formatted total amount (Accessor)
     */
    public function getFormattedTotalAttribute()
    {
        return number_format($this->total_amount, 2) . ' USD';
    }

    /**
     * Get formatted paid amount (Accessor)
     */
    public function getFormattedPaidAttribute()
    {
        return number_format($this->paid_amount, 2) . ' USD';
    }

    /**
     * Get formatted remaining amount (Accessor)
     */
    public function getFormattedRemainingAttribute()
    {
        return number_format($this->remaining_amount, 2) . ' USD';
    }
}
