import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onPress?: () => void;
}

export function StatCard({ title, value, icon, color, trend, onPress }: StatCardProps) {
  const { colors, isDark } = useTheme();
  const { isRTL } = useLanguage();
  const iconColor = color || colors.primary;

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={[styles.header, isRTL && styles.rtlHeader]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: isDark ? `${iconColor}20` : `${iconColor}15` },
          ]}
        >
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>
        {trend && (
          <View style={[styles.trendContainer, isRTL && styles.rtlTrendContainer]}>
            <Ionicons
              name={trend.isPositive ? 'arrow-up' : 'arrow-down'}
              size={12}
              color={trend.isPositive ? colors.success : colors.danger}
            />
            <Text
              style={[
                styles.trendText,
                { color: trend.isPositive ? colors.success : colors.danger },
              ]}
            >
              {trend.value}%
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.value, { color: colors.text  }]}>{value}</Text>
      <Text style={[styles.title, { color: colors.textSecondary  }]}>{title}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.touchable}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rtlHeader: {
    flexDirection: 'row-reverse',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rtlTrendContainer: {
    flexDirection: 'row-reverse',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
  },
});
