import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle, ArrowRight, ArrowLeft, Loader2, Stethoscope, ClipboardList, MessagesSquare, HeartPulse } from 'lucide-react';
import { useTranslation, useDirection } from '../../../context/DirectionContext';
import { Link } from 'react-router-dom';
import ClinicNavbar from '../components/ClinicNavbar';
import ClinicFooter from '../components/ClinicFooter';

// Progress Indicator
const ProgressSteps = ({ currentStep }) => {
  const { t } = useTranslation();
  const steps = [
    { num: 1, label: t('clinic.booking.step1') },
    { num: 2, label: t('clinic.booking.step2') },
    { num: 3, label: t('clinic.booking.step3') },
    { num: 4, label: t('clinic.booking.step4') },
  ];
  
  return (
    <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
      {steps.map((step, i) => (
        <React.Fragment key={step.num}>
          <div className="flex flex-col items-center min-w-[60px]">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              currentStep >= step.num
                ? 'bg-gradient-to-r from-primary-500 to-teal-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {currentStep > step.num ? <CheckCircle className="w-5 h-5" /> : step.num}
            </div>
            <span className={`text-xs mt-2 text-center ${
              currentStep >= step.num ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 md:w-20 h-1 mx-2 rounded ${
              currentStep > step.num ? 'bg-gradient-to-r from-primary-500 to-teal-500' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Step 1: Select Service
const SelectService = ({ onNext, selectedService, setSelectedService }) => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  
  const services = [
    { id: 'general', icon: Stethoscope, nameKey: 'clinic.booking.serviceGeneral', priceKey: 'clinic.booking.serviceGeneralPrice' },
    { id: 'followup', icon: ClipboardList, nameKey: 'clinic.booking.serviceFollowup', priceKey: 'clinic.booking.serviceFollowupPrice' },
    { id: 'consultation', icon: MessagesSquare, nameKey: 'clinic.booking.serviceConsultation', priceKey: 'clinic.booking.serviceConsultationPrice' },
    { id: 'checkup', icon: HeartPulse, nameKey: 'clinic.booking.serviceCheckup', priceKey: 'clinic.booking.serviceCheckupPrice' },
  ];
  
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        {t('clinic.booking.selectService')}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
        {t('clinic.booking.selectServiceDesc')}
      </p>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            className={`p-6 rounded-2xl border-2 text-start transition-all ${
              selectedService === service.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-3">
              <service.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{t(service.nameKey)}</h3>
            <p className="text-primary-600 dark:text-primary-400 font-medium">{t(service.priceKey)}</p>
          </button>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={onNext}
          disabled={!selectedService}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
        >
          {t('clinic.booking.next')}
          {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

// Step 2: Select Date & Time
const SelectDateTime = ({ onNext, onBack, selectedDate, setSelectedDate, selectedTime, setSelectedTime }) => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  
  // Generate next 14 days
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ];
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        {t('clinic.booking.selectDateTime')}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
        {t('clinic.booking.selectDateTimeDesc')}
      </p>
      
      {/* Date selection */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          {t('clinic.booking.selectDate')}
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {dates.map((date, i) => {
            const dateStr = date.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            const isToday = i === 0;
            
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex-shrink-0 w-20 p-3 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary-500 to-teal-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                  {isToday ? t('clinic.booking.today') : date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {date.getDate()}
                </div>
                <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Time selection */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-500" />
          {t('clinic.booking.selectTime')}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-xl text-center font-medium transition-all ${
                selectedTime === time
                  ? 'bg-gradient-to-r from-primary-500 to-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          {t('clinic.booking.back')}
        </button>
        <button
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
        >
          {t('clinic.booking.next')}
          {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

// Step 3: Patient Details Form
const PatientForm = ({ onNext, onBack, formData, setFormData }) => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('clinic.booking.required');
    if (!formData.phone.trim()) newErrors.phone = t('clinic.booking.required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validate()) {
      onNext();
    }
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        {t('clinic.booking.patientDetails')}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
        {t('clinic.booking.patientDetailsDesc')}
      </p>
      
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t('clinic.booking.fullName')} *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('clinic.booking.fullNamePlaceholder')}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t('clinic.booking.phoneNumber')} *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t('clinic.booking.phonePlaceholder')}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t('clinic.booking.email')} ({t('clinic.booking.optional')})
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t('clinic.booking.emailPlaceholder')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t('clinic.booking.notes')} ({t('clinic.booking.optional')})
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('clinic.booking.notesPlaceholder')}
              rows={3}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          {t('clinic.booking.back')}
        </button>
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold hover:scale-105 transition-all"
        >
          {t('clinic.booking.confirm')}
          {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

// Step 4: Confirmation
const Confirmation = ({ bookingData }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  
  React.useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  const serviceLabels = {
    general: t('clinic.booking.serviceGeneral'),
    followup: t('clinic.booking.serviceFollowup'),
    consultation: t('clinic.booking.serviceConsultation'),
    checkup: t('clinic.booking.serviceCheckup'),
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">{t('clinic.booking.processing')}</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {t('clinic.booking.successTitle')}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        {t('clinic.booking.successMessage')}
      </p>
      
      {/* Booking Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-start mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('clinic.booking.summary')}</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t('clinic.booking.service')}:</span>
            <span className="font-medium text-gray-900 dark:text-white">{serviceLabels[bookingData.service]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t('clinic.booking.date')}:</span>
            <span className="font-medium text-gray-900 dark:text-white">{bookingData.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t('clinic.booking.time')}:</span>
            <span className="font-medium text-gray-900 dark:text-white">{bookingData.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t('clinic.booking.patient')}:</span>
            <span className="font-medium text-gray-900 dark:text-white">{bookingData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">{t('clinic.booking.phoneLabel')}:</span>
            <span className="font-medium text-gray-900 dark:text-white">{bookingData.phone}</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        {t('clinic.booking.confirmationNote')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/clinic"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          {t('clinic.booking.backToHome')}
        </Link>
        <Link
          to="/clinic/book"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold hover:scale-105 transition-all"
        >
          {t('clinic.booking.bookAnother')}
        </Link>
      </div>
    </div>
  );
};

// Main Booking Page
const BookingPage = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  
  const bookingData = {
    service: selectedService,
    date: selectedDate,
    time: selectedTime,
    ...formData,
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <ClinicNavbar />
      
      <main className="flex-1 pt-20 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/clinic" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline mb-4">
              <ArrowLeft className="w-4 h-4" />
              {t('clinic.booking.backToClinic')}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('clinic.booking.title')}
            </h1>
          </div>
          
          {/* Progress */}
          <ProgressSteps currentStep={step} />
          
          {/* Steps */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft-lg p-6 md:p-10">
            {step === 1 && (
              <SelectService
                onNext={() => setStep(2)}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
              />
            )}
            {step === 2 && (
              <SelectDateTime
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
              />
            )}
            {step === 3 && (
              <PatientForm
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {step === 4 && (
              <Confirmation bookingData={bookingData} />
            )}
          </div>
        </div>
      </main>
      
      <ClinicFooter />
    </div>
  );
};

export default BookingPage;
