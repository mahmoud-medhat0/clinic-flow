import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, I18nManager } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';
import { clinicsApi, Service } from '../../services/clinics';
import { doctorsApi, TimeSlot } from '../../services/doctors';
import { ServiceCard } from '../../components/ServiceCard';
import { TimeSlotPicker } from '../../components/TimeSlotPicker';
import { LoadingState } from '../../components/LoadingState';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SuccessModal } from '../../components/ui/SuccessModal';

export default function BookingScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const { patient } = useAuth();
  const {
    booking,
    currentStep,
    isSubmitting,
    setService,
    setDateTime,
    setPatientInfo,
    nextStep,
    previousStep,
    submitBooking,
    resetBooking,
  } = useBooking();

  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Patient info form
  const [patientName, setPatientName] = useState(patient?.name || '');
  const [patientPhone, setPatientPhone] = useState(patient?.phone || '');
  const [patientEmail, setPatientEmail] = useState(patient?.email || '');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const steps = [
    { key: 1, label: t('booking.step.service') },
    { key: 2, label: t('booking.step.datetime') },
    { key: 3, label: t('booking.step.details') },
    { key: 4, label: t('booking.step.confirm') },
  ];

  useEffect(() => {
    if (booking.clinicId) {
      loadServices();
    }
  }, [booking.clinicId]);

  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots();
    }
  }, [selectedDate]);

  const loadServices = async () => {
    if (!booking.clinicId) return;
    try {
      setIsLoading(true);
      const data = await clinicsApi.getServices(booking.clinicId);
      setServices(data);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTimeSlots = async () => {
    try {
      // If we have a doctor, try to load real slots
      if (booking.doctorId) {
        const slots = await doctorsApi.getTimeSlots(booking.doctorId, selectedDate, booking.serviceId || undefined);
        setTimeSlots(slots);
        return;
      }
      
      // Fallback: Generate mock slots for demo
      setTimeSlots([
        { time: '09:00', available: true },
        { time: '09:30', available: true },
        { time: '10:00', available: false },
        { time: '10:30', available: true },
        { time: '11:00', available: true },
        { time: '11:30', available: true },
        { time: '14:00', available: true },
        { time: '14:30', available: false },
        { time: '15:00', available: true },
        { time: '15:30', available: true },
        { time: '16:00', available: true },
        { time: '16:30', available: true },
      ]);
    } catch (err) {
      console.error('Failed to load time slots', err);
      // Fallback mock slots on error
      setTimeSlots([
        { time: '09:00', available: true },
        { time: '09:30', available: true },
        { time: '10:00', available: false },
        { time: '10:30', available: true },
        { time: '11:00', available: true },
        { time: '11:30', available: true },
        { time: '14:00', available: true },
        { time: '14:30', available: false },
        { time: '15:00', available: true },
        { time: '15:30', available: true },
      ]);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setService(service.id, service.name, service.price, service.duration);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setDateTime(selectedDate, time);
  };

  const validatePatientInfo = () => {
    const newErrors: Record<string, string> = {};
    if (!patientName.trim()) newErrors.name = t('errors.nameRequired');
    if (!patientPhone.trim()) newErrors.phone = t('errors.phoneRequired');
    if (patientEmail && !/\S+@\S+\.\S+/.test(patientEmail)) {
      newErrors.email = t('errors.emailInvalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !booking.serviceId) {
      alert(t('booking.selectService'));
      return;
    }
    if (currentStep === 2 && (!booking.selectedDate || !booking.selectedTime)) {
      alert(t('booking.selectTime'));
      return;
    }
    if (currentStep === 3) {
      if (!validatePatientInfo()) return;
      setPatientInfo(patientName, patientPhone, patientEmail, notes);
    }
    nextStep();
  };

  const handleConfirmBooking = async () => {
    try {
      const appointment = await submitBooking();
      setShowSuccessModal(true);
    } catch (err) {
      // Show error - could also use a custom error modal here
      alert(t('errors.server'));
    }
  };

  const handleClose = () => {
    resetBooking();
    router.back();
  };

  // Generate next 7 days for date selection
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      isToday: i === 0,
    };
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16, textAlign: needsManualRTL ? 'left' : 'right' }}>
              {t('booking.selectService')}
            </Text>
            {isLoading ? (
              <LoadingState />
            ) : (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={booking.serviceId === service.id}
                  onPress={() => handleServiceSelect(service)}
                />
              ))
            )}
          </View>
        );

      case 2:
        return (
          <View>
            {/* Date Selector */}
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12, textAlign: needsManualRTL ? 'left' : 'right' }}>
              {t('booking.selectDate')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, marginBottom: 24 }}
            >
              {dates.map((d) => (
                <TouchableOpacity
                  key={d.date}
                  onPress={() => handleDateSelect(d.date)}
                  style={{
                    width: 60,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: selectedDate === d.date ? colors.primary : colors.surface,
                    borderWidth: selectedDate === d.date ? 0 : 1,
                    borderColor: colors.border,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, color: selectedDate === d.date ? colors.white : colors.textMuted, marginBottom: 4 }}>
                    {d.day}
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: selectedDate === d.date ? colors.white : colors.text }}>
                    {d.dayNum}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Time Slots */}
            {selectedDate && (
              <TimeSlotPicker
                slots={timeSlots}
                selectedTime={booking.selectedTime}
                onSelect={handleTimeSelect}
              />
            )}
          </View>
        );

      case 3:
        return (
          <View style={{ gap: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>
              {t('booking.patientInfo')}
            </Text>
            <Input
              label={t('booking.fullName')}
              placeholder={t('booking.fullNamePlaceholder')}
              value={patientName}
              onChangeText={setPatientName}
              error={errors.name}
              required
            />
            <Input
              label={t('booking.phone')}
              placeholder={t('booking.phonePlaceholder')}
              value={patientPhone}
              onChangeText={setPatientPhone}
              keyboardType="phone-pad"
              error={errors.phone}
              required
            />
            <Input
              label={t('booking.email')}
              placeholder={t('booking.emailPlaceholder')}
              value={patientEmail}
              onChangeText={setPatientEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <Input
              label={t('booking.notes')}
              placeholder={t('booking.notesPlaceholder')}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>
        );

      case 4:
        return (
          <View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16, textAlign: isRTL ? 'right' : 'left' }}>
              {t('booking.reviewBooking')}
            </Text>
            <Card variant="outlined">
              <View style={{ gap: 12 }}>
                <View style={[
                  { flexDirection: 'row', justifyContent: 'space-between' },
                  needsManualRTL && { flexDirection: 'row' },
                ]}>
                  <Text style={{ color: colors.textMuted }}>{t('booking.service')}</Text>
                  <Text style={{ fontWeight: '600', color: colors.text, textAlign: needsManualRTL ? 'left' : 'right' }}>{booking.serviceName}</Text>
                </View>
                <View style={[
                  { flexDirection: 'row', justifyContent: 'space-between' },
                  needsManualRTL && { flexDirection: 'row' },
                ]}>
                  <Text style={{ color: colors.textMuted }}>{t('booking.date')}</Text>
                  <Text style={{ fontWeight: '600', color: colors.text, textAlign: needsManualRTL ? 'left' : 'right' }}>{booking.selectedDate}</Text>
                </View>
                <View style={{ flexDirection: isRTL ? 'row' : 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.textMuted }}>{t('booking.time')}</Text>
                  <Text style={{ fontWeight: '600', color: colors.text, textAlign: needsManualRTL ? 'left' : 'right' }}>{booking.selectedTime}</Text>
                </View>
                <View style={{ flexDirection: isRTL ? 'row' : 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.textMuted }}>{t('booking.patient')}</Text>
                  <Text style={{ fontWeight: '600', color: colors.text }}>{booking.patientName}</Text>
                </View>
                <View style={{ flexDirection: isRTL ? 'row' : 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.textMuted }}>{t('booking.phone')}</Text>
                  <Text style={{ fontWeight: '600', color: colors.text }}>{booking.patientPhone}</Text>
                </View>
                {booking.servicePrice && (
                  <View style={{ flexDirection: isRTL ? 'row' : 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
                    <Text style={{ color: colors.text, fontWeight: '500' }}>{t('booking.price')}</Text>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary }}>${booking.servicePrice}</Text>
                  </View>
                )}
              </View>
            </Card>
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          needsManualRTL && { flexDirection: 'row' },
        ]}
      >
        <TouchableOpacity onPress={handleClose}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '600', color: colors.text }}>
          {t('booking.title')}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Progress Steps */}
      <View
        style={[
          {
            flexDirection: 'row',
            padding: 16,
            gap: 8,
          },
          needsManualRTL && { flexDirection: 'row' },
        ]}
      >
        {steps.map((step, index) => (
          <View key={step.key} style={{ flex: 1, alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                height: 4,
                borderRadius: 2,
                backgroundColor: currentStep >= step.key ? colors.primary : colors.border,
              }}
            />
            <Text
              style={{
                fontSize: 10,
                marginTop: 6,
                color: currentStep >= step.key ? colors.primary : colors.textMuted,
              }}
              numberOfLines={1}
            >
              {step.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            paddingBottom: insets.bottom + 16,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            flexDirection: 'row',
            gap: 12,
          },
          needsManualRTL && { flexDirection: 'row' },
        ]}
      >
        {currentStep > 1 && (
          <Button
            title={t('common.back')}
            onPress={previousStep}
            variant="outline"
          />
        )}
        <View style={{ flex: 1 }}>
          {currentStep < 4 ? (
            <Button
              title={t('common.next')}
              onPress={handleNextStep}
              fullWidth
            />
          ) : (
            <Button
              title={t('booking.confirmBooking')}
              onPress={handleConfirmBooking}
              loading={isSubmitting}
              fullWidth
            />
          )}
        </View>
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={t('booking.bookingSuccess')}
        message={t('booking.bookingSuccessMessage')}
        primaryButtonText={t('booking.viewAppointments')}
        secondaryButtonText={t('booking.bookAnother')}
        onPrimaryPress={() => {
          resetBooking();
          router.replace('/(tabs)/appointments');
        }}
        onSecondaryPress={() => {
          resetBooking();
          router.replace('/(tabs)/book');
        }}
      />
    </View>
  );
}
