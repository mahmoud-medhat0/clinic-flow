import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../../contexts/LanguageContext';
import { useApp } from '../../../contexts/AppContext';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { getStockStatus } from '../../../data/inventory';

export default function InventoryItemDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { getItem, getCategory, addMovement } = useApp();

  const item = getItem(Number(id));

  if (!item) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textMuted} />
          <Text style={[styles.notFoundText, { color: colors.text }]}>Item not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const category = getCategory(item.categoryId);
  const stockStatus = getStockStatus(item);
  const displayName = language === 'ar' && item.nameAr ? item.nameAr : item.name;
  const categoryName = language === 'ar' && category?.nameAr ? category.nameAr : category?.name;

  const [stockQty, setStockQty] = useState(1);

  const confirmStockIn = () => {
    const itemName = language === 'ar' && item.nameAr ? item.nameAr : item.name;
    Alert.alert(
      t('inventory.stockIn'),
      `${t('common.confirm')} ${t('inventory.stockIn').toLowerCase()} ${stockQty} ${t(`inventory.${item.unit}`)} ${t('common.of')} "${itemName}"?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.confirm'), onPress: handleStockIn },
      ]
    );
  };

  const confirmStockOut = () => {
    const itemName = language === 'ar' && item.nameAr ? item.nameAr : item.name;
    const qty = Math.min(stockQty, item.quantity);
    Alert.alert(
      t('inventory.stockOut'),
      `${t('common.confirm')} ${t('inventory.stockOut').toLowerCase()} ${qty} ${t(`inventory.${item.unit}`)} ${t('common.of')} "${itemName}"?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.confirm'), style: 'destructive', onPress: handleStockOut },
      ]
    );
  };

  const handleStockIn = () => {
    addMovement({
      itemId: item.id,
      type: 'in',
      quantity: stockQty,
      date: new Date().toISOString().split('T')[0],
      notes: 'Stock added',
    });
    setStockQty(1);
  };

  const handleStockOut = () => {
    if (item.quantity > 0) {
      addMovement({
        itemId: item.id,
        type: 'out',
        quantity: Math.min(stockQty, item.quantity),
        date: new Date().toISOString().split('T')[0],
        notes: 'Stock removed',
      });
      setStockQty(1);
    }
  };

  const InfoRow = ({
    icon,
    label,
    value,
    valueColor,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    valueColor?: string;
  }) => (
    <View style={[styles.infoRow, isRTL && styles.rtlRow]}>
      <View style={[styles.infoIcon, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: valueColor || colors.text }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: displayName,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView 
          style={styles.container} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
          {/* Header Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.headerRow}>
              <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="cube" size={32} color={colors.primary} />
              </View>
              <View style={styles.headerInfo}>
                <Text style={[styles.itemName, { color: colors.text }]}>{displayName}</Text>
                {categoryName && (
                  <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
                    {categoryName}
                  </Text>
                )}
              </View>
              <StatusBadge status={stockStatus} />
            </View>
          </View>

          {/* Stock Info Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.stockHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('inventory.currentStock')}
              </Text>
              <View style={styles.stockBadge}>
                <Text
                  style={[
                    styles.stockValue,
                    {
                      color:
                        stockStatus === 'outOfStock'
                          ? colors.danger
                          : stockStatus === 'lowStock'
                          ? colors.warning
                          : colors.success,
                    },
                  ]}
                >
                  {item.quantity}
                </Text>
                <Text style={[styles.stockUnit, { color: colors.textSecondary }]}>
                  {t(`inventory.${item.unit}`)}
                </Text>
              </View>
            </View>
            <View style={[styles.stockBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.stockFill,
                  {
                    width: `${Math.min((item.quantity / (item.minStock * 2)) * 100, 100)}%`,
                    backgroundColor:
                      stockStatus === 'outOfStock'
                        ? colors.danger
                        : stockStatus === 'lowStock'
                        ? colors.warning
                        : colors.success,
                  },
                ]}
              />
            </View>
            <Text style={[styles.minStockText, { color: colors.textMuted }]}>
              {t('inventory.minStock')}: {item.minStock} {t(`inventory.${item.unit}`)}
            </Text>
          </View>

          {/* Details Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <InfoRow icon="barcode-outline" label={t('inventory.barcode')} value={item.barcode} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow
              icon="pricetag-outline"
              label={t('inventory.costPrice')}
              value={`$${item.costPrice}`}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow
              icon="cash-outline"
              label={t('inventory.sellPrice')}
              value={`$${item.sellPrice}`}
              valueColor={colors.success}
            />
          </View>

          {/* Barcode Display */}
          <View style={[styles.barcodeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.barcodeLines}>
              {Array.from({ length: 30 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.barcodeLine,
                    { 
                      backgroundColor: colors.text, 
                      width: Math.random() > 0.5 ? 2 : 1,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.barcodeText, { color: colors.text }]}>{item.barcode}</Text>
          </View>
        </ScrollView>

        {/* Quantity Input & Action Buttons */}
        <View style={[styles.actions, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={styles.quantityRow}>
            <Text style={[styles.quantityLabel, { color: colors.text }]}>
              {t('inventory.quantity')}:
            </Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[styles.qtyBtn, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => setStockQty(Math.max(1, stockQty - 1))}
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </TouchableOpacity>
              <TextInput
                style={[styles.qtyInput, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border }]}
                value={stockQty.toString()}
                onChangeText={(text) => setStockQty(Math.max(1, parseInt(text) || 1))}
                keyboardType="numeric"
                textAlign="center"
              />
              <TouchableOpacity
                style={[styles.qtyBtn, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => setStockQty(stockQty + 1)}
              >
                <Ionicons name="add" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.successLight }]}
              onPress={confirmStockIn}
            >
              <Ionicons name="add-circle" size={22} color={colors.success} />
              <Text style={[styles.actionText, { color: colors.success }]}>
                {t('inventory.stockIn')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: item.quantity > 0 ? colors.dangerLight : colors.surfaceSecondary },
              ]}
              onPress={confirmStockOut}
              disabled={item.quantity === 0}
            >
              <Ionicons
                name="remove-circle"
                size={22}
                color={item.quantity > 0 ? colors.danger : colors.textMuted}
              />
              <Text
                style={[
                  styles.actionText,
                  { color: item.quantity > 0 ? colors.danger : colors.textMuted },
                ]}
              >
                {t('inventory.stockOut')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    marginTop: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  stockValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  stockUnit: {
    fontSize: 14,
  },
  stockBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  stockFill: {
    height: '100%',
    borderRadius: 4,
  },
  minStockText: {
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  barcodeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  barcodeLines: {
    flexDirection: 'row',
    height: 60,
    gap: 2,
    marginBottom: 12,
  },
  barcodeLine: {
    height: '100%',
  },
  barcodeText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 4,
  },
  actions: {
    padding: 16,
    paddingBottom: 50,
    gap: 12,
    borderTopWidth: 1,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quantityLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyInput: {
    width: 60,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
