import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { Patient } from '../../data/patients';

interface AddInvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  initialPatient?: Patient;
}

export function AddInvoiceModal({ visible, onClose, initialPatient }: AddInvoiceModalProps) {
  const { colors, isDark } = useTheme();
  const { isRTL, t } = useLanguage();
  const { patients, addInvoice } = useApp();
  
  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(initialPatient || null);
  const [patientSearch, setPatientSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedPatient || !service || !amount) return;

    const today = new Date().toISOString().split('T')[0];
    const dueDateValue = dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    addInvoice({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      date: today,
      dueDate: dueDateValue,
      amount: parseFloat(amount) || 0,
      status: 'pending',
      service,
      notes: '',
    });

    handleClose();
  };

  const handleClose = () => {
    setSelectedPatient(initialPatient || null);
    setPatientSearch('');
    setShowDropdown(false);
    setService('');
    setAmount('');
    setDueDate('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={[styles.header, needsManualRTL && styles.rtlHeader]}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t('invoices.createInvoice')}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Patient Search */}
            <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
              {t('invoices.patient')} *
            </Text>
            <View style={styles.searchWrapper}>
              <View style={[
                styles.searchBox,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                needsManualRTL && styles.rtlSearchBox
              ]}>
                <Ionicons name="search-outline" size={18} color={colors.textMuted} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}
                  value={patientSearch}
                  onChangeText={(text) => {
                    setPatientSearch(text);
                    setShowDropdown(true);
                    if (!text) setSelectedPatient(null);
                  }}
                  placeholder={t('invoices.selectPatient')}
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              {showDropdown && patientSearch && filteredPatients.length > 0 && (
                <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  {filteredPatients.slice(0, 5).map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.dropdownItem, needsManualRTL && styles.rtlDropdownItem]}
                      onPress={() => {
                        setSelectedPatient(p);
                        setPatientSearch(p.name);
                        setShowDropdown(false);
                      }}
                    >
                      <View style={[styles.patientAvatar, { backgroundColor: colors.primaryLight }]}>
                        <Text style={[styles.avatarText, { color: colors.primary }]}>
                          {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </Text>
                      </View>
                      <View style={[styles.patientInfo, needsManualRTL && { alignItems: 'flex-end' }]}>
                        <Text style={[styles.patientName, { color: colors.text }]}>{p.name}</Text>
                        <Text style={[styles.patientPhone, { color: colors.textSecondary }]}>{p.phone}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {selectedPatient && (
                <View style={[
                  styles.selectedBadge, 
                  { backgroundColor: colors.primaryLight },
                  needsManualRTL ? { alignSelf: 'flex-end', flexDirection: 'row-reverse' } : { alignSelf: 'flex-start' }
                ]}>
                  <Text style={[styles.selectedText, { color: colors.primary }]}>{selectedPatient.name}</Text>
                  <TouchableOpacity onPress={() => { setSelectedPatient(null); setPatientSearch(''); }}>
                    <Ionicons name="close-circle" size={18} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Service */}
            <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
              {t('invoices.service')} *
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
              value={service}
              onChangeText={setService}
              placeholder={t('invoices.enterService')}
              placeholderTextColor={colors.textMuted}
            />

            {/* Amount & Due Date */}
            <View style={[styles.row, needsManualRTL && styles.rtlRow]}>
              <View style={styles.halfField}>
                <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                  {t('invoices.amount')} *
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                  {t('invoices.dueDate')}
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                  value={dueDate}
                  onChangeText={setDueDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, needsManualRTL && styles.rtlFooter]}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={handleClose}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>{t('invoices.createInvoice')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  rtlHeader: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    maxHeight: 400,
  },
  scrollContent: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  searchWrapper: {
    marginBottom: 16,
    zIndex: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  rtlSearchBox: {
    flexDirection: 'row-reverse',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  dropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  rtlDropdownItem: {
    flexDirection: 'row-reverse',
  },
  patientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '500',
  },
  patientPhone: {
    fontSize: 13,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
    marginTop: 8,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  halfField: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  rtlFooter: {
    flexDirection: 'row-reverse',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
