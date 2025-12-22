import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  I18nManager,
  useWindowDimensions,
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
  const { width: screenWidth } = useWindowDimensions();
  const needsManualRTL = isRTL && !I18nManager.isRTL;

  // Estimate if tabs will fit: ~80px per tab minimum, plus padding
  const estimatedTabWidth = 80;
  const availableWidth = screenWidth - 32; // minus horizontal margins
  const useScroll = options.length * estimatedTabWidth > availableWidth;

  const TabContent = () => (
    <>
      {options.map((option) => {
        const isSelected = selectedKey === option.key;
        return (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.tab,
              !useScroll && styles.tabFlex,
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
    </>
  );

  if (useScroll) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: colors.surface },
          needsManualRTL && styles.rtlRow
        ]}
        style={styles.scrollView}
      >
        <TabContent />
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }, needsManualRTL && styles.rtlRow]}>
      <TabContent />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  scrollContent: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    gap: 4,
  },
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 4,
    borderRadius: 12,
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
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  tabFlex: {
    flex: 1,
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
