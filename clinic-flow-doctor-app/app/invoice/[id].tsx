import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { InvoiceStatus } from '../../data/invoices';

export default function InvoiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { getInvoice, getPatient, updateInvoiceStatus, deleteInvoice } = useApp();

  const needsManualRTL = isRTL && !I18nManager.isRTL;
  
  const invoice = getInvoice(Number(id));
  const patient = invoice ? getPatient(invoice.patientId) : null;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'paid' | 'delete' | null>(null);

  if (!invoice) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textMuted} />
          <Text style={[styles.notFoundText, { color: colors.text }]}>Invoice not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid': return colors.success;
      case 'pending': return colors.warning;
      case 'overdue': return colors.danger;
      default: return colors.textMuted;
    }
  };

  const getStatusLabel = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid': return t('invoices.paid');
      case 'pending': return t('invoices.pending');
      case 'overdue': return t('invoices.overdue');
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const locale = language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatAmount = (amount: number) => `$${amount.toFixed(2)}`;

  const handleMarkAsPaid = () => {
    setConfirmAction('paid');
    setShowConfirmModal(true);
  };

  const handleDelete = () => {
    setConfirmAction('delete');
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction === 'paid') {
      updateInvoiceStatus(invoice.id, 'paid');
    } else if (confirmAction === 'delete') {
      deleteInvoice(invoice.id);
      router.back();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const statusColor = getStatusColor(invoice.status);

  const InfoRow = ({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) => (
    <View style={[styles.infoRow, needsManualRTL && styles.rtlRow]}>
      <View style={[styles.infoIcon, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={[styles.infoContent, needsManualRTL && { alignItems: 'flex-end' }]}>
        <Text style={[styles.infoLabel, { color: colors.textMuted, textAlign: needsManualRTL ? 'right' : 'left' }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t('invoices.details'),
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
          {/* Invoice Header Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.invoiceHeader}>
              <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="receipt" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.invoiceNumber, { color: colors.text }]}>{invoice.invoiceNumber}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {getStatusLabel(invoice.status)}
                </Text>
              </View>
              <Text style={[styles.amount, { color: colors.primary }]}>{formatAmount(invoice.amount)}</Text>
            </View>
          </View>

          {/* Invoice Details */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
              {t('invoices.details')}
            </Text>
            <InfoRow icon="person-outline" label={t('invoices.patient')} value={invoice.patientName} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow icon="medical-outline" label={t('invoices.service')} value={invoice.service} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow icon="calendar-outline" label={t('invoices.date')} value={formatDate(invoice.date)} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InfoRow icon="time-outline" label={t('invoices.dueDate')} value={formatDate(invoice.dueDate)} />
          </View>

          {/* Patient Contact */}
          {patient && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('patients.contactInfo')}
              </Text>
              <InfoRow icon="call-outline" label={t('patients.phone')} value={patient.phone} />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <InfoRow icon="mail-outline" label={t('patients.email')} value={patient.email} />
            </View>
          )}

          {/* Notes */}
          {invoice.notes && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {t('appointments.notes')}
              </Text>
              <Text style={[styles.notesText, { color: colors.textSecondary, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {invoice.notes}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={[styles.actions, { backgroundColor: colors.surface, borderTopColor: colors.border }, needsManualRTL && styles.rtlRow]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.dangerLight }]}
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={22} color={colors.danger} />
          </TouchableOpacity>
          
          {invoice.status !== 'paid' && (
            <TouchableOpacity
              style={[styles.mainActionButton, { backgroundColor: colors.success }, needsManualRTL && styles.rtlRow]}
              onPress={handleMarkAsPaid}
            >
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text style={styles.mainActionText}>{t('invoices.markAsPaid')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <ConfirmationModal
          visible={showConfirmModal}
          title={confirmAction === 'paid' ? t('invoices.markAsPaid') : t('common.delete')}
          message={
            confirmAction === 'paid'
              ? (language === 'ar' ? 'هل تريد تحديد هذه الفاتورة كمدفوعة؟' : 'Mark this invoice as paid?')
              : (language === 'ar' ? 'هل أنت متأكد من حذف هذه الفاتورة؟' : 'Are you sure you want to delete this invoice?')
          }
          type={confirmAction === 'delete' ? 'danger' : 'success'}
          onConfirm={handleConfirm}
          onClose={() => { setShowConfirmModal(false); setConfirmAction(null); }}
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
  invoiceHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceNumber: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
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
