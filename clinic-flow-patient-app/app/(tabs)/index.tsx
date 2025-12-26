import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { clinicsApi, Clinic } from '../../services/clinics';
import { ClinicCard } from '../../components/ClinicCard';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';

function ThemeToggleButton() {
  const { isDark, setThemeMode, colors } = useTheme();

  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={22}
        color={isDark ? '#fbbf24' : '#6366f1'}
      />
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useTranslation();
  const { patient } = useAuth();
  const { setClinic } = useBooking();

  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greetingMorning');
    if (hour < 17) return t('home.greetingAfternoon');
    return t('home.greetingEvening');
  };

  const loadClinics = useCallback(async () => {
    try {
      setError(null);
      const data = await clinicsApi.getAll();
      setClinics(data);
      setFilteredClinics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.server'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadClinics();
  }, [loadClinics]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredClinics(
        clinics.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.address.toLowerCase().includes(query) ||
            c.services.some((s) => s.name.toLowerCase().includes(query))
        )
      );
    } else {
      setFilteredClinics(clinics);
    }
  }, [searchQuery, clinics]);

  const handleClinicPress = (clinic: Clinic) => {
    router.push(`/clinic/${clinic.id}`);
  };

  const handleBookPress = (clinic: Clinic) => {
    setClinic(clinic.id, clinic.name);
    router.push('/booking');
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadClinics();
  };

  if (isLoading) {
    return <LoadingState fullScreen />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadClinics} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: 20,
          paddingHorizontal: 16,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            },
            needsManualRTL && { flexDirection: 'row-reverse' },
          ]}
        >
          <View style={needsManualRTL && { alignItems: 'flex-end' }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: needsManualRTL ? 'right' : 'left',
              }}
            >
              {getGreeting()}
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.text,
                textAlign: needsManualRTL ? 'right' : 'left',
              }}
            >
              {patient?.name || t('profile.guest')}
            </Text>
          </View>
          <View style={[
            { flexDirection: 'row', gap: 10 },
            needsManualRTL && { flexDirection: 'row-reverse' },
          ]}>
            <ThemeToggleButton />
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons name="person-outline" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderRadius: 12,
              paddingHorizontal: 14,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: colors.border,
            },
            needsManualRTL && { flexDirection: 'row-reverse' },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            style={{
              flex: 1,
              paddingVertical: 14,
              paddingHorizontal: 10,
              fontSize: 16,
              color: colors.text,
              textAlign: needsManualRTL ? 'right' : 'left',
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Section Title */}
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            },
            needsManualRTL && { flexDirection: 'row-reverse' },
          ]}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: colors.text,
            }}
          >
            {searchQuery ? t('home.allClinics') : t('home.featuredClinics')}
          </Text>
          {!searchQuery && (
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.primary,
                }}
              >
                {t('home.viewAll')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Clinics List */}
        {filteredClinics.length === 0 ? (
          <EmptyState
            icon="medical-outline"
            title={t('home.noClinics')}
            subtitle={t('home.noClinicsSubtitle')}
          />
        ) : (
          filteredClinics.map((clinic) => (
            <ClinicCard
              key={clinic.id}
              clinic={clinic}
              onPress={() => handleClinicPress(clinic)}
              onBookPress={() => handleBookPress(clinic)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
