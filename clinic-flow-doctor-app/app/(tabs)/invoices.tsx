import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { InvoiceCard } from '../../components/InvoiceCard';
import { AddInvoiceModal } from '../../components/modals/AddInvoiceModal';
import { InvoiceStatus } from '../../data/invoices';
import { SearchBar } from '../../components/SearchBar';
import { PageHeader } from '../../components/PageHeader';

type TabType = 'all' | 'paid' | 'pending' | 'overdue';

export default function InvoicesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { invoices } = useApp();
  
  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: t('invoices.all') },
    { key: 'paid', label: t('invoices.paid') },
    { key: 'pending', label: t('invoices.pending') },
    { key: 'overdue', label: t('invoices.overdue') },
  ];

  const filteredInvoices = useMemo(() => {
    let result = invoices;
    
    // Apply status filter
    if (activeTab !== 'all') {
      result = result.filter(inv => inv.status === activeTab);
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(inv => 
        inv.invoiceNumber.toLowerCase().includes(query) ||
        inv.patientName.toLowerCase().includes(query) ||
        inv.service.toLowerCase().includes(query) ||
        inv.date.includes(query)
      );
    }
    
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [invoices, activeTab, searchQuery]);

  const getTabCount = (status: TabType) => {
    if (status === 'all') return invoices.length;
    return invoices.filter(inv => inv.status === status).length;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageHeader
        title={t('tabs.invoices')}
        icon="receipt"
      />

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('common.search')}
        />
      </View>

      {/* Tab Switcher */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }, needsManualRTL && styles.rtlRow]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && { backgroundColor: colors.primaryLight },
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.key ? colors.primary : colors.textSecondary },
              ]}
            >
              {tab.label}
            </Text>
            {getTabCount(tab.key) > 0 && (
              <View style={[
                styles.tabBadge, 
                { backgroundColor: activeTab === tab.key ? colors.primary : colors.textMuted }
              ]}>
                <Text style={styles.tabBadgeText}>{getTabCount(tab.key)}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Invoice List */}
      <FlatList
        data={filteredInvoices}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <InvoiceCard invoice={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="receipt-outline" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('invoices.noInvoices')}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {t('invoices.addFirst')}
            </Text>
          </View>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }, needsManualRTL ? { left: 20 } : { right: 20 }]}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 8,
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    gap: 4,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  tabBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
