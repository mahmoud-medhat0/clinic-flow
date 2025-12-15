import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { AppointmentStatus } from '../../data/appointments';

interface StatusBadgeProps {
  status: AppointmentStatus | 'active' | 'inactive' | 'inStock' | 'lowStock' | 'outOfStock' | 'in' | 'out';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const getStatusConfig = () => {
    switch (status) {
      case 'confirmed':
      case 'active':
      case 'inStock':
      case 'in':
        return {
          bg: colors.successLight,
          text: colors.success,
          label: status === 'in' ? t('inventory.stockIn') : 
                 status === 'inStock' ? t('inventory.inStock') :
                 status === 'active' ? t('patients.active') : t('status.confirmed'),
        };
      case 'pending':
      case 'lowStock':
        return {
          bg: colors.warningLight,
          text: colors.warning,
          label: status === 'lowStock' ? t('inventory.lowStock') : t('status.pending'),
        };
      case 'canceled':
      case 'inactive':
      case 'outOfStock':
      case 'out':
        return {
          bg: colors.dangerLight,
          text: colors.danger,
          label: status === 'out' ? t('inventory.stockOut') :
                 status === 'outOfStock' ? t('inventory.outOfStock') :
                 status === 'inactive' ? t('patients.inactive') : t('status.canceled'),
        };
      case 'completed':
        return {
          bg: colors.primaryLight,
          text: colors.primary,
          label: t('status.completed'),
        };
      default:
        return {
          bg: colors.surfaceSecondary,
          text: colors.textSecondary,
          label: status,
        };
    }
  };

  const config = getStatusConfig();
  const paddingH = size === 'sm' ? 8 : 12;
  const paddingV = size === 'sm' ? 4 : 6;
  const fontSize = size === 'sm' ? 11 : 13;

  return (
    <View
      style={{
        backgroundColor: config.bg,
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
        borderRadius: 20,
      }}
    >
      <Text
        style={{
          color: config.text,
          fontSize: fontSize,
          fontWeight: '600',
        }}
      >
        {config.label}
      </Text>
    </View>
  );
}
