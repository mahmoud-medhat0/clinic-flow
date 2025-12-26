import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, I18nManager } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useBooking } from '../../contexts/BookingContext';
import { clinicsApi, Clinic, Service } from '../../services/clinics';
import { ServiceCard } from '../../components/ServiceCard';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { Card } from '../../components/ui/Card';

export default function BookScreen() {
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const { booking, setClinic, setService, resetBooking } = useBooking();

  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(booking.clinicId);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(booking.serviceId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClinics();
  }, []);

  useEffect(() => {
    if (selectedClinicId) {
      loadServices(selectedClinicId);
    } else {
      setServices([]);
    }
  }, [selectedClinicId]);

  const loadClinics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await clinicsApi.getAll();
      setClinics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.server'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadServices = async (clinicId: string) => {
    try {
      const data = await clinicsApi.getServices(clinicId);
      setServices(data);
    } catch (err) {
      console.error('Failed to load services', err);
    }
  };

  const handleClinicSelect = (clinic: Clinic) => {
    setSelectedClinicId(clinic.id);
    setClinic(clinic.id, clinic.name);
    setSelectedServiceId(null);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedServiceId(service.id);
    setService(service.id, service.name, service.price, service.duration);
  };

  const handleContinue = () => {
    if (selectedClinicId && selectedServiceId) {
      router.push('/booking');
    }
  };

  const handleReset = () => {
    resetBooking();
    setSelectedClinicId(null);
    setSelectedServiceId(null);
    setServices([]);
  };

  if (isLoading) {
    return <LoadingState fullScreen />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadClinics} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Select Clinic */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.text,
              marginBottom: 12,
              textAlign: needsManualRTL ? 'right' : 'left',
            }}
          >
            1. {t('booking.selectService').split('?')[0]}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            style={{ marginHorizontal: -16, paddingHorizontal: 16 }}
          >
            {clinics.map((clinic) => (
              <TouchableOpacity
                key={clinic.id}
                onPress={() => handleClinicSelect(clinic)}
                style={{
                  backgroundColor:
                    selectedClinicId === clinic.id
                      ? colors.primary
                      : colors.surface,
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  borderWidth: selectedClinicId === clinic.id ? 0 : 1,
                  borderColor: colors.border,
                  minWidth: 140,
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="medical"
                  size={24}
                  color={
                    selectedClinicId === clinic.id
                      ? colors.white
                      : colors.primary
                  }
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color:
                      selectedClinicId === clinic.id
                        ? colors.white
                        : colors.text,
                    marginTop: 8,
                    textAlign: 'center',
                  }}
                  numberOfLines={2}
                >
                  {clinic.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Step 2: Select Service */}
        {selectedClinicId && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 12,
                textAlign: needsManualRTL ? 'right' : 'left',
              }}
            >
              2. {t('booking.selectService')}
            </Text>

            {services.length === 0 ? (
              <Card>
                <Text
                  style={{
                    color: colors.textMuted,
                    textAlign: 'center',
                    padding: 20,
                  }}
                >
                  {t('common.loading')}
                </Text>
              </Card>
            ) : (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={selectedServiceId === service.id}
                  onPress={() => handleServiceSelect(service)}
                />
              ))
            )}
          </View>
        )}

        {/* Empty State */}
        {clinics.length === 0 && !isLoading && (
          <EmptyState
            icon="medical-outline"
            title={t('home.noClinics')}
            subtitle={t('home.noClinicsSubtitle')}
          />
        )}
      </ScrollView>

      {/* Bottom Action */}
      {selectedClinicId && selectedServiceId && (
        <View
          style={[
            {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            flexDirection: 'row',
            gap: 12,
          },
          needsManualRTL && { flexDirection: 'row-reverse' },
        ]}
        >
          <TouchableOpacity
            onPress={handleReset}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              backgroundColor: colors.surfaceSecondary,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>
              {t('common.cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleContinue}
            style={{
              flex: 2,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              backgroundColor: colors.primary,
            }}
          >
            <Text style={{ color: colors.white, fontWeight: '600', fontSize: 15 }}>
              {t('common.next')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
