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
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: colors.text,
              marginBottom: 16,
              textAlign: needsManualRTL ? 'left' : 'right',
              letterSpacing: 0.3,
            }}
          >
            1. {t('booking.selectService').split('?')[0]}
          </Text>

          <View
            style={[
              {
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 16,
                marginTop: 4,
              },
              needsManualRTL && { flexDirection: 'row' },
            ]}
          >
            {clinics.map((clinic) => (
              <TouchableOpacity
                key={clinic.id}
                onPress={() => handleClinicSelect(clinic)}
                style={{
                  backgroundColor: colors.surface,
                  paddingVertical: 24,
                  paddingHorizontal: 20,
                  borderRadius: 16,
                  borderWidth: selectedClinicId === clinic.id ? 3 : 1,
                  borderColor: selectedClinicId === clinic.id ? colors.primary : colors.border,
                  flex: 1,
                  minWidth: '46%',
                  maxWidth: '48%',
                  alignItems: 'center',
                  shadowColor: selectedClinicId === clinic.id ? colors.primary : '#000',
                  shadowOffset: {
                    width: 0,
                    height: selectedClinicId === clinic.id ? 8 : 4,
                  },
                  shadowOpacity: selectedClinicId === clinic.id ? 0.3 : 0.1,
                  shadowRadius: selectedClinicId === clinic.id ? 12 : 6,
                  elevation: selectedClinicId === clinic.id ? 12 : 4,
                  transform: [{ scale: selectedClinicId === clinic.id ? 1.02 : 1 }],
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: selectedClinicId === clinic.id 
                      ? colors.primary 
                      : `${colors.primary}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Ionicons
                    name="medical"
                    size={28}
                    color={
                      selectedClinicId === clinic.id
                        ? colors.white
                        : colors.primary
                    }
                  />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: selectedClinicId === clinic.id
                      ? colors.primary
                      : colors.text,
                    marginTop: 4,
                    textAlign: 'center',
                    letterSpacing: 0.2,
                  }}
                  numberOfLines={2}
                >
                  {clinic.name}
                </Text>
                {selectedClinicId === clinic.id && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: colors.primary,
                      borderRadius: 12,
                      width: 24,
                      height: 24,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 2: Select Service */}
        {selectedClinicId && (
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 16,
                textAlign: needsManualRTL ? 'left' : 'right',
                letterSpacing: 0.3,
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
