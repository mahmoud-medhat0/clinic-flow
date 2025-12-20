import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, useTranslation } from '../contexts/LanguageContext';
import { Card } from './ui/Card';
import type { Appointment } from '../services/appointments';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: () => void;
  variant?: 'upcoming' | 'past';
}

export function AppointmentCard({ appointment, onPress, variant = 'upcoming' }: AppointmentCardProps) {
  const { colors } = useTheme();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();

  const getStatusColor = () => {
    switch (appointment.status) {
      case 'confirmed': return colors.success;
      case 'pending': return colors.warning;
      case 'cancelled': return colors.danger;
      case 'completed': return colors.teal;
      default: return colors.textMuted;
    }
  };

  const getStatusBgColor = () => {
    switch (appointment.status) {
      case 'confirmed': return colors.successLight;
      case 'pending': return colors.warningLight;
      case 'cancelled': return colors.dangerLight;
      case 'completed': return colors.tealLight;
      default: return colors.surfaceSecondary;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card variant="elevated" style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          {/* Clinic Image */}
          <Image
            source={{ uri: appointment.clinic.image }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />

          {/* Content */}
          <View
            style={{
              flex: 1,
              marginLeft: isRTL ? 0 : 12,
              marginRight: isRTL ? 12 : 0,
            }}
          >
            {/* Status Badge */}
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  backgroundColor: getStatusBgColor(),
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: getStatusColor(),
                    textTransform: 'capitalize',
                  }}
                >
                  {t(`status.${appointment.status}`)}
                </Text>
              </View>
              
              <Ionicons
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={20}
                color={colors.textMuted}
              />
            </View>

            {/* Service Name */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
                textAlign: isRTL ? 'right' : 'left',
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {appointment.service.name}
            </Text>

            {/* Clinic Name */}
            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                textAlign: isRTL ? 'right' : 'left',
                marginBottom: 8,
              }}
              numberOfLines={1}
            >
              {appointment.clinic.name}
            </Text>

            {/* Date and Time */}
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <View
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={colors.primary}
                />
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.text,
                    fontWeight: '500',
                    marginLeft: isRTL ? 0 : 4,
                    marginRight: isRTL ? 4 : 0,
                  }}
                >
                  {formatDate(appointment.date)}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={colors.primary}
                />
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.text,
                    fontWeight: '500',
                    marginLeft: isRTL ? 0 : 4,
                    marginRight: isRTL ? 4 : 0,
                  }}
                >
                  {appointment.time}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
