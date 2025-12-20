import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../contexts/LanguageContext';
import { StatusBadge } from './ui/StatusBadge';
import { Patient } from '../data/patients';

interface PatientCardProps {
  patient: Patient;
  onPress?: () => void;
}

export function PatientCard({ patient, onPress }: PatientCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // Only apply manual RTL for flex direction if native RTL is NOT handling it
  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow },
      ]}
    >
      <View style={[styles.row, needsManualRTL && styles.rtlRow]}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.initials, { color: colors.primary }]}>
            {getInitials(patient.name)}
          </Text>
        </View>
        <View style={[styles.info, isRTL && { alignItems: 'flex-end' }]}>
          <View style={[styles.nameRow, needsManualRTL && styles.rtlRow]}>
            <Text style={[styles.name, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
              {patient.name}
            </Text>
            <StatusBadge status={patient.status} size="sm" />
          </View>
          <View style={[styles.details, needsManualRTL && styles.rtlRow]}>
            <View style={[styles.detailItem, needsManualRTL && styles.rtlRow]}>
              <Ionicons name="call-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {patient.phone}
              </Text>
            </View>
            <View style={[styles.detailItem, needsManualRTL && styles.rtlRow]}>
              <Ionicons name="water-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {patient.bloodType}
              </Text>
            </View>
          </View>
        </View>
        <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 14,
  },
  initials: {
    fontSize: 18,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
  },
});
