import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  I18nManager,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export interface FilterOption {
  key: string;
  label: string;
  count?: number;
}

interface FilterPanelProps {
  options: FilterOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export function FilterPanel({ options, selectedKey, onSelect }: FilterPanelProps) {
  const { colors } = useTheme();
  const { isRTL } = useLanguage();
  const needsManualRTL = isRTL && !I18nManager.isRTL;

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          needsManualRTL && styles.rtlRow
        ]}
      >
        {options.map((option) => {
          const isSelected = selectedKey === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.tab,
                isSelected && { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => onSelect(option.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isSelected ? colors.primary : colors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
              {option.count !== undefined && (
                <View style={[
                  styles.badge,
                  { backgroundColor: isSelected ? colors.primary : colors.textMuted }
                ]}>
                  <Text style={styles.badgeText}>{option.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 4,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 4,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
    minHeight: 40,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
