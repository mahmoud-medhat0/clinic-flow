import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { appointmentsApi, Appointment } from '../../services/appointments';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const loadAppointment = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await appointmentsApi.getById(id);
      setAppointment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.server'));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!appointment) return colors.textMuted;
    switch (appointment.status) {
      case 'confirmed': return colors.success;
      case 'pending': return colors.warning;
      case 'cancelled': return colors.danger;
      case 'completed': return colors.teal;
      default: return colors.textMuted;
    }
  };

  const getStatusBg = () => {
    if (!appointment) return colors.surfaceSecondary;
    switch (appointment.status) {
      case 'confirmed': return colors.successLight;
      case 'pending': return colors.warningLight;
      case 'cancelled': return colors.dangerLight;
      case 'completed': return colors.tealLight;
      default: return colors.surfaceSecondary;
    }
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      t('appointments.cancelAppointment'),
      t('appointments.cancelConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await appointmentsApi.cancel(id!);
              loadAppointment();
            } catch (err) {
              Alert.alert(t('common.error'), t('errors.server'));
            }
          },
        },
      ]
    );
  };

  const handleCallClinic = () => {
    if (appointment?.clinic.phone) {
      Linking.openURL(`tel:${appointment.clinic.phone}`);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <LoadingState fullScreen />;
  }

  if (error || !appointment) {
    return <ErrorState message={error || t('errors.notFound')} onRetry={loadAppointment} />;
  }

  return (
    <>
      <Stack.Screen options={{ title: t('appointments.details') }} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
          {/* Status Badge */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View style={{ backgroundColor: getStatusBg(), paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: getStatusColor(), textTransform: 'capitalize' }}>
                {t(`status.${appointment.status}`)}
              </Text>
            </View>
          </View>

          {/* Service Info */}
          <Card variant="elevated" style={{ marginBottom: 16 }}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Ionicons name="medical" size={28} color={colors.primary} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center' }}>
                {appointment.service.name}
              </Text>
              <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: 4 }}>
                {appointment.clinic.name}
              </Text>
            </View>

            {/* Date & Time */}
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 16, marginBottom: 16 }}>
              <View style={{ flex: 1, backgroundColor: colors.surfaceSecondary, padding: 14, borderRadius: 12, alignItems: 'center' }}>
                <Ionicons name="calendar-outline" size={22} color={colors.primary} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 8, textAlign: 'center' }}>
                  {formatDate(appointment.date)}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: colors.surfaceSecondary, padding: 14, borderRadius: 12, alignItems: 'center' }}>
                <Ionicons name="time-outline" size={22} color={colors.primary} />
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 8 }}>
                  {appointment.time}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>
                  {appointment.service.duration} {t('booking.minutes')}
                </Text>
              </View>
            </View>

            {/* Price */}
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
              <Text style={{ fontSize: 15, color: colors.textSecondary }}>{t('booking.price')}</Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.primary }}>
                ${appointment.service.price}
              </Text>
            </View>
          </Card>

          {/* Clinic Info */}
          <Card variant="outlined" style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>
              {t('clinic.details')}
            </Text>
            <TouchableOpacity onPress={handleCallClinic} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="medical" size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, textAlign: isRTL ? 'right' : 'left' }}>
                  {appointment.clinic.name}
                </Text>
                <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }}>
                  {appointment.clinic.address}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.tealLight, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="call" size={18} color={colors.teal} />
                </View>
              </View>
            </TouchableOpacity>
          </Card>

          {/* Doctor Info (if assigned) */}
          {appointment.doctor && (
            <Card variant="outlined" style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>
                {t('booking.doctor')}
              </Text>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.tealLight, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="person" size={24} color={colors.teal} />
                </View>
                <View style={{ flex: 1, marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, textAlign: isRTL ? 'right' : 'left' }}>
                    Dr. {appointment.doctor.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }}>
                    {appointment.doctor.specialty}
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Notes */}
          {appointment.notes && (
            <Card variant="outlined" style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>
                {t('booking.notes')}
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22, textAlign: isRTL ? 'right' : 'left' }}>
                {appointment.notes}
              </Text>
            </Card>
          )}

          {/* Actions */}
          {appointment.canCancel && appointment.status !== 'cancelled' && (
            <Button
              title={t('appointments.cancelAppointment')}
              onPress={handleCancelAppointment}
              variant="danger"
              fullWidth
              icon={<Ionicons name="close-circle-outline" size={20} color="white" />}
            />
          )}
        </ScrollView>
      </View>
    </>
  );
}
