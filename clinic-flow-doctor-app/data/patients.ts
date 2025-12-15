// Patient data types and mock data
export type PatientStatus = 'active' | 'inactive';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Visit {
    id: number;
    date: string;
    type: string;
    notes: string;
    diagnosis?: string;
}

export interface Patient {
    id: number;
    name: string;
    phone: string;
    email: string;
    age: number;
    dob: string;
    bloodType: BloodType;
    address: string;
    status: PatientStatus;
    allergies?: string[];
    visits: Visit[];
    notes?: string;
}

export const patientsData: Patient[] = [
    {
        id: 1,
        name: 'Mohamed Ali',
        phone: '+20 100 123 4567',
        email: 'mohamed.ali@email.com',
        age: 45,
        dob: '1979-03-15',
        bloodType: 'A+',
        address: '45 Nile Street, Giza',
        status: 'active',
        allergies: ['Penicillin'],
        visits: [
            { id: 1, date: '2024-12-01', type: 'Checkup', notes: 'Annual checkup, all vitals normal', diagnosis: 'Healthy' },
            { id: 2, date: '2024-11-15', type: 'Follow-up', notes: 'Blood pressure stable', diagnosis: 'Hypertension controlled' },
        ],
        notes: 'Regular patient, on blood pressure medication',
    },
    {
        id: 2,
        name: 'Fatima Hassan',
        phone: '+20 101 234 5678',
        email: 'fatima.h@email.com',
        age: 32,
        dob: '1992-07-22',
        bloodType: 'O+',
        address: '78 Garden City, Cairo',
        status: 'active',
        allergies: [],
        visits: [
            { id: 1, date: '2024-12-10', type: 'Consultation', notes: 'Discussed diet and exercise plan' },
        ],
        notes: '',
    },
    {
        id: 3,
        name: 'Ahmed Mahmoud',
        phone: '+20 102 345 6789',
        email: 'a.mahmoud@email.com',
        age: 28,
        dob: '1996-01-10',
        bloodType: 'B+',
        address: '12 Heliopolis, Cairo',
        status: 'active',
        allergies: ['Aspirin', 'Shellfish'],
        visits: [],
        notes: 'New patient',
    },
    {
        id: 4,
        name: 'Sara Ahmed',
        phone: '+20 103 456 7890',
        email: 'sara.ahmed@email.com',
        age: 25,
        dob: '1999-05-18',
        bloodType: 'AB+',
        address: '33 Maadi, Cairo',
        status: 'active',
        allergies: [],
        visits: [
            { id: 1, date: '2024-11-20', type: 'Vaccination', notes: 'Flu shot administered' },
        ],
    },
    {
        id: 5,
        name: 'Omar Khalil',
        phone: '+20 104 567 8901',
        email: 'omar.k@email.com',
        age: 55,
        dob: '1969-09-03',
        bloodType: 'A-',
        address: '67 Zamalek, Cairo',
        status: 'active',
        allergies: ['Sulfa drugs'],
        visits: [
            { id: 1, date: '2024-12-05', type: 'Lab Results', notes: 'Cholesterol slightly elevated' },
            { id: 2, date: '2024-11-01', type: 'Checkup', notes: 'General health assessment' },
        ],
        notes: 'Monitor cholesterol levels',
    },
    {
        id: 6,
        name: 'Layla Nasser',
        phone: '+20 105 678 9012',
        email: 'layla.n@email.com',
        age: 38,
        dob: '1986-12-25',
        bloodType: 'O-',
        address: '89 Dokki, Giza',
        status: 'active',
        allergies: [],
        visits: [],
    },
    {
        id: 7,
        name: 'Youssef Ibrahim',
        phone: '+20 106 789 0123',
        email: 'youssef.i@email.com',
        age: 62,
        dob: '1962-04-08',
        bloodType: 'B-',
        address: '23 Nasr City, Cairo',
        status: 'active',
        allergies: ['Codeine'],
        visits: [
            { id: 1, date: '2024-10-15', type: 'Consultation', notes: 'Referred to specialist' },
        ],
        notes: 'Chronic back pain, seeing orthopedic specialist',
    },
    {
        id: 8,
        name: 'Nour El-Din',
        phone: '+20 107 890 1234',
        email: 'nour.d@email.com',
        age: 41,
        dob: '1983-08-30',
        bloodType: 'AB-',
        address: '56 October City',
        status: 'inactive',
        allergies: [],
        visits: [
            { id: 1, date: '2024-06-01', type: 'Checkup', notes: 'Routine visit' },
        ],
        notes: 'Has not visited in 6 months',
    },
];
