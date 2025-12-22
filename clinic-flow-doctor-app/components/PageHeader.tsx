import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

export function PageHeader({ title, subtitle, icon, rightAction }: PageHeaderProps) {
  const { colors, isDark } = useTheme();
  const { isRTL } = useLanguage();
  const needsManualRTL = isRTL && !I18nManager.isRTL;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={[styles.header, needsManualRTL && styles.rtlRow]}>
          <View style={[styles.content, needsManualRTL && { alignItems: 'flex-end' }]}>
            <View style={[styles.titleRow, needsManualRTL && styles.rtlRow]}>
              {icon && (
                <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name={icon} size={22} color={colors.primary} />
                </View>
              )}
              <View>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                {subtitle && (
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
                )}
              </View>
            </View>
          </View>
          
          {rightAction && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primaryLight }]}
              onPress={rightAction.onPress}
            >
              <Ionicons name={rightAction.icon} size={22} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.accentBar, { backgroundColor: colors.primary }]} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
  },
  safeArea: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accentBar: {
    height: 3,
    borderRadius: 2,
    marginHorizontal: 20,
    marginBottom: 8,
  },
});
