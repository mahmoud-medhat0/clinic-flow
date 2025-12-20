import { api } from './api';

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    image?: string;
    bio?: string;
    rating: number;
    reviewCount: number;
    clinicId: string;
}

export interface TimeSlot {
    time: string;
    available: boolean;
}

// Mock doctors data
const mockDoctors: Doctor[] = [
    {
        id: 'd1',
        name: 'Dr. Sarah Johnson',
        specialty: 'General Medicine',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
        bio: 'Board-certified physician with 15 years of experience in family medicine.',
        rating: 4.9,
        reviewCount: 124,
        clinicId: '1',
    },
    {
        id: 'd2',
        name: 'Dr. Michael Chen',
        specialty: 'Dermatology',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
        bio: 'Specialist in skin conditions and cosmetic dermatology.',
        rating: 4.8,
        reviewCount: 98,
        clinicId: '3',
    },
    {
        id: 'd3',
        name: 'Dr. Emily Brown',
        specialty: 'Pediatrics',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
        bio: 'Dedicated pediatrician caring for children from newborn to adolescence.',
        rating: 4.9,
        reviewCount: 156,
        clinicId: '2',
    },
    {
        id: 'd4',
        name: 'Dr. James Wilson',
        specialty: 'Cardiology',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
        bio: 'Expert in cardiovascular health with advanced training in interventional cardiology.',
        rating: 4.7,
        reviewCount: 89,
        clinicId: '3',
    },
];

const mockTimeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: false },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: false },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
];

const USE_MOCK_DATA = true;

export const doctorsApi = {
    getAll: async (clinicId?: string): Promise<Doctor[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            if (clinicId) {
                return mockDoctors.filter(d => d.clinicId === clinicId);
            }
            return mockDoctors;
        }
        const url = clinicId ? `/doctors?clinicId=${clinicId}` : '/doctors';
        return api.get<Doctor[]>(url);
    },

    getById: async (id: string): Promise<Doctor> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const doctor = mockDoctors.find(d => d.id === id);
            if (!doctor) throw new Error('Doctor not found');
            return doctor;
        }
        return api.get<Doctor>(`/doctors/${id}`);
    },

    getTimeSlots: async (doctorId: string, date: string, serviceId?: string): Promise<TimeSlot[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            // Randomize some availability for demo purposes
            return mockTimeSlots.map(slot => ({
                ...slot,
                available: slot.available && Math.random() > 0.3,
            }));
        }
        let url = `/doctors/${doctorId}/availability?date=${date}`;
        if (serviceId) url += `&serviceId=${serviceId}`;
        return api.get<TimeSlot[]>(url);
    },
};
