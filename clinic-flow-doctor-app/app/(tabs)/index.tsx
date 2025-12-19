import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { StatCard } from '../../components/StatCard';
import { AppointmentCard } from '../../components/AppointmentCard';
import { QuickActionButton } from '../../components/QuickActionButton';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { 
    doctor, 
    getTodayAppointments, 
    getUpcomingAppointments, 
    getMonthlyRevenue, 
    getNewPatientsCount,
    unreadNotificationsCount,
  } = useApp();

  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = getUpcomingAppointments();
  const monthlyRevenue = getMonthlyRevenue();
  const newPatients = getNewPatientsCount();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greeting');
    if (hour < 18) return t('dashboard.greetingAfternoon');
    return t('dashboard.greetingEvening');
  };

  const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const locale = language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US';
    return today.toLocaleDateString(locale, options);
  };

  const doctorName = language === 'ar' && doctor.nameAr ? doctor.nameAr : doctor.name;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header]}>
          <View style={styles.greetingContainer}>
            <Text style={[styles.greeting, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {getGreeting()},
            </Text>
            <Text style={[styles.doctorName, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{doctorName}</Text>
            <Text style={[styles.date, { color: colors.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>{formatDate()}</Text>
          </View>
          <View style={[styles.headerActions]}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={colors.text} />
              {unreadNotificationsCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.danger }]} />
              )}
            </TouchableOpacity>
            <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="person" size={28} color={colors.primary} />
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statsRow]}>
            <StatCard
              title={t('dashboard.appointmentsToday')}
              value={todayAppointments.length}
              icon="calendar"
              color={colors.primary}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title={t('dashboard.monthlyRevenue')}
              value={`$${monthlyRevenue.toLocaleString()}`}
              icon="cash"
              color={colors.teal}
              trend={{ value: 8, isPositive: true }}
            />
          </View>
          <View style={[styles.statsRow]}>
            <StatCard
              title={t('dashboard.newPatients')}
              value={newPatients}
              icon="people"
              color="#8b5cf6"
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title={t('common.today')}
              value={new Date().getDate()}
              icon="today"
              color="#ec4899"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('dashboard.quickActions')}
          </Text>
          <View style={[styles.quickActions]}>
            <QuickActionButton
              label={t('dashboard.addAppointment')}
              icon="calendar-outline"
              color={colors.primary}
              onPress={() => router.push('/appointments')}
            />
            <QuickActionButton
              label={t('dashboard.addPatient')}
              icon="person-add-outline"
              color={colors.teal}
              onPress={() => router.push('/patients')}
            />
            <QuickActionButton
              label={t('dashboard.addInventory')}
              icon="cube-outline"
              color="#8b5cf6"
              onPress={() => router.push('/inventory')}
            />
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader]}>
            <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('dashboard.upcomingAppointments')}
            </Text>
            <Text
              style={[styles.viewAll, { color: colors.primary, textAlign: isRTL ? 'left' : 'right' }]}
              onPress={() => router.push('/appointments')}
            >
              {t('common.viewAll')}
            </Text>
          </View>
          {upcomingAppointments.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted, textAlign: 'center' }]}>
                {t('appointments.noAppointments')}
              </Text>
            </View>
          ) : (
            upcomingAppointments.slice(0, 3).map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                compact
                onPress={() => router.push(`/appointment/${apt.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  statsGrid: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 16,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
  },
});
