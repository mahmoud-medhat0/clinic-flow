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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { BloodType, PatientStatus } from '../../data/patients';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface AddPatientModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddPatientModal({ visible, onClose }: AddPatientModalProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { addPatient } = useApp();

  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>('O+');
  const [address, setAddress] = useState('');

  const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSave = () => {
    if (!name.trim()) return;
    addPatient({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      age: parseInt(age) || 0,
      dob: dob || new Date().toISOString().split('T')[0],
      bloodType,
      address: address.trim(),
      status: 'active' as PatientStatus,
      allergies: [],
      notes: '',
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setAge('');
    setDob('');
    setBloodType('O+');
    setAddress('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView 
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        
        <View style={[styles.modalWrapper, { marginBottom: 90 }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[
              styles.header, 
              { borderBottomColor: colors.border },
              needsManualRTL && styles.rtlHeader
            ]}>
              <Text style={[styles.title, { color: colors.text }]}>{t('patients.addPatient')}</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Form */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('patients.name')} *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                value={name}
                onChangeText={setName}
                placeholder={t('patients.name')}
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.label, { color: colors.text }]}>{t('patients.phone')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="+20 xxx xxx xxxx"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
              />

              <Text style={[styles.label, { color: colors.text }]}>{t('patients.email')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border }]}
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={[styles.row, needsManualRTL && styles.rtlRow]}>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                    {t('patients.age')}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                    value={age}
                    onChangeText={setAge}
                    placeholder="25"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                    {t('patients.dob')}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                    value={dob}
                    onChangeText={setDob}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('patients.bloodType')}
              </Text>
              <View style={[styles.chipContainer, needsManualRTL && styles.rtlChipContainer]}>
                {bloodTypes.map((bt) => (
                  <TouchableOpacity
                    key={bt}
                    style={[styles.chip, { backgroundColor: bloodType === bt ? colors.danger : colors.surfaceSecondary, borderColor: bloodType === bt ? colors.danger : colors.border }]}
                    onPress={() => setBloodType(bt)}
                  >
                    <Text style={[styles.chipText, { color: bloodType === bt ? '#fff' : colors.text }]}>{bt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.text }]}>{t('patients.address')}</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border }]}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
                placeholder={t('patients.address')}
                placeholderTextColor={colors.textMuted}
              />
            </ScrollView>

            <View style={[
              styles.footer, 
              { borderTopColor: colors.border },
              needsManualRTL && styles.rtlFooter
            ]}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onClose}>
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.teal, opacity: name.trim() ? 1 : 0.5 }]}
                onPress={handleSave}
                disabled={!name.trim()}
              >
                <Text style={styles.saveText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  textArea: { height: 60, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  rtlRow: { flexDirection: 'row-reverse' },
  halfField: { flex: 1 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rtlChipContainer: { flexDirection: 'row-reverse' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '600' },
  footer: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1 },
  rtlFooter: { flexDirection: 'row-reverse' },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  cancelText: { fontSize: 15, fontWeight: '600' },
  saveBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  saveText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
