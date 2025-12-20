import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { AppointmentType, AppointmentStatus } from '../../data/appointments';
import { Patient } from '../../data/patients';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface AddAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  initialPatient?: Patient;
}

export function AddAppointmentModal({ visible, onClose, initialPatient }: AddAppointmentModalProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { patients, addAppointment } = useApp();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(initialPatient || null);
  const [patientSearch, setPatientSearch] = useState(initialPatient?.name || '');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<AppointmentType>('checkup');
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (visible && initialPatient) {
      setSelectedPatient(initialPatient);
      setPatientSearch(initialPatient.name);
    }
  }, [visible, initialPatient]);

  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return patients.slice(0, 5);
    const query = patientSearch.toLowerCase();
    const sanitizedQuery = query.replace(/\D/g, '');
    
    return patients
      .filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(query);
        const phoneMatch = p.phone.replace(/\D/g, '').includes(sanitizedQuery);
        return nameMatch || (sanitizedQuery.length > 0 && phoneMatch);
      })
      .slice(0, 5);
  }, [patients, patientSearch]);

  const appointmentTypes: { key: AppointmentType; label: string }[] = [
    { key: 'checkup', label: t('appointments.checkup') },
    { key: 'followup', label: t('appointments.followup') },
    { key: 'consultation', label: t('appointments.consultation') },
    { key: 'vaccination', label: t('appointments.vaccination') },
    { key: 'labResults', label: t('appointments.labResults') },
  ];

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearch(patient.name);
    setShowPatientDropdown(false);
  };

  const handleSave = () => {
    if (!selectedPatient) return;
    addAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      day: date,
      time,
      type,
      duration: parseInt(duration) || 30,
      notes,
      status: 'pending' as AppointmentStatus,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setPatientSearch('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('09:00');
    setType('checkup');
    setDuration('30');
    setNotes('');
  };

  const handleClose = () => {
    setShowPatientDropdown(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} />
        
        {/* Modal Container - positioned above tab bar */}
        <View style={[styles.modalWrapper, { marginBottom: 90 }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            {/* Header */}
            <View style={[
              styles.header, 
              { borderBottomColor: colors.border },
              isRTL && styles.rtlHeader
            ]}>
              <Text style={[styles.title, { color: colors.text }]}>
                {t('dashboard.addAppointment')}
              </Text>
              <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
              {/* Patient Search */}
              <Text style={[styles.label, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('appointments.patient')} *
              </Text>
              <View style={styles.searchWrapper}>
                <View style={[
                  styles.searchBox, 
                  { backgroundColor: colors.surfaceSecondary, borderColor: showPatientDropdown ? colors.primary : colors.border },
                  isRTL && styles.rtlSearchBox
                ]}>
                  <Ionicons name="search-outline" size={18} color={colors.textMuted} />
                  <TextInput
                    style={[styles.searchInput, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
                    value={patientSearch}
                    onChangeText={(text) => {
                      setPatientSearch(text);
                      setShowPatientDropdown(true);
                      if (selectedPatient && text !== selectedPatient.name) setSelectedPatient(null);
                    }}
                    onFocus={() => setShowPatientDropdown(true)}
                    placeholder={t('patients.searchPlaceholder')}
                    placeholderTextColor={colors.textMuted}
                  />
                  {patientSearch.length > 0 && (
                    <TouchableOpacity onPress={() => { setPatientSearch(''); setSelectedPatient(null); }}>
                      <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>

                {showPatientDropdown && filteredPatients.length > 0 && (
                  <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {filteredPatients.map((p) => (
                      <TouchableOpacity 
                        key={p.id} 
                        style={[styles.dropdownItem, isRTL && styles.rtlDropdownItem]} 
                        onPress={() => handleSelectPatient(p)}
                      >
                        <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                          <Text style={[styles.avatarText, { color: colors.primary }]}>
                            {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </Text>
                        </View>
                        <View style={[styles.patientInfo, isRTL && { alignItems: 'flex-end' }]}>
                          <Text style={[styles.patientName, { color: colors.text }]}>{p.name}</Text>
                          <Text style={[styles.patientPhone, { color: colors.textSecondary }]}>{p.phone}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {selectedPatient && (
                <View style={[
                  styles.selectedBadge, 
                  { backgroundColor: colors.primaryLight },
                  isRTL ? { alignSelf: 'flex-end', flexDirection: 'row-reverse' } : { alignSelf: 'flex-start' }
                ]}>
                  <Text style={[styles.selectedText, { color: colors.primary }]}>{selectedPatient.name}</Text>
                  <TouchableOpacity onPress={() => { setSelectedPatient(null); setPatientSearch(''); }}>
                    <Ionicons name="close-circle" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Date & Time */}
              <View style={[styles.row, isRTL && styles.rtlRow]}>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{t('appointments.date')}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
                    value={date}
                    onChangeText={setDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                    {t('appointments.time')}
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
                    value={time}
                    onChangeText={setTime}
                    placeholder="HH:MM"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              {/* Type */}
              <Text style={[styles.label, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('appointments.type')}
              </Text>
              <View style={[styles.chipContainer, isRTL && styles.rtlChipContainer]}>
                {appointmentTypes.map((apt) => (
                  <TouchableOpacity
                    key={apt.key}
                    style={[styles.chip, { backgroundColor: type === apt.key ? colors.primary : colors.surfaceSecondary, borderColor: type === apt.key ? colors.primary : colors.border }]}
                    onPress={() => setType(apt.key)}
                  >
                    <Text style={[styles.chipText, { color: type === apt.key ? '#fff' : colors.text }]}>{apt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Duration */}
              <Text style={[styles.label, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('appointments.duration')} (min)
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor={colors.textMuted}
              />

              {/* Notes */}
              <Text style={[styles.label, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('appointments.notes')}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: isRTL ? 'right' : 'left' }]}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                placeholder={t('appointments.notes')}
                placeholderTextColor={colors.textMuted}
              />
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: colors.border }, isRTL && styles.rtlFooter]}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={handleClose}>
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: selectedPatient ? 1 : 0.5 }]}
                onPress={handleSave}
                disabled={!selectedPatient}
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalWrapper: {
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  rtlHeader: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollView: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  scrollContent: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
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
  searchWrapper: {
    position: 'relative',
    zIndex: 100,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  rtlSearchBox: {
    flexDirection: 'row-reverse',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 10,
    elevation: 5,
    zIndex: 999,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  rtlDropdownItem: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '600',
  },
  patientPhone: {
    fontSize: 12,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  selectedText: {
    fontSize: 13,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rtlChipContainer: {
    flexDirection: 'row-reverse',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  rtlFooter: {
    flexDirection: 'row-reverse',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
