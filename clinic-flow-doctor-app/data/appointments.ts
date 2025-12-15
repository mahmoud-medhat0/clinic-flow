// Appointment data types and mock data
export type AppointmentStatus = 'confirmed' | 'pending' | 'canceled' | 'completed';
export type AppointmentType = 'checkup' | 'followup' | 'consultation' | 'vaccination' | 'labResults';

export interface Appointment {
    id: number;
    patientId: number;
    patientName: string;
    day: string; // ISO date string
    time: string; // HH:MM format
    type: AppointmentType;
    duration: number; // in minutes
    notes: string;
    status: AppointmentStatus;
}

// Get today and upcoming dates
const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);

export const appointmentsData: Appointment[] = [
    {
        id: 1,
        patientId: 1,
        patientName: 'Mohamed Ali',
        day: formatDate(today),
        time: '09:00',
        type: 'checkup',
        duration: 30,
        notes: 'Annual health checkup',
        status: 'confirmed',
    },
    {
        id: 2,
        patientId: 2,
        patientName: 'Fatima Hassan',
        day: formatDate(today),
        time: '09:30',
        type: 'followup',
        duration: 20,
        notes: 'Follow-up for blood pressure medication',
        status: 'confirmed',
    },
    {
        id: 3,
        patientId: 3,
        patientName: 'Ahmed Mahmoud',
        day: formatDate(today),
        time: '10:00',
        type: 'consultation',
        duration: 30,
        notes: 'New patient consultation',
        status: 'pending',
    },
    {
        id: 4,
        patientId: 4,
        patientName: 'Sara Ahmed',
        day: formatDate(today),
        time: '11:00',
        type: 'vaccination',
        duration: 15,
        notes: 'Flu vaccination',
        status: 'confirmed',
    },
    {
        id: 5,
        patientId: 5,
        patientName: 'Omar Khalil',
        day: formatDate(today),
        time: '14:00',
        type: 'labResults',
        duration: 20,
        notes: 'Review lab results',
        status: 'pending',
    },
    {
        id: 6,
        patientId: 1,
        patientName: 'Mohamed Ali',
        day: formatDate(tomorrow),
        time: '10:00',
        type: 'followup',
        duration: 20,
        notes: 'Check progress',
        status: 'confirmed',
    },
    {
        id: 7,
        patientId: 6,
        patientName: 'Layla Nasser',
        day: formatDate(tomorrow),
        time: '11:30',
        type: 'checkup',
        duration: 30,
        notes: 'Routine checkup',
        status: 'pending',
    },
    {
        id: 8,
        patientId: 7,
        patientName: 'Youssef Ibrahim',
        day: formatDate(dayAfter),
        time: '09:00',
        type: 'consultation',
        duration: 45,
        notes: 'Initial consultation for chronic pain',
        status: 'confirmed',
    },
];
