import { api } from './api';

export interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    category?: string;
}

export interface OpeningHour {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
}

export interface Clinic {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    image: string;
    description?: string;
    rating: number;
    reviewCount: number;
    isOpen: boolean;
    services: Service[];
    openingHours: OpeningHour[];
}

export interface TimeSlot {
    time: string;
    available: boolean;
}

// Mock data for testing
const mockClinics: Clinic[] = [
    {
        id: '1',
        name: 'HealthCare Medical Center',
        address: '123 Medical Drive, Downtown',
        phone: '+1 (555) 123-4567',
        email: 'contact@healthcare.com',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
        description: 'State-of-the-art medical facility offering comprehensive healthcare services for the whole family.',
        rating: 4.8,
        reviewCount: 256,
        isOpen: true,
        services: [
            { id: 's1', name: 'General Checkup', description: 'Complete health examination', price: 75, duration: 30 },
            { id: 's2', name: 'Dental Cleaning', description: 'Professional teeth cleaning', price: 120, duration: 45 },
            { id: 's3', name: 'Eye Exam', description: 'Comprehensive vision testing', price: 90, duration: 30 },
        ],
        openingHours: [
            { day: 'Monday', open: '08:00', close: '18:00', isClosed: false },
            { day: 'Tuesday', open: '08:00', close: '18:00', isClosed: false },
            { day: 'Wednesday', open: '08:00', close: '18:00', isClosed: false },
            { day: 'Thursday', open: '08:00', close: '18:00', isClosed: false },
            { day: 'Friday', open: '08:00', close: '16:00', isClosed: false },
            { day: 'Saturday', open: '09:00', close: '14:00', isClosed: false },
            { day: 'Sunday', open: '', close: '', isClosed: true },
        ],
    },
    {
        id: '2',
        name: 'Family Wellness Clinic',
        address: '456 Wellness Blvd, Midtown',
        phone: '+1 (555) 987-6543',
        email: 'info@familywellness.com',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400',
        description: 'Your trusted partner in family health with personalized care.',
        rating: 4.6,
        reviewCount: 189,
        isOpen: true,
        services: [
            { id: 's4', name: 'Pediatric Care', description: 'Healthcare for children', price: 65, duration: 30 },
            { id: 's5', name: 'Vaccination', description: 'All types of vaccinations', price: 45, duration: 15 },
            { id: 's6', name: 'Lab Tests', description: 'Blood work and diagnostics', price: 55, duration: 20 },
        ],
        openingHours: [
            { day: 'Monday', open: '09:00', close: '17:00', isClosed: false },
            { day: 'Tuesday', open: '09:00', close: '17:00', isClosed: false },
            { day: 'Wednesday', open: '09:00', close: '17:00', isClosed: false },
            { day: 'Thursday', open: '09:00', close: '17:00', isClosed: false },
            { day: 'Friday', open: '09:00', close: '17:00', isClosed: false },
            { day: 'Saturday', open: '', close: '', isClosed: true },
            { day: 'Sunday', open: '', close: '', isClosed: true },
        ],
    },
    {
        id: '3',
        name: 'Specialist Care Hospital',
        address: '789 Hospital Way, Uptown',
        phone: '+1 (555) 456-7890',
        email: 'appointments@specialist.com',
        image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400',
        description: 'Advanced specialist treatments with cutting-edge technology.',
        rating: 4.9,
        reviewCount: 342,
        isOpen: false,
        services: [
            { id: 's7', name: 'Cardiology Consult', description: 'Heart health evaluation', price: 150, duration: 45 },
            { id: 's8', name: 'Dermatology', description: 'Skin care treatments', price: 100, duration: 30 },
            { id: 's9', name: 'Orthopedic Consult', description: 'Bone and joint evaluation', price: 130, duration: 40 },
        ],
        openingHours: [
            { day: 'Monday', open: '07:00', close: '20:00', isClosed: false },
            { day: 'Tuesday', open: '07:00', close: '20:00', isClosed: false },
            { day: 'Wednesday', open: '07:00', close: '20:00', isClosed: false },
            { day: 'Thursday', open: '07:00', close: '20:00', isClosed: false },
            { day: 'Friday', open: '07:00', close: '20:00', isClosed: false },
            { day: 'Saturday', open: '08:00', close: '16:00', isClosed: false },
            { day: 'Sunday', open: '10:00', close: '14:00', isClosed: false },
        ],
    },
];

const mockTimeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: false },
    { time: '12:00', available: false },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: false },
    { time: '16:00', available: true },
];

// Use mock data instead of real API calls for now
const USE_MOCK_DATA = true;

export const clinicsApi = {
    getAll: async (): Promise<Clinic[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            return mockClinics;
        }
        return api.get<Clinic[]>('/clinics');
    },

    getById: async (id: string): Promise<Clinic> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const clinic = mockClinics.find(c => c.id === id);
            if (!clinic) throw new Error('Clinic not found');
            return clinic;
        }
        return api.get<Clinic>(`/clinics/${id}`);
    },

    getServices: async (clinicId: string): Promise<Service[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const clinic = mockClinics.find(c => c.id === clinicId);
            return clinic?.services || [];
        }
        return api.get<Service[]>(`/clinics/${clinicId}/services`);
    },

    getAvailability: async (clinicId: string, date: string): Promise<TimeSlot[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return mockTimeSlots;
        }
        return api.get<TimeSlot[]>(`/clinics/${clinicId}/availability?date=${date}`);
    },
};
