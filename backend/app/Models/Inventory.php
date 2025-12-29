<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $fillable = [
        'clinic_id',
        'item_name',
        'item_name_ar',
        'category',
        'quantity',
        'unit_price',
        'reorder_level',
        'expiry_date',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'reorder_level' => 'integer',
        'expiry_date' => 'date',
    ];

    /**
     * Get the clinic that owns the inventory item
     */
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Get localized item name (Accessor)
     */
    public function getLocalizedNameAttribute()
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? ($this->item_name_ar ?? $this->item_name) : $this->item_name;
    }

    /**
     * Get total value (Accessor)
     */
    public function getTotalValueAttribute()
    {
        return $this->quantity * $this->unit_price;
    }

    /**
     * Check if item is low stock (Accessor)
     */
    public function getIsLowStockAttribute()
    {
        return $this->quantity <= $this->reorder_level;
    }

    /**
     * Check if item is expired (Accessor)
     */
    public function getIsExpiredAttribute()
    {
        return $this->expiry_date && $this->expiry_date < today();
    }

    /**
     * Get days until expiry (Accessor)
     */
    public function getDaysUntilExpiryAttribute()
    {
        if (!$this->expiry_date) {
            return null;
        }
        
        return today()->diffInDays($this->expiry_date, false);
    }

    /**
     * Set quantity (Mutator) - ensure it's not negative
     */
    public function setQuantityAttribute($value)
    {
        $this->attributes['quantity'] = max(0, $value);
    }
}
