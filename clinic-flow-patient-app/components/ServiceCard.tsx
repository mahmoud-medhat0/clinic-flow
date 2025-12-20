import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, useTranslation } from '../contexts/LanguageContext';
import type { Service } from '../services/clinics';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onPress: () => void;
}

export function ServiceCard({ service, selected, onPress }: ServiceCardProps) {
  const { colors } = useTheme();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: selected ? colors.primaryLight : colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.primary : colors.border,
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: 4,
          }}
        >
          {service.name}
        </Text>
        
        {service.description && (
          <Text
            style={{
              fontSize: 13,
              color: colors.textSecondary,
              textAlign: isRTL ? 'right' : 'left',
              marginBottom: 8,
            }}
            numberOfLines={2}
          >
            {service.description}
          </Text>
        )}
        
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                marginLeft: isRTL ? 0 : 4,
                marginRight: isRTL ? 4 : 0,
              }}
            >
              {service.duration} {t('booking.minutes')}
            </Text>
          </View>
          
          <Text
            style={{
              fontSize: 15,
              fontWeight: '700',
              color: colors.primary,
            }}
          >
            ${service.price}
          </Text>
        </View>
      </View>

      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: selected ? colors.primary : colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: isRTL ? 0 : 12,
          marginRight: isRTL ? 12 : 0,
        }}
      >
        {selected && (
          <Ionicons name="checkmark" size={18} color={colors.white} />
        )}
      </View>
    </TouchableOpacity>
  );
}
