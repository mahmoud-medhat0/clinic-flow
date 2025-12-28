export type NotificationType = 'appointment' | 'reminder' | 'system';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
    actionUrl?: string;
}

// Mock notifications data for patient app
export const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'appointment',
        title: 'Appointment Confirmed',
        message: 'Your appointment with Dr. Ahmed at HealthCare Medical Center is confirmed for tomorrow at 10:00 AM.',
        time: '2h ago',
        read: false,
        actionUrl: '/appointment/1',
    },
    {
        id: '2',
        type: 'reminder',
        title: 'Appointment Reminder',
        message: 'Don\'t forget your appointment tomorrow at 10:00 AM with Dr. Ahmed.',
        time: '5h ago',
        read: false,
    },
    {
        id: '3',
        type: 'system',
        title: 'Welcome to ClinicFlow',
        message: 'Thank you for choosing ClinicFlow. Book your first appointment today!',
        time: '1d ago',
        read: true,
    },
    {
        id: '4',
        type: 'appointment',
        title: 'Appointment Cancelled',
        message: 'Your appointment scheduled for Jan 15 has been cancelled. Please reschedule at your convenience.',
        time: '2d ago',
        read: true,
    },
    {
        id: '5',
        type: 'reminder',
        title: 'Health Check-up Due',
        message: 'It\'s been 6 months since your last check-up. Schedule your next appointment.',
        time: '3d ago',
        read: true,
    },
];
