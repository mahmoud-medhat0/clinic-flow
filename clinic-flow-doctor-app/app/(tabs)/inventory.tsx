import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { InventoryItemCard } from '../../components/InventoryItemCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AddInventoryItemModal } from '../../components/modals/AddInventoryItemModal';

type TabType = 'items' | 'categories' | 'movements';

export default function InventoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { inventoryItems, categories, movements, getCategory, getItem } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('items');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'items', label: t('inventory.items') },
    { key: 'categories', label: t('inventory.categories') },
    { key: 'movements', label: t('inventory.movements') },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'items':
        return (
          <FlatList
            data={inventoryItems}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const category = getCategory(item.categoryId);
              const categoryName =
                language === 'ar' && category?.nameAr
                  ? category.nameAr
                  : category?.name;
              return (
                <InventoryItemCard
                  item={item}
                  categoryName={categoryName}
                  onPress={() => router.push(`/inventory/item/${item.id}`)}
                />
              );
            }}
            ListEmptyComponent={() => (
              <EmptyState icon="cube-outline" message={t('inventory.noItems')} />
            )}
          />
        );

      case 'categories':
        return (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const categoryItems = inventoryItems.filter(
                (i) => i.categoryId === item.id
              );
              const displayName =
                language === 'ar' && item.nameAr ? item.nameAr : item.name;
              const isExpanded = expandedCategory === item.id;
              return (
                <View>
                  <TouchableOpacity
                    style={[
                      styles.categoryCard,
                      { backgroundColor: colors.card, borderColor: colors.border },
                      isExpanded && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginBottom: 0 },
                      isRTL && styles.rtlRow
                    ]}
                    onPress={() => setExpandedCategory(isExpanded ? null : item.id)}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: colors.primaryLight }, isRTL ? { marginLeft: 14, marginRight: 0 } : { marginRight: 14 }]}>
                      <Ionicons name="folder-outline" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={[styles.categoryName, { color: colors.text }]}>
                        {displayName}
                      </Text>
                      <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                        {categoryItems.length} {t('inventory.items')}
                      </Text>
                    </View>
                    <Ionicons 
                      name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                      size={20} 
                      color={colors.textMuted} 
                    />
                  </TouchableOpacity>
                  
                  {/* Expanded Items List */}
                  {isExpanded && (
                    <View style={[styles.categoryItemsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      {categoryItems.length === 0 ? (
                        <Text style={[styles.noItemsText, { color: colors.textMuted }]}>
                          {t('inventory.noItems')}
                        </Text>
                      ) : (
                        categoryItems.map((invItem) => {
                          const itemName = language === 'ar' && invItem.nameAr ? invItem.nameAr : invItem.name;
                          const stockStatus = invItem.quantity === 0 ? 'outOfStock' : invItem.quantity <= invItem.minStock ? 'lowStock' : 'inStock';
                          return (
                            <TouchableOpacity 
                              key={invItem.id}
                              style={[styles.categoryItem, { borderBottomColor: colors.border }]}
                              onPress={() => router.push(`/inventory/item/${invItem.id}`)}
                            >
                              <View style={styles.categoryItemInfo}>
                                <Text style={[styles.categoryItemName, { color: colors.text }]}>{itemName}</Text>
                                <Text style={[styles.categoryItemQty, { color: colors.textSecondary }]}>
                                  {invItem.quantity} {t(`inventory.${invItem.unit}`)}
                                </Text>
                              </View>
                              <StatusBadge status={stockStatus} size="sm" />
                            </TouchableOpacity>
                          );
                        })
                      )}
                    </View>
                  )}
                </View>
              );
            }}
            ListEmptyComponent={() => (
              <EmptyState icon="folder-outline" message={t('inventory.noCategories')} />
            )}
          />
        );

      case 'movements':
        return (
          <FlatList
            data={movements.slice().reverse()}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item: movement }) => {
              const inventoryItem = getItem(movement.itemId);
              const itemName =
                language === 'ar' && inventoryItem?.nameAr
                  ? inventoryItem.nameAr
                  : inventoryItem?.name || 'Unknown';
              return (
                <View
                  style={[
                    styles.movementCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <View style={[styles.movementHeader, isRTL && styles.rtlRow]}>
                    <Text style={[styles.movementItem, { color: colors.text }]}>
                      {itemName}
                    </Text>
                    <StatusBadge status={movement.type} size="sm" />
                  </View>
                  <View style={[styles.movementDetails, isRTL && styles.rtlRow]}>
                    <View style={[styles.movementDetail, isRTL && styles.rtlRow]}>
                      <Ionicons name="cube-outline" size={14} color={colors.textMuted} />
                      <Text style={[styles.movementText, { color: colors.textSecondary }]}>
                        {movement.quantity}
                      </Text>
                    </View>
                    <View style={[styles.movementDetail, isRTL && styles.rtlRow]}>
                      <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                      <Text style={[styles.movementText, { color: colors.textSecondary }]}>
                        {movement.date}
                      </Text>
                    </View>
                  </View>
                  {movement.notes && (
                    <Text
                      style={[styles.movementNotes, { color: colors.textMuted, textAlign: isRTL ? 'right' : 'left' }]}
                      numberOfLines={1}
                    >
                      {movement.notes}
                    </Text>
                  )}
                </View>
              );
            }}
            ListEmptyComponent={() => (
              <EmptyState icon="swap-horizontal-outline" message={t('inventory.noMovements')} />
            )}
          />
        );
    }
  };

  const EmptyState = ({ icon, message }: { icon: keyof typeof Ionicons.glyphMap; message: string }) => (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={64} color={colors.textMuted} />
      <Text style={[styles.emptyText, { color: colors.textMuted }]}>{message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tab Switcher */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }, isRTL && styles.rtlRow]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.key ? '#fff' : colors.textSecondary },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {renderContent()}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#8b5cf6' }, isRTL ? { left: 20 } : { right: 20 }]}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Inventory Item Modal */}
      <AddInventoryItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
    padding: 4,
    borderRadius: 12,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 13,
  },
  movementCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  movementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  movementItem: {
    fontSize: 16,
    fontWeight: '600',
  },
  movementDetails: {
    flexDirection: 'row',
    gap: 20,
  },
  movementDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  movementText: {
    fontSize: 13,
  },
  movementNotes: {
    fontSize: 12,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryItemsContainer: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 12,
    paddingVertical: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  categoryItemInfo: {
    flex: 1,
  },
  categoryItemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  categoryItemQty: {
    fontSize: 12,
  },
  noItemsText: {
    textAlign: 'center',
    padding: 16,
    fontSize: 13,
  },
});
