import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AppointmentType } from '../../data/appointments';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { getAppointment, getPatient, updateAppointmentStatus } = useApp();

  // Only apply manual RTL for flex direction if native RTL is NOT handling it
  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const appointment = getAppointment(Number(id));

  if (!appointment) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textMuted} />
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            Appointment not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const patient = getPatient(appointment.patientId);

  const getTypeLabel = (type: AppointmentType): string => {
    const key = `appointments.${type}`;
    return t(key);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const locale = language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, options);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const m = parseInt(minutes);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
  };

  const handleConfirm = () => {
    updateAppointmentStatus(appointment.id, 'confirmed');
    router.back();
  };

  const handleCancel = () => {
    updateAppointmentStatus(appointment.id, 'canceled');
    router.back();
  };

  const handleComplete = () => {
    updateAppointmentStatus(appointment.id, 'completed');
    router.back();
  };

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'danger' | 'warning';
    action: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'success',
    action: () => {},
  });

  const showConfirmAppointment = () => {
    setConfirmModal({
      visible: true,
      title: t('appointments.confirmAppointment'),
      message: language === 'ar' 
        ? `هل تريد تأكيد موعد ${appointment.patientName}؟`
        : `Confirm appointment with ${appointment.patientName}?`,
      type: 'success',
      action: handleConfirm,
    });
  };

  const showCancelAppointment = () => {
    setConfirmModal({
      visible: true,
      title: t('appointments.cancelAppointment'),
      message: language === 'ar' 
        ? `هل أنت متأكد من إلغاء موعد ${appointment.patientName}؟`
        : `Are you sure you want to cancel appointment with ${appointment.patientName}?`,
      type: 'danger',
      action: handleCancel,
    });
  };

  const showCompleteAppointment = () => {
    setConfirmModal({
      visible: true,
      title: t('common.markAsDone'),
      message: language === 'ar' 
        ? `هل تريد وضع علامة مكتمل على موعد ${appointment.patientName}؟`
        : `Mark appointment with ${appointment.patientName} as completed?`,
      type: 'success',
      action: handleComplete,
    });
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
  }) => (
    <View style={[styles.infoRow, needsManualRTL && styles.rtlRow]}>
      <View style={[styles.infoIcon, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={[styles.infoContent, needsManualRTL && { alignItems: 'flex-end' }]}>
        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t('appointments.details'),
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.headerRow, needsManualRTL && styles.rtlRow]}>
              <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.initials, { color: colors.primary }]}>
                  {appointment.patientName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </Text>
              </View>
              <View style={[styles.headerInfo, needsManualRTL && { alignItems: 'flex-end' }]}>
                <Text style={[styles.patientName, { color: colors.text }]}>
                  {appointment.patientName}
                </Text>
                <Text style={[styles.appointmentType, { color: colors.textSecondary }]}>
                  {getTypeLabel(appointment.type)}
                </Text>
              </View>
              <StatusBadge status={appointment.status} />
            </View>
          </View>

          {/* Details Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <InfoRow
              icon="calendar-outline"
              label={t('appointments.time')}
              value={formatDate(appointment.day)}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow
              icon="time-outline"
              label={t('appointments.time')}
              value={formatTime(appointment.time)}
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow
              icon="hourglass-outline"
              label={t('appointments.duration')}
              value={`${appointment.duration} ${t('appointments.minutes')}`}
            />
          </View>

          {/* Notes Card */}
          {appointment.notes && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.notesTitle, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('appointments.notes')}
              </Text>
              <Text style={[styles.notesText, { color: colors.textSecondary, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {appointment.notes}
              </Text>
            </View>
          )}

          {/* Patient Contact */}
          {patient && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('patients.contactInfo')}
              </Text>
              <View style={[styles.contactRow, needsManualRTL && styles.rtlRow]}>
                <TouchableOpacity style={[styles.contactButton, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="call" size={20} color={colors.primary} />
                </TouchableOpacity>
                <View style={[styles.contactInfo, needsManualRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.contactLabel, { color: colors.textMuted, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                    {t('patients.phone')}
                  </Text>
                  <Text style={[styles.contactValue, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                    {patient.phone}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={[styles.actions, { backgroundColor: colors.surface, borderTopColor: colors.border }, needsManualRTL && styles.rtlRow]}>
          {appointment.status === 'pending' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.successLight }, needsManualRTL && styles.rtlRow]}
                onPress={showConfirmAppointment}
              >
                <Ionicons name="checkmark" size={22} color={colors.success} />
                <Text style={[styles.actionText, { color: colors.success }]}>
                  {t('appointments.confirmAppointment')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.dangerLight }, needsManualRTL && styles.rtlRow]}
                onPress={showCancelAppointment}
              >
                <Ionicons name="close" size={22} color={colors.danger} />
                <Text style={[styles.actionText, { color: colors.danger }]}>
                  {t('appointments.cancelAppointment')}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {appointment.status === 'confirmed' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.fullButton, { backgroundColor: colors.primary }, needsManualRTL && styles.rtlRow]}
              onPress={showCompleteAppointment}
            >
              <Ionicons name="checkmark-done" size={22} color="#fff" />
              <Text style={[styles.actionText, { color: '#fff' }]}>
                {t('common.markAsDone')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ConfirmationModal
          visible={confirmModal.visible}
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
          onConfirm={confirmModal.action}
          onClose={() => setConfirmModal(prev => ({ ...prev, visible: false }))}
        />
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
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 14,
  },
  initials: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 12,
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
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
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
  fullButton: {
    flex: 1,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
