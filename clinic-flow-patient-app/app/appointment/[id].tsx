import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Linking, I18nManager } from 'react-native';
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

  const needsManualRTL = isRTL && !I18nManager.isRTL;

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
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          {/* Status Badge */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View 
              style={{ 
                backgroundColor: getStatusBg(), 
                paddingHorizontal: 24, 
                paddingVertical: 12, 
                borderRadius: 24,
                shadowColor: getStatusColor(),
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text 
                style={{ 
                  fontSize: 15, 
                  fontWeight: '700', 
                  color: getStatusColor(), 
                  textTransform: 'capitalize',
                  letterSpacing: 0.5,
                }}
              >
                {t(`status.${appointment.status}`)}
              </Text>
            </View>
          </View>

          {/* Service Info */}
          <Card 
            variant="elevated" 
            style={{ 
              marginBottom: 20,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View 
                style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 40, 
                  backgroundColor: `${colors.primary}15`, 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: 16,
                  borderWidth: 3,
                  borderColor: `${colors.primary}30`,
                }}
              >
                <Ionicons name="medical" size={40} color={colors.primary} />
              </View>
              <Text 
                style={{ 
                  fontSize: 22, 
                  fontWeight: '700', 
                  color: colors.text, 
                  textAlign: 'center',
                  marginBottom: 6,
                  letterSpacing: 0.3,
                }}
              >
                {appointment.service.name}
              </Text>
              <Text 
                style={{ 
                  fontSize: 15, 
                  color: colors.textSecondary, 
                  fontWeight: '500',
                }}
              >
                {appointment.clinic.name}
              </Text>
            </View>

            {/* Date & Time */}
            <View 
              style={[
                { 
                  flexDirection: 'row', 
                  gap: 12, 
                  marginBottom: 20,
                },
                needsManualRTL && { flexDirection: 'row' },
              ]}
            >
              <View 
                style={{ 
                  flex: 1, 
                  backgroundColor: colors.surfaceSecondary, 
                  padding: 16, 
                  borderRadius: 16, 
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: `${colors.primary}20`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Ionicons name="calendar-outline" size={22} color={colors.primary} />
                </View>
                <Text 
                  style={{ 
                    fontSize: 13, 
                    fontWeight: '600', 
                    color: colors.text, 
                    textAlign: 'center',
                    lineHeight: 18,
                  }}
                  numberOfLines={2}
                >
                  {formatDate(appointment.date)}
                </Text>
              </View>
              <View 
                style={{ 
                  flex: 1, 
                  backgroundColor: colors.surfaceSecondary, 
                  padding: 16, 
                  borderRadius: 16, 
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: `${colors.primary}20`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Ionicons name="time-outline" size={22} color={colors.primary} />
                </View>
                <Text 
                  style={{ 
                    fontSize: 20, 
                    fontWeight: '700', 
                    color: colors.text,
                    marginBottom: 4,
                  }}
                >
                  {appointment.time}
                </Text>
                <Text 
                  style={{ 
                    fontSize: 12, 
                    color: colors.textMuted,
                    fontWeight: '500',
                  }}
                >
                  {appointment.service.duration} {t('booking.minutes')}
                </Text>
              </View>
            </View>

            {/* Price */}
            <View 
              style={[
                { 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 20, 
                  borderTopWidth: 1.5, 
                  borderTopColor: colors.border,
                },
                needsManualRTL && { flexDirection: 'row' },
              ]}
            >
              <Text 
                style={{ 
                  fontSize: 16, 
                  color: colors.textSecondary,
                  fontWeight: '600',
                }}
              >
                {t('booking.price')}
              </Text>
              <Text 
                style={{ 
                  fontSize: 24, 
                  fontWeight: '800', 
                  color: colors.primary,
                  letterSpacing: 0.5,
                }}
              >
                ${appointment.service.price}
              </Text>
            </View>
          </Card>

          {/* Clinic Info */}
          <Card 
            variant="outlined" 
            style={{ 
              marginBottom: 16,
              borderWidth: 1.5,
            }}
          >
            <Text 
              style={{ 
                fontSize: 17, 
                fontWeight: '700', 
                color: colors.text, 
                marginBottom: 16, 
                textAlign: needsManualRTL ? 'left' : 'right',
                letterSpacing: 0.3,
              }}
            >
              {t('clinic.details')}
            </Text>
            <TouchableOpacity 
              onPress={handleCallClinic} 
              style={[
                { 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  backgroundColor: colors.surfaceSecondary,
                  padding: 16,
                  borderRadius: 12,
                },
                needsManualRTL && { flexDirection: 'row' },
              ]}
            >
              <View 
                style={{ 
                  width: 56, 
                  height: 56, 
                  borderRadius: 16, 
                  backgroundColor: `${colors.primary}15`, 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: `${colors.primary}30`,
                }}
              >
                <Ionicons name="medical" size={28} color={colors.primary} />
              </View>
              <View 
                style={[
                  { flex: 1 },
                  needsManualRTL ? { marginRight: 16 } : { marginLeft: 16 },
                ]}
              >
                <Text 
                  style={{ 
                    fontSize: 16, 
                    fontWeight: '700', 
                    color: colors.text, 
                    textAlign: needsManualRTL ? 'right' : 'left',
                    marginBottom: 4,
                  }}
                >
                  {appointment.clinic.name}
                </Text>
                <Text 
                  style={{ 
                    fontSize: 13, 
                    color: colors.textSecondary, 
                    textAlign: needsManualRTL ? 'right' : 'left',
                    lineHeight: 18,
                  }}
                >
                  {appointment.clinic.address}
                </Text>
              </View>
              <View 
                style={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: 22, 
                  backgroundColor: colors.tealLight, 
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="call" size={20} color={colors.teal} />
              </View>
            </TouchableOpacity>
          </Card>

          {/* Doctor Info (if assigned) */}
          {appointment.doctor && (
            <Card 
              variant="outlined" 
              style={{ 
                marginBottom: 16,
                borderWidth: 1.5,
              }}
            >
              <Text 
                style={{ 
                  fontSize: 17, 
                  fontWeight: '700', 
                  color: colors.text, 
                  marginBottom: 16, 
                  textAlign: needsManualRTL ? 'left' : 'right',
                  letterSpacing: 0.3,
                }}
              >
                {t('booking.doctor')}
              </Text>
              <View 
                style={[
                  { 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    backgroundColor: colors.surfaceSecondary,
                    padding: 16,
                    borderRadius: 12,
                  },
                  needsManualRTL && { flexDirection: 'row' },
                ]}
              >
                <View 
                  style={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 28, 
                    backgroundColor: colors.tealLight, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: `${colors.teal}30`,
                  }}
                >
                  <Ionicons name="person" size={28} color={colors.teal} />
                </View>
                <View 
                  style={[
                    { flex: 1 },
                    needsManualRTL ? { marginRight: 16 } : { marginLeft: 16 },
                  ]}
                >
                  <Text 
                    style={{ 
                      fontSize: 16, 
                      fontWeight: '700', 
                      color: colors.text, 
                      textAlign: needsManualRTL ? 'right' : 'left',
                      marginBottom: 4,
                    }}
                  >
                    Dr. {appointment.doctor.name}
                  </Text>
                  <Text 
                    style={{ 
                      fontSize: 13, 
                      color: colors.textSecondary, 
                      textAlign: needsManualRTL ? 'right' : 'left',
                    }}
                  >
                    {appointment.doctor.specialty}
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Notes */}
          {appointment.notes && (
            <Card 
              variant="outlined" 
              style={{ 
                marginBottom: 24,
                borderWidth: 1.5,
                backgroundColor: `${colors.primary}05`,
              }}
            >
              <Text 
                style={{ 
                  fontSize: 17, 
                  fontWeight: '700', 
                  color: colors.text, 
                  marginBottom: 12, 
                  textAlign: needsManualRTL ? 'left' : 'right',
                  letterSpacing: 0.3,
                }}
              >
                {t('booking.notes')}
              </Text>
              <Text 
                style={{ 
                  fontSize: 14, 
                  color: colors.textSecondary, 
                  lineHeight: 22, 
                  textAlign: needsManualRTL ? 'left' : 'right',
                }}
              >
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
