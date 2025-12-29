<?php

namespace App\Events;

use App\Models\Inventory;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LowStockAlert
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $inventoryItem;

    /**
     * Create a new event instance.
     */
    public function __construct(Inventory $inventoryItem)
    {
        $this->inventoryItem = $inventoryItem;
    }
}
