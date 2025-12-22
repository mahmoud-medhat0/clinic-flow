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
  I18nManager,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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

  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(initialPatient || null);
  const [patientSearch, setPatientSearch] = useState(initialPatient?.name || '');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState<Date>(new Date());
  const [appointmentTime, setAppointmentTime] = useState<Date>(new Date(new Date().setHours(9, 0, 0, 0)));
  const [dateText, setDateText] = useState(new Date().toISOString().split('T')[0]);
  const [timeText, setTimeText] = useState('09:00');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setAppointmentDate(selectedDate);
      setDateText(formatDate(selectedDate));
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setAppointmentTime(selectedTime);
      setTimeText(formatTime(selectedTime));
    }
  };

  const handleDateTextBlur = () => {
    // Try to parse the date - only update if valid format
    const parsed = new Date(dateText + 'T00:00:00');
    if (!isNaN(parsed.getTime()) && dateText.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setAppointmentDate(parsed);
    }
    // Don't reset invalid dates - let user continue editing
  };

  const handleTimeTextBlur = () => {
    // Try to parse the time - only update if valid format
    const match = timeText.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        const newTime = new Date();
        newTime.setHours(hours, minutes, 0, 0);
        setAppointmentTime(newTime);
      }
    }
    // Don't reset invalid times - let user continue editing
  };

  const handleSave = () => {
    if (!selectedPatient) return;
    addAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      day: formatDate(appointmentDate),
      time: formatTime(appointmentTime),
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
    const defaultDate = new Date();
    const defaultTime = new Date(new Date().setHours(9, 0, 0, 0));
    setAppointmentDate(defaultDate);
    setAppointmentTime(defaultTime);
    setDateText(formatDate(defaultDate));
    setTimeText(formatTime(defaultTime));
    setShowDatePicker(false);
    setShowTimePicker(false);
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
            <View style={[
              styles.header, 
              { borderBottomColor: colors.border },
              needsManualRTL && styles.rtlHeader
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
              <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('appointments.patient')} *
              </Text>
              <View style={styles.searchWrapper}>
                <View style={[
                  styles.searchBox, 
                  { backgroundColor: colors.surfaceSecondary, borderColor: showPatientDropdown ? colors.primary : colors.border },
                  needsManualRTL && styles.rtlSearchBox
                ]}>
                  <Ionicons name="search-outline" size={18} color={colors.textMuted} />
                  <TextInput
                    style={[styles.searchInput, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}
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
                        style={[styles.dropdownItem, needsManualRTL && styles.rtlDropdownItem]} 
                        onPress={() => handleSelectPatient(p)}
                      >
                        <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
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
              </View>

              {selectedPatient && (
                <View style={[
                  styles.selectedBadge, 
                  { backgroundColor: colors.primaryLight },
                  needsManualRTL ? { alignSelf: 'flex-end', flexDirection: 'row-reverse' } : { alignSelf: 'flex-start' }
                ]}>
                  <Text style={[styles.selectedText, { color: colors.primary }]}>{selectedPatient.name}</Text>
                  <TouchableOpacity onPress={() => { setSelectedPatient(null); setPatientSearch(''); }}>
                    <Ionicons name="close-circle" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Date & Time */}
              <View style={[styles.row, needsManualRTL && styles.rtlRow]}>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>{t('appointments.date')}</Text>
                  {Platform.OS === 'web' ? (
                    <View style={[styles.dateButton, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }, needsManualRTL && styles.rtlDateButton]}>
                      <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
                      <input
                        type="date"
                        value={formatDate(appointmentDate)}
                        onChange={(e) => {
                          const newDate = new Date(e.target.value + 'T00:00:00');
                          if (!isNaN(newDate.getTime())) {
                            setAppointmentDate(newDate);
                          }
                        }}
                        min={formatDate(new Date())}
                        style={{
                          flex: 1,
                          border: 'none',
                          background: 'transparent',
                          color: colors.text,
                          fontSize: 15,
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.dateButton, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }, needsManualRTL && styles.rtlDateButton]}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
                      <Text style={[styles.dateText, { color: colors.text }]}>
                        {formatDate(appointmentDate)}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.halfField}>
                  <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                    {t('appointments.time')}
                  </Text>
                  {Platform.OS === 'web' ? (
                    <View style={[styles.dateButton, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }, needsManualRTL && styles.rtlDateButton]}>
                      <Ionicons name="time-outline" size={18} color={colors.textMuted} />
                      <input
                        type="time"
                        value={formatTime(appointmentTime)}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const newTime = new Date();
                          newTime.setHours(hours, minutes, 0, 0);
                          if (!isNaN(newTime.getTime())) {
                            setAppointmentTime(newTime);
                          }
                        }}
                        style={{
                          flex: 1,
                          border: 'none',
                          background: 'transparent',
                          color: colors.text,
                          fontSize: 15,
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.dateButton, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }, needsManualRTL && styles.rtlDateButton]}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Ionicons name="time-outline" size={18} color={colors.textMuted} />
                      <Text style={[styles.dateText, { color: colors.text }]}>
                        {formatTime(appointmentTime)}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Date Picker for iOS (inline) */}
              {Platform.OS === 'ios' && showDatePicker && (
                <View style={[styles.iosPickerContainer, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                  <View style={[styles.iosPickerHeader, needsManualRTL && styles.rtlRow]}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={[styles.iosPickerDone, { color: colors.primary }]}>{t('common.done') || 'Done'}</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={appointmentDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    textColor={colors.text}
                  />
                </View>
              )}

              {/* Time Picker for iOS (inline) */}
              {Platform.OS === 'ios' && showTimePicker && (
                <View style={[styles.iosPickerContainer, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                  <View style={[styles.iosPickerHeader, needsManualRTL && styles.rtlRow]}>
                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                      <Text style={[styles.iosPickerDone, { color: colors.primary }]}>{t('common.done') || 'Done'}</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={appointmentTime}
                    mode="time"
                    display="spinner"
                    onChange={handleTimeChange}
                    textColor={colors.text}
                  />
                </View>
              )}

              {/* Type */}
              <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('appointments.type')}
              </Text>
              <View style={[styles.chipContainer, needsManualRTL && styles.rtlChipContainer]}>
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
              <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('appointments.duration')} (min)
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor={colors.textMuted}
              />

              {/* Notes */}
              <Text style={[styles.label, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('appointments.notes')}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.surfaceSecondary, color: colors.text, borderColor: colors.border, textAlign: needsManualRTL ? 'right' : 'left' }]}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                placeholder={t('appointments.notes')}
                placeholderTextColor={colors.textMuted}
              />
            </ScrollView>

            {/* Date Picker for Android */}
            {Platform.OS === 'android' && showDatePicker && (
              <DateTimePicker
                value={appointmentDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            {/* Time Picker for Android */}
            {Platform.OS === 'android' && showTimePicker && (
              <DateTimePicker
                value={appointmentTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: colors.border }, needsManualRTL && styles.rtlFooter]}>
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  rtlDateButton: {
    flexDirection: 'row-reverse',
  },
  dateText: {
    fontSize: 15,
  },
  dateInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  iosPickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 12,
    overflow: 'hidden',
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
  },
  iosPickerDone: {
    fontSize: 16,
    fontWeight: '600',
  },
});
