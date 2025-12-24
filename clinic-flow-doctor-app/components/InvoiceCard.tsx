import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Invoice, InvoiceStatus } from '../data/invoices';

interface InvoiceCardProps {
  invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const { isRTL, t, language } = useLanguage();
  
  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'overdue':
        return colors.danger;
      default:
        return colors.textMuted;
    }
  };

  const getStatusLabel = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return t('invoices.paid');
      case 'pending':
        return t('invoices.pending');
      case 'overdue':
        return t('invoices.overdue');
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const locale = language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: '2-digit' });
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const statusColor = getStatusColor(invoice.status);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        needsManualRTL && styles.rtlRow
      ]}
      onPress={() => router.push(`/invoice/${invoice.id}` as any)}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name="receipt-outline" size={24} color={colors.primary} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={[styles.headerRow, needsManualRTL && styles.rtlRow]}>
          <Text style={[styles.invoiceNumber, { color: colors.text }]}>
            {invoice.invoiceNumber}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }, needsManualRTL && styles.rtlRow]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusLabel(invoice.status)}
            </Text>
          </View>
        </View>
        
        <Text 
          style={[styles.patientName, { color: colors.textSecondary, textAlign: needsManualRTL ? 'right' : 'left' }]}
          numberOfLines={1}
        >
          {invoice.patientName}
        </Text>

        <View style={[styles.detailsColumn, needsManualRTL && { alignItems: 'flex-end' }]}>
          <View style={[styles.detailItem, needsManualRTL && styles.rtlRow]}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.detailText, { color: colors.textMuted }]}>
              {formatDate(invoice.date)}
            </Text>
          </View>
          <View style={[styles.detailItem, needsManualRTL && styles.rtlRow]}>
            <Ionicons name="medical-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.detailText, { color: colors.textMuted }]} numberOfLines={1}>
              {invoice.service}
            </Text>
          </View>
        </View>
      </View>

      {/* Amount */}
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: colors.primary }]}>
          {formatAmount(invoice.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  patientName: {
    fontSize: 14,
    marginBottom: 6,
  },
  detailsColumn: {
    flexDirection: 'column',
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
  },
  amountContainer: {
    alignItems: 'flex-end',
    flexShrink: 0,
    marginLeft: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
});
