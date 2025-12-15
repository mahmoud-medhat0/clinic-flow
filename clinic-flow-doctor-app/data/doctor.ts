// Doctor profile data
export interface WorkingDay {
    day: string;
    start: string;
    end: string;
    isActive: boolean;
}

export const doctorData = {
    id: 1,
    name: 'Dr. Ahmed Hassan',
    nameAr: 'د. أحمد حسن',
    email: 'dr.ahmed@clinicflow.com',
    phone: '+20 123 456 7890',
    specialty: 'General Medicine',
    specialtyAr: 'طب عام',
    clinicName: 'ClinicFlow Medical Center',
    clinicNameAr: 'مركز كلينيك فلو الطبي',
    address: '123 Medical Center Drive, Cairo',
    addressAr: '123 شارع المركز الطبي، القاهرة',
    workingHours: {
        start: '09:00',
        end: '17:00',
    },
    workingDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
    // Detailed schedule per day
    schedule: [
        { day: 'sunday', start: '09:00', end: '17:00', isActive: true },
        { day: 'monday', start: '09:00', end: '17:00', isActive: true },
        { day: 'tuesday', start: '09:00', end: '17:00', isActive: true },
        { day: 'wednesday', start: '09:00', end: '15:00', isActive: true },
        { day: 'thursday', start: '10:00', end: '18:00', isActive: true },
        { day: 'friday', start: '00:00', end: '00:00', isActive: false },
        { day: 'saturday', start: '00:00', end: '00:00', isActive: false },
    ] as WorkingDay[],
};
