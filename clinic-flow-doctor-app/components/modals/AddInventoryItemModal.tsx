import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { UnitType } from '../../data/inventory';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface AddInventoryItemModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddInventoryItemModal({ visible, onClose }: AddInventoryItemModalProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { categories, addItem } = useApp();

  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [barcode, setBarcode] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(categories[0]?.id || null);
  const [quantity, setQuantity] = useState('0');
  const [minStock, setMinStock] = useState('10');
  const [unit, setUnit] = useState<UnitType>('pieces');
  const [costPrice, setCostPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  const units: { key: UnitType; label: string }[] = [
    { key: 'pieces', label: t('inventory.pieces') },
    { key: 'boxes', label: t('inventory.boxes') },
    { key: 'cartons', label: t('inventory.cartons') },
    { key: 'bottles', label: t('inventory.bottles') },
    { key: 'packs', label: t('inventory.packs') },
  ];

  const handleSave = () => {
    if (!name.trim() || !categoryId) return;
    addItem({
      barcode: barcode.trim() || `ITM${Date.now()}`,
      name: name.trim(),
      nameAr: nameAr.trim(),
      categoryId,
      quantity: parseInt(quantity) || 0,
      minStock: parseInt(minStock) || 10,
      unit,
      costPrice: parseFloat(costPrice) || 0,
      sellPrice: parseFloat(sellPrice) || 0,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setNameAr('');
    setBarcode('');
    setCategoryId(categories[0]?.id || null);
    setQuantity('0');
    setMinStock('10');
    setUnit('pieces');
    setCostPrice('');
    setSellPrice('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        
        <View style={[styles.modalWrapper, { marginBottom: 90 }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[
              styles.header, 
              { borderBottomColor: colors.border },
              needsManualRTL && styles.rtlHeader
            ]}>
              <Text style={[styles.title, { color: colors.text }]}>{t('inventory.addItem')}</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Form */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('inventory.itemName')} (EN) *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                value={name}
                onChangeText={setName}
                placeholder="Item name"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('inventory.itemName')} (AR)
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: 'right' }]}
                value={nameAr}
                onChangeText={setNameAr}
                placeholder="اسم الصنف"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('inventory.barcode')}
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                value={barcode}
                onChangeText={setBarcode}
                placeholder="Auto-generated if empty"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('inventory.category')} *
              </Text>
              <View style={[styles.chipContainer, needsManualRTL && styles.rtlChipContainer]}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.chip, { backgroundColor: categoryId === cat.id ? colors.primary : colors.surfaceSecondary, borderColor: categoryId === cat.id ? colors.primary : colors.border }]}
                    onPress={() => setCategoryId(cat.id)}
                  >
                    <Text style={[styles.chipText, { color: categoryId === cat.id ? '#fff' : colors.text }]}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.row, needsManualRTL && styles.rtlRow]}>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                    {t('inventory.quantity')}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                    {t('inventory.minStock')}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                    value={minStock}
                    onChangeText={setMinStock}
                    keyboardType="numeric"
                    placeholder="10"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('inventory.unit')}
              </Text>
              <View style={[styles.chipContainer, needsManualRTL && styles.rtlChipContainer]}>
                {units.map((u) => (
                  <TouchableOpacity
                    key={u.key}
                    style={[styles.chip, { backgroundColor: unit === u.key ? colors.teal : colors.surfaceSecondary, borderColor: unit === u.key ? colors.teal : colors.border }]}
                    onPress={() => setUnit(u.key)}
                  >
                    <Text style={[styles.chipText, { color: unit === u.key ? '#fff' : colors.text }]}>{u.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.row, needsManualRTL && styles.rtlRow]}>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                    {t('inventory.costPrice')}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                    value={costPrice}
                    onChangeText={setCostPrice}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                    {t('inventory.sellPrice')}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                    value={sellPrice}
                    onChangeText={setSellPrice}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: colors.border }, needsManualRTL && styles.rtlFooter]}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onClose}>
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: '#8b5cf6', opacity: name.trim() && categoryId ? 1 : 0.5 }]}
                onPress={handleSave}
                disabled={!name.trim() || !categoryId}
              >
                <Text style={styles.saveText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  modalWrapper: { maxHeight: SCREEN_HEIGHT * 0.75 },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  rtlHeader: { flexDirection: 'row-reverse' },
  title: { fontSize: 18, fontWeight: '700' },
  scrollView: { maxHeight: SCREEN_HEIGHT * 0.5 },
  scrollContent: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15 },
  row: { flexDirection: 'row', gap: 12 },
  rtlRow: { flexDirection: 'row-reverse' },
  halfField: { flex: 1 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rtlChipContainer: { flexDirection: 'row-reverse' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '500' },
  footer: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1 },
  rtlFooter: { flexDirection: 'row-reverse' },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  cancelText: { fontSize: 15, fontWeight: '600' },
  saveBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  saveText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
