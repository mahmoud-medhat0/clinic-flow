import { api } from './api';
import { Service } from './clinics';

export interface Appointment {
    id: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    notes?: string;
    canCancel: boolean;
    clinic: {
        id: string;
        name: string;
        address: string;
        image: string;
        phone?: string;
    };
    service: Service;
    doctor?: {
        id: string;
        name: string;
        specialty: string;
        image?: string;
    };
}

export interface BookingPayload {
    clinicId: string;
    serviceId: string;
    doctorId?: string;
    date: string;
    time: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    notes?: string;
}

// Mock appointments data
const mockAppointments: Appointment[] = [
    {
        id: 'apt1',
        date: '2025-12-18',
        time: '10:00',
        status: 'confirmed',
        notes: 'Regular checkup appointment',
        canCancel: true,
        clinic: {
            id: '1',
            name: 'HealthCare Medical Center',
            address: '123 Medical Drive, Downtown',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
            phone: '+1 (555) 123-4567',
        },
        service: { id: 's1', name: 'General Checkup', price: 75, duration: 30 },
        doctor: { id: 'd1', name: 'Sarah Johnson', specialty: 'General Medicine' },
    },
    {
        id: 'apt2',
        date: '2025-12-20',
        time: '14:30',
        status: 'pending',
        canCancel: true,
        clinic: {
            id: '2',
            name: 'Family Wellness Clinic',
            address: '456 Wellness Blvd, Midtown',
            image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400',
            phone: '+1 (555) 987-6543',
        },
        service: { id: 's5', name: 'Vaccination', price: 45, duration: 15 },
    },
    {
        id: 'apt3',
        date: '2025-12-10',
        time: '09:00',
        status: 'completed',
        canCancel: false,
        clinic: {
            id: '3',
            name: 'Specialist Care Hospital',
            address: '789 Hospital Way, Uptown',
            image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400',
        },
        service: { id: 's8', name: 'Dermatology', price: 100, duration: 30 },
        doctor: { id: 'd2', name: 'Michael Chen', specialty: 'Dermatology' },
    },
    {
        id: 'apt4',
        date: '2025-11-28',
        time: '11:00',
        status: 'cancelled',
        canCancel: false,
        clinic: {
            id: '1',
            name: 'HealthCare Medical Center',
            address: '123 Medical Drive, Downtown',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
        },
        service: { id: 's2', name: 'Dental Cleaning', price: 120, duration: 45 },
    },
];

const USE_MOCK_DATA = true;

export const appointmentsApi = {
    getAll: async (): Promise<Appointment[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockAppointments;
        }
        return api.get<Appointment[]>('/appointments');
    },

    getUpcoming: async (): Promise<Appointment[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const now = new Date().toISOString().split('T')[0];
            return mockAppointments.filter(a =>
                a.date >= now && (a.status === 'confirmed' || a.status === 'pending')
            );
        }
        return api.get<Appointment[]>('/appointments/upcoming');
    },

    getPast: async (): Promise<Appointment[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const now = new Date().toISOString().split('T')[0];
            return mockAppointments.filter(a =>
                a.date < now || a.status === 'completed' || a.status === 'cancelled'
            );
        }
        return api.get<Appointment[]>('/appointments/past');
    },

    getById: async (id: string): Promise<Appointment> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const appointment = mockAppointments.find(a => a.id === id);
            if (!appointment) throw new Error('Appointment not found');
            return appointment;
        }
        return api.get<Appointment>(`/appointments/${id}`);
    },

    book: async (data: BookingPayload): Promise<Appointment> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 800));
            // Create a mock appointment
            const newAppointment: Appointment = {
                id: 'apt' + Date.now(),
                date: data.date,
                time: data.time,
                status: 'pending',
                notes: data.notes,
                canCancel: true,
                clinic: {
                    id: data.clinicId,
                    name: 'HealthCare Medical Center',
                    address: '123 Medical Drive, Downtown',
                    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
                },
                service: { id: data.serviceId, name: 'General Checkup', price: 75, duration: 30 },
            };
            mockAppointments.unshift(newAppointment);
            return newAppointment;
        }
        return api.post<Appointment>('/appointments', data);
    },

    cancel: async (id: string): Promise<void> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const appointment = mockAppointments.find(a => a.id === id);
            if (appointment) {
                appointment.status = 'cancelled';
                appointment.canCancel = false;
            }
            return;
        }
        return api.post<void>(`/appointments/${id}/cancel`);
    },

    reschedule: async (id: string, date: string, time: string): Promise<Appointment> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const appointment = mockAppointments.find(a => a.id === id);
            if (!appointment) throw new Error('Appointment not found');
            appointment.date = date;
            appointment.time = time;
            return appointment;
        }
        return api.put<Appointment>(`/appointments/${id}`, { date, time });
    },
};
