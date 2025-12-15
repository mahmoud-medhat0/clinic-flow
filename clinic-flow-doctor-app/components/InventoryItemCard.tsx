import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useLanguage } from '../contexts/LanguageContext';
import { StatusBadge } from './ui/StatusBadge';
import { InventoryItem, getStockStatus } from '../data/inventory';

interface InventoryItemCardProps {
  item: InventoryItem;
  categoryName?: string;
  onPress?: () => void;
}

export function InventoryItemCard({ item, categoryName, onPress }: InventoryItemCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const stockStatus = getStockStatus(item);
  const displayName = language === 'ar' && item.nameAr ? item.nameAr : item.name;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {displayName}
          </Text>
          {categoryName && (
            <Text style={[styles.category, { color: colors.textSecondary }]}>
              {categoryName}
            </Text>
          )}
        </View>
        <StatusBadge status={stockStatus} />
      </View>

      <View style={[styles.details, { borderTopColor: colors.border }]}>
        <View style={styles.detailItem}>
          <Ionicons name="barcode-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {item.barcode}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cube-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {item.quantity} {t(`inventory.${item.unit}`)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="pricetag-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            ${item.sellPrice}
          </Text>
        </View>
      </View>

      {stockStatus === 'lowStock' && (
        <View style={[styles.alert, { backgroundColor: colors.warningLight }]}>
          <Ionicons name="warning-outline" size={14} color={colors.warning} />
          <Text style={[styles.alertText, { color: colors.warning }]}>
            {t('inventory.lowStock')}: {item.quantity} / {item.minStock}
          </Text>
        </View>
      )}
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
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
  },
  details: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  alertText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
