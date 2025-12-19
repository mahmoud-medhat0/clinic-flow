import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../contexts/LanguageContext';
import { StatusBadge } from './ui/StatusBadge';
import { Appointment, AppointmentType } from '../data/appointments';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
  compact?: boolean;
}

export function AppointmentCard({ appointment, onPress, compact = false }: AppointmentCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const getTypeIcon = (type: AppointmentType): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'checkup': return 'fitness-outline';
      case 'followup': return 'refresh-outline';
      case 'consultation': return 'chatbubble-outline';
      case 'vaccination': return 'medkit-outline';
      case 'labResults': return 'document-text-outline';
      default: return 'calendar-outline';
    }
  };

  const getTypeLabel = (type: AppointmentType): string => {
    const key = `appointments.${type}` as const;
    return t(key);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const m = parseInt(minutes);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
  };

  if (compact) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[
          styles.compactContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
          isRTL && styles.rtlRow,
        ]}
      >
        <View style={[styles.timeContainer, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.time, { color: colors.primary }]}>{formatTime(appointment.time)}</Text>
        </View>
        <View style={styles.compactInfo}>
          <Text style={[styles.patientName, { color: colors.text }]} numberOfLines={1}>
            {appointment.patientName}
          </Text>
          <Text style={[styles.type, { color: colors.textSecondary }]}>
            {getTypeLabel(appointment.type)}
          </Text>
        </View>
        <StatusBadge status={appointment.status} size="sm" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow },
      ]}
    >
      <View style={[styles.header, isRTL && styles.rtlRow]}>
        <View style={[styles.row, isRTL && styles.rtlRow]}>
          <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }, isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }]}>
            <Ionicons name={getTypeIcon(appointment.type)} size={20} color={colors.primary} />
          </View>
          <View style={[styles.headerInfo, isRTL && { alignItems: 'flex-end' }]}>
            <Text style={[styles.patientName, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
              {appointment.patientName}
            </Text>
            <Text style={[styles.type, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {getTypeLabel(appointment.type)}
            </Text>
          </View>
        </View>
        <StatusBadge status={appointment.status} />
      </View>
      <View style={[styles.footer, { borderTopColor: colors.border }, isRTL && styles.rtlRow]}>
        <View style={[styles.footerItem, isRTL && styles.rtlRow]}>
          <Ionicons name="time-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {formatTime(appointment.time)}
          </Text>
        </View>
        <View style={[styles.footerItem, isRTL && styles.rtlRow]}>
          <Ionicons name="hourglass-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {appointment.duration} {t('appointments.minutes')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  timeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
  },
  compactInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  type: {
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 24,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
  },
});
