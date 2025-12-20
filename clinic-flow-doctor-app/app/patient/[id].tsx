import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { AddAppointmentModal } from '../../components/modals/AddAppointmentModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function PatientProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { getPatient } = useApp();

  const patient = getPatient(Number(id));

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  if (!patient) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textMuted} />
          <Text style={[styles.notFoundText, { color: colors.text }]}>Patient not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${patient.phone}`);
  };

  const handleMessage = () => {
    Linking.openURL(`sms:${patient.phone}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const locale = language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, options);
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
    <View style={[styles.infoRow, isRTL && styles.rtlRow]}>
      <View style={[styles.infoIcon, { backgroundColor: colors.primaryLight }, isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={[styles.infoContent, isRTL && { alignItems: 'flex-end' }]}>
        <Text style={[styles.infoLabel, { color: colors.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t('patients.profile'),
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
            <View style={styles.profileHeader}>
              <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.initials, { color: colors.primary }]}>
                  {patient.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </Text>
              </View>
              <Text style={[styles.patientName, { color: colors.text }]}>{patient.name}</Text>
              <View style={styles.statusRow}>
                <StatusBadge status={patient.status} />
                <Text style={[styles.ageText, { color: colors.textSecondary }]}>
                  {patient.age} {t('patients.yearsOld')}
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Info */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('patients.contactInfo')}
            </Text>
            <InfoRow icon="call-outline" label={t('patients.phone')} value={patient.phone} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow icon="mail-outline" label={t('patients.email')} value={patient.email} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow icon="location-outline" label={t('patients.address')} value={patient.address} />
          </View>

          {/* Medical Info */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('patients.medicalInfo')}
            </Text>
            <InfoRow icon="calendar-outline" label={t('patients.dob')} value={formatDate(patient.dob)} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow icon="water-outline" label={t('patients.bloodType')} value={patient.bloodType} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow
              icon="warning-outline"
              label={t('patients.allergies')}
              value={
                patient.allergies && patient.allergies.length > 0
                  ? patient.allergies.join(', ')
                  : t('patients.noAllergies')
              }
            />
          </View>

          {/* Visit History */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('patients.visitHistory')}
            </Text>
            {patient.visits && patient.visits.length > 0 ? (
              patient.visits.map((visit, index) => (
                <React.Fragment key={visit.id}>
                  {index > 0 && <View style={[styles.divider, { backgroundColor: colors.border  }]} />}
                  <View style={[styles.visitItem, isRTL && styles.rtlRow]}>
                    <View style={[styles.visitDot, { backgroundColor: colors.primary }, isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }]} />
                    <View style={[styles.visitContent, isRTL && { alignItems: 'flex-end' }]}>
                      <View style={[styles.visitHeader, isRTL && styles.rtlRow]}>
                        <Text style={[styles.visitType, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{visit.type}</Text>
                        <Text style={[styles.visitDate, { color: colors.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
                          {formatDate(visit.date)}
                        </Text>
                      </View>
                      <Text style={[styles.visitNotes, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                        {visit.notes}
                      </Text>
                      {visit.diagnosis && (
                        <View style={[styles.diagnosisBadge, { backgroundColor: colors.primaryLight }, isRTL && { alignSelf: 'flex-end' }]}>
                          <Text style={[styles.diagnosisText, { color: colors.primary }]}>
                            {visit.diagnosis}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </React.Fragment>
              ))
            ) : (
              <View style={styles.emptyVisits}>
                <Ionicons name="document-text-outline" size={32} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted, textAlign: isRTL ? 'right' : 'center' }]}>
                  {t('patients.noVisits')}
                </Text>
              </View>
            )}
          </View>

          {/* Quick Notes */}
          {patient.notes && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('patients.quickNotes')}
              </Text>
              <Text style={[styles.notesText, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {patient.notes}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={[styles.actions, { backgroundColor: colors.surface, borderTopColor: colors.border }, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primaryLight }]}
            onPress={handleCall}
          >
            <Ionicons name="call" size={22} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.tealLight }]}
            onPress={handleMessage}
          >
            <Ionicons name="chatbubble" size={22} color={colors.teal} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mainActionButton, { backgroundColor: colors.primary }, isRTL && { flexDirection: 'row-reverse' }]}
            onPress={() => setShowAppointmentModal(true)}
          >
            <Ionicons name="calendar" size={22} color="#fff" />
            <Text style={styles.mainActionText}>{t('dashboard.addAppointment')}</Text>
          </TouchableOpacity>
        </View>

        <AddAppointmentModal 
          visible={showAppointmentModal} 
          onClose={() => setShowAppointmentModal(false)}
          initialPatient={patient}
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
    paddingBottom: 120,
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  initials: {
    fontSize: 28,
    fontWeight: '700',
  },
  patientName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ageText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
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
  visitItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  visitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  visitContent: {
    flex: 1,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  visitType: {
    fontSize: 15,
    fontWeight: '600',
  },
  visitDate: {
    fontSize: 12,
  },
  visitNotes: {
    fontSize: 14,
    lineHeight: 20,
  },
  diagnosisBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  diagnosisText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyVisits: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 22,
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  mainActionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
