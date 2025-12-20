import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentsApi, Appointment } from '../../services/appointments';
import { AppointmentCard } from '../../components/AppointmentCard';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';

type Tab = 'upcoming' | 'past';

export default function AppointmentsScreen() {
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const { isAuthenticated, isGuest } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    if (!isAuthenticated && !isGuest) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const data = activeTab === 'upcoming'
        ? await appointmentsApi.getUpcoming()
        : await appointmentsApi.getPast();
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.server'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeTab, isAuthenticated, isGuest, t]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadAppointments();
  };

  const handleAppointmentPress = (appointment: Appointment) => {
    router.push(`/appointment/${appointment.id}`);
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated && !isGuest) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <EmptyState
          icon="calendar-outline"
          title={t('appointments.noAppointments')}
          subtitle={t('profile.guestMessage')}
          actionLabel={t('profile.login')}
          onAction={() => router.push('/login')}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Tab Selector */}
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          padding: 16,
          gap: 12,
        }}
      >
        {(['upcoming', 'past'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setActiveTab(tab);
              setIsLoading(true);
            }}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor:
                activeTab === tab ? colors.primary : colors.surface,
              alignItems: 'center',
              borderWidth: activeTab === tab ? 0 : 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: activeTab === tab ? colors.white : colors.text,
              }}
            >
              {t(`appointments.${tab}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={loadAppointments} />
      ) : (
        <ScrollView
          contentContainerStyle={{ 
            paddingHorizontal: 16, 
            paddingBottom: 20,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {appointments.length === 0 ? (
            <EmptyState
              icon="calendar-outline"
              title={activeTab === 'upcoming' 
                ? t('appointments.noUpcoming') 
                : t('appointments.noPast')}
              subtitle={t('appointments.noAppointmentsSubtitle')}
              actionLabel={t('home.bookNow')}
              onAction={() => router.push('/(tabs)/book')}
            />
          ) : (
            appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                variant={activeTab}
                onPress={() => handleAppointmentPress(appointment)}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
