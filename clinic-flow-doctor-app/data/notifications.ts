export type NotificationType = 'appointment' | 'inventory' | 'system';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
    actionUrl?: string;
}

export const notificationsData: Notification[] = [
    {
        id: '1',
        type: 'appointment',
        title: 'New Appointment Request',
        message: 'Sarah Ahmed requested an appointment for tomorrow at 10:00 AM',
        time: '5 min ago',
        read: false,
        actionUrl: '/appointments',
    },
    {
        id: '2',
        type: 'inventory',
        title: 'Low Stock Alert',
        message: 'Paracetamol 500mg is running low (5 boxes remaining)',
        time: '2 hours ago',
        read: false,
        actionUrl: '/inventory',
    },
    {
        id: '3',
        type: 'appointment',
        title: 'Appointment Cancelled',
        message: 'Mohamed Ali cancelled his appointment for today',
        time: '4 hours ago',
        read: true,
    },
    {
        id: '4',
        type: 'system',
        title: 'Weekly Report Ready',
        message: 'Your weekly performance report is ready to view',
        time: '1 day ago',
        read: true,
    },
];
