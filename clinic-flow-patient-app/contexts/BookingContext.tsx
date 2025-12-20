import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { appointmentsApi, BookingPayload, Appointment } from '../services/appointments';

export interface BookingState {
  clinicId: string | null;
  clinicName: string | null;
  doctorId: string | null;
  doctorName: string | null;
  serviceId: string | null;
  serviceName: string | null;
  servicePrice: number | null;
  serviceDuration: number | null;
  selectedDate: string | null;
  selectedTime: string | null;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  notes: string;
}

interface BookingContextType {
  booking: BookingState;
  currentStep: number;
  isSubmitting: boolean;
  setClinic: (id: string, name: string) => void;
  setDoctor: (id: string | null, name: string | null) => void;
  setService: (id: string, name: string, price: number, duration: number) => void;
  setDateTime: (date: string, time: string) => void;
  setPatientInfo: (name: string, phone: string, email: string, notes: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  resetBooking: () => void;
  submitBooking: () => Promise<Appointment>;
}

const initialBooking: BookingState = {
  clinicId: null,
  clinicName: null,
  doctorId: null,
  doctorName: null,
  serviceId: null,
  serviceName: null,
  servicePrice: null,
  serviceDuration: null,
  selectedDate: null,
  selectedTime: null,
  patientName: '',
  patientPhone: '',
  patientEmail: '',
  notes: '',
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(initialBooking);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setClinic = useCallback((id: string, name: string) => {
    setBooking(prev => ({ ...prev, clinicId: id, clinicName: name }));
  }, []);

  const setDoctor = useCallback((id: string | null, name: string | null) => {
    setBooking(prev => ({ ...prev, doctorId: id, doctorName: name }));
  }, []);

  const setService = useCallback((id: string, name: string, price: number, duration: number) => {
    setBooking(prev => ({ 
      ...prev, 
      serviceId: id, 
      serviceName: name, 
      servicePrice: price,
      serviceDuration: duration,
    }));
  }, []);

  const setDateTime = useCallback((date: string, time: string) => {
    setBooking(prev => ({ ...prev, selectedDate: date, selectedTime: time }));
  }, []);

  const setPatientInfo = useCallback((name: string, phone: string, email: string, notes: string) => {
    setBooking(prev => ({ 
      ...prev, 
      patientName: name, 
      patientPhone: phone, 
      patientEmail: email, 
      notes 
    }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 4)));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(initialBooking);
    setCurrentStep(1);
  }, []);

  const submitBooking = useCallback(async (): Promise<Appointment> => {
    if (!booking.clinicId || !booking.serviceId || !booking.selectedDate || 
        !booking.selectedTime || !booking.patientName || !booking.patientPhone) {
      throw new Error('Missing required booking information');
    }

    setIsSubmitting(true);
    try {
      const payload: BookingPayload = {
        clinic_id: booking.clinicId,
        doctor_id: booking.doctorId || undefined,
        service_id: booking.serviceId,
        date: booking.selectedDate,
        time: booking.selectedTime,
        patient_name: booking.patientName,
        patient_phone: booking.patientPhone,
        patient_email: booking.patientEmail || undefined,
        notes: booking.notes || undefined,
      };

      const appointment = await appointmentsApi.book(payload);
      return appointment;
    } finally {
      setIsSubmitting(false);
    }
  }, [booking]);

  const value = useMemo(() => ({
    booking,
    currentStep,
    isSubmitting,
    setClinic,
    setDoctor,
    setService,
    setDateTime,
    setPatientInfo,
    nextStep,
    previousStep,
    goToStep,
    resetBooking,
    submitBooking,
  }), [
    booking,
    currentStep,
    isSubmitting,
    setClinic,
    setDoctor,
    setService,
    setDateTime,
    setPatientInfo,
    nextStep,
    previousStep,
    goToStep,
    resetBooking,
    submitBooking,
  ]);

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
