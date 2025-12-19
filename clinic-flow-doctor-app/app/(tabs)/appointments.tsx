import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { AppointmentCard } from '../../components/AppointmentCard';
import { AddAppointmentModal } from '../../components/modals/AddAppointmentModal';
import { SearchBar } from '../../components/SearchBar';

type TabType = 'today' | 'upcoming' | 'previous';

export default function AppointmentsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { appointments, getPatient } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredAppointments = useMemo(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return appointments.filter((a) => {
        const patient = getPatient(a.patientId);
        return (
          a.patientName.toLowerCase().includes(query) ||
          (patient && patient.phone.includes(query))
        );
      }).sort((a, b) => b.day.localeCompare(a.day) || b.time.localeCompare(a.time));
    }

    if (activeTab === 'today') {
      return appointments.filter((a) => a.day === todayStr);
    }
    if (activeTab === 'previous') {
      return appointments
        .filter((a) => a.day < todayStr)
        .sort((a, b) => {
          if (a.day !== b.day) return b.day.localeCompare(a.day);
          return b.time.localeCompare(a.time);
        });
    }
    return appointments
      .filter((a) => a.day > todayStr)
      .sort((a, b) => {
        if (a.day !== b.day) return a.day.localeCompare(b.day);
        return a.time.localeCompare(b.time);
      });
  }, [appointments, activeTab, todayStr, searchQuery, getPatient]);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'previous', label: t('appointments.previous') },
    { key: 'today', label: t('appointments.today') },
    { key: 'upcoming', label: t('appointments.upcoming') },
  ];

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'previous':
        return t('appointments.noPrevious');
      case 'today':
        return t('appointments.noToday');
      default:
        return t('appointments.noUpcoming');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('patients.searchPlaceholder')}
        />
      </View>

      {/* Tab Switcher - Hide when searching */}
      {!searchQuery && (
        <View style={[styles.tabContainer, { backgroundColor: colors.surface }, isRTL && styles.rtlTabContainer]}>
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
      )}

      {/* Appointments List */}
      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onPress={() => router.push(`/appointment/${item.id}`)}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('appointments.noAppointments')}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {getEmptyMessage()}
            </Text>
          </View>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[
          styles.fab, 
          { backgroundColor: colors.primary },
          isRTL ? { left: 20 } : { right: 20 }
        ]}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Appointment Modal */}
      <AddAppointmentModal
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
  rtlTabContainer: {
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
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
});
