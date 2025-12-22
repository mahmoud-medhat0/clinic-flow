// Invoice data types and mock data
export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
    id: number;
    invoiceNumber: string;
    patientId: number;
    patientName: string;
    date: string; // ISO date string
    dueDate: string; // ISO date string
    amount: number;
    status: InvoiceStatus;
    service: string;
    notes?: string;
}

// Helper to format invoice number
const formatInvoiceNumber = (id: number) => `INV-${String(id).padStart(3, '0')}`;

// Get dates for mock data
const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const daysAgo = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return formatDate(date);
};

const daysFromNow = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return formatDate(date);
};

export const invoicesData: Invoice[] = [
    {
        id: 1,
        invoiceNumber: formatInvoiceNumber(1),
        patientId: 1,
        patientName: 'Mohamed Ali',
        date: daysAgo(5),
        dueDate: daysFromNow(10),
        amount: 250,
        status: 'paid',
        service: 'Check-up',
        notes: 'Annual health checkup completed',
    },
    {
        id: 2,
        invoiceNumber: formatInvoiceNumber(2),
        patientId: 2,
        patientName: 'Fatima Hassan',
        date: daysAgo(3),
        dueDate: daysFromNow(12),
        amount: 180,
        status: 'paid',
        service: 'Follow-up',
        notes: 'Blood pressure medication follow-up',
    },
    {
        id: 3,
        invoiceNumber: formatInvoiceNumber(3),
        patientId: 3,
        patientName: 'Ahmed Mahmoud',
        date: daysAgo(2),
        dueDate: daysFromNow(13),
        amount: 320,
        status: 'pending',
        service: 'Consultation',
        notes: 'New patient consultation',
    },
    {
        id: 4,
        invoiceNumber: formatInvoiceNumber(4),
        patientId: 4,
        patientName: 'Sara Ahmed',
        date: daysAgo(15),
        dueDate: daysAgo(5),
        amount: 150,
        status: 'overdue',
        service: 'Lab Results',
        notes: 'Lab results review - payment overdue',
    },
    {
        id: 5,
        invoiceNumber: formatInvoiceNumber(5),
        patientId: 5,
        patientName: 'Omar Khalil',
        date: daysAgo(1),
        dueDate: daysFromNow(14),
        amount: 275,
        status: 'pending',
        service: 'Vaccination',
        notes: 'Flu vaccination',
    },
    {
        id: 6,
        invoiceNumber: formatInvoiceNumber(6),
        patientId: 6,
        patientName: 'Layla Nasser',
        date: formatDate(today),
        dueDate: daysFromNow(15),
        amount: 420,
        status: 'pending',
        service: 'Physical Exam',
        notes: 'Complete physical examination',
    },
];
