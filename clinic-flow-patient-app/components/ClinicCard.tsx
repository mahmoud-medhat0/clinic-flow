import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, useTranslation } from '../contexts/LanguageContext';
import { Card } from './ui/Card';
import type { Clinic } from '../services/clinics';

interface ClinicCardProps {
  clinic: Clinic;
  onPress: () => void;
  onBookPress?: () => void;
}

export function ClinicCard({ clinic, onPress, onBookPress }: ClinicCardProps) {
  const { colors } = useTheme();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card variant="elevated" padding="none" style={{ marginBottom: 16 }}>
        {/* Clinic Image */}
        <Image
          source={{ uri: clinic.image }}
          style={{
            width: '100%',
            height: 140,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
          resizeMode="cover"
        />
        
        {/* Open/Closed Badge */}
        <View
          style={{
            position: 'absolute',
            top: 12,
            [isRTL ? 'left' : 'right']: 12,
            backgroundColor: clinic.isOpen ? colors.success : colors.danger,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: colors.white, fontSize: 12, fontWeight: '600' }}>
            {clinic.isOpen ? t('clinic.openNow') : t('clinic.closed')}
          </Text>
        </View>

        {/* Content */}
        <View style={{ padding: 16 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.text,
              marginBottom: 6,
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            {clinic.name}
          </Text>

          {/* Rating */}
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.text,
                marginHorizontal: 4,
              }}
            >
              {clinic.rating.toFixed(1)}
            </Text>
            <Text style={{ fontSize: 12, color: colors.textMuted }}>
              ({clinic.reviewCount})
            </Text>
          </View>

          {/* Address */}
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Ionicons
              name="location-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginLeft: isRTL ? 0 : 6,
                marginRight: isRTL ? 6 : 0,
                flex: 1,
                textAlign: isRTL ? 'right' : 'left',
              }}
              numberOfLines={1}
            >
              {clinic.address}
            </Text>
          </View>

          {/* Services Preview */}
          {clinic.services?.length > 0 && (
            <View
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                flexWrap: 'wrap',
                gap: 6,
                marginBottom: 12,
              }}
            >
              {clinic.services.slice(0, 3).map((service) => (
                <View
                  key={service.id}
                  style={{
                    backgroundColor: colors.primaryLight,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.primary,
                      fontWeight: '500',
                    }}
                  >
                    {service.name}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Book Button */}
          {onBookPress && (
            <TouchableOpacity
              onPress={onBookPress}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.white, fontWeight: '600', fontSize: 15 }}>
                {t('home.bookNow')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}
