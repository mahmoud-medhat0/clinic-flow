import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { StatusBadge } from './ui/StatusBadge';
import { Patient } from '../data/patients';

interface PatientCardProps {
  patient: Patient;
  onPress?: () => void;
}

export function PatientCard({ patient, onPress }: PatientCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

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
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.initials, { color: colors.primary }]}>
            {getInitials(patient.name)}
          </Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {patient.name}
            </Text>
            <StatusBadge status={patient.status} size="sm" />
          </View>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="call-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {patient.phone}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {patient.bloodType}
              </Text>
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
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
