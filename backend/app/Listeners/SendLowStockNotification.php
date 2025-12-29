<?php

namespace App\Listeners;

use App\Events\LowStockAlert;
use App\Models\Notification;
use App\Models\User;

class SendLowStockNotification
{
    /**
     * Handle the event.
     */
    public function handle(LowStockAlert $event): void
    {
        $item = $event->inventoryItem->load('clinic');

        // Notify all admins
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Low Stock Alert',
                'title_ar' => 'تنبيه نقص مخزون',
                'body' => "Item '{$item->item_name}' in {$item->clinic->name} is low on stock. Current quantity: {$item->quantity}, Reorder level: {$item->reorder_level}",
                'body_ar' => "المنتج '{$item->item_name_ar}' في {$item->clinic->name_ar} منخفض المخزون. الكمية الحالية: {$item->quantity}، مستوى إعادة الطلب: {$item->reorder_level}",
                'type' => 'inventory',
                'data' => [
                    'inventory_id' => $item->id,
                    'item_name' => $item->item_name,
                    'quantity' => $item->quantity,
                    'reorder_level' => $item->reorder_level
                ],
            ]);
        }
    }
}
