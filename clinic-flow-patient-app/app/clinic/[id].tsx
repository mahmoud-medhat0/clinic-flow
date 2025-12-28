import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, I18nManager } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useBooking } from '../../contexts/BookingContext';
import { clinicsApi, Clinic } from '../../services/clinics';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function ClinicDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const { setClinic } = useBooking();

  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [clinic, setClinicData] = useState<Clinic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClinic();
  }, [id]);

  const loadClinic = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await clinicsApi.getById(id);
      setClinicData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.server'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookPress = () => {
    if (!clinic) return;
    setClinic(clinic.id, clinic.name);
    router.push('/booking');
  };

  const handleCall = () => {
    if (clinic?.phone) {
      Linking.openURL(`tel:${clinic.phone}`);
    }
  };

  const handleEmail = () => {
    if (clinic?.email) {
      Linking.openURL(`mailto:${clinic.email}`);
    }
  };

  if (isLoading) {
    return <LoadingState fullScreen />;
  }

  if (error || !clinic) {
    return <ErrorState message={error || t('errors.notFound')} onRetry={loadClinic} />;
  }

  return (
    <>
      <Stack.Screen options={{ title: clinic.name }} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Image */}
          <Image
            source={{ uri: clinic.image }}
            style={{ width: '100%', height: 220 }}
            resizeMode="cover"
          />

          {/* Content */}
          <View style={{ padding: 16, marginTop: -24 }}>
            {/* Main Info Card */}
            <Card variant="elevated" style={{ marginBottom: 16 }}>
              <View style={[
                { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
                needsManualRTL && { flexDirection: 'row-reverse' },
              ]}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, textAlign: isRTL ? 'right' : 'left', marginBottom: 8 }}>
                    {clinic.name}
                  </Text>
                  <View style={[
                    { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
                    needsManualRTL && { flexDirection: 'row-reverse' },
                  ]}>
                    <Ionicons name="star" size={18} color="#f59e0b" />
                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, marginHorizontal: 4 }}>
                      {clinic.rating.toFixed(1)}
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.textMuted }}>
                      ({clinic.reviewCount} {t('clinic.reviewCount')})
                    </Text>
                  </View>
                </View>
                <View style={{ backgroundColor: clinic.isOpen ? colors.successLight : colors.dangerLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                  <Text style={{ color: clinic.isOpen ? colors.success : colors.danger, fontWeight: '600', fontSize: 12 }}>
                    {clinic.isOpen ? t('clinic.openNow') : t('clinic.closed')}
                  </Text>
                </View>
              </View>

              {/* Location */}
              <View style={[
                { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
                needsManualRTL && { flexDirection: 'row-reverse' },
              ]}>
                <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
                <Text style={{ flex: 1, fontSize: 14, color: colors.textSecondary, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0, textAlign: isRTL ? 'right' : 'left' }}>
                  {clinic.address}
                </Text>
              </View>
            </Card>

            {/* About */}
            {clinic.description && (
              <Card variant="outlined" style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('clinic.about')}
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22, textAlign: isRTL ? 'right' : 'left' }}>
                  {clinic.description}
                </Text>
              </Card>
            )}

            {/* Services */}
            {clinic.services?.length > 0 && (
              <Card variant="outlined" style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('clinic.services')}
                </Text>
                <View style={[
                  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
                  needsManualRTL && { flexDirection: 'row-reverse' },
                ]}>
                  {clinic.services.map((service) => (
                    <View key={service.id} style={{ backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                      <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '500' }}>
                        {service.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {/* Contact */}
            <Card variant="outlined" style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>
                {t('clinic.contact')}
              </Text>
              <View style={{ gap: 12 }}>
                <TouchableOpacity onPress={handleCall} style={[
                  { flexDirection: 'row', alignItems: 'center' },
                  needsManualRTL && { flexDirection: 'row-reverse' },
                ]}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="call" size={20} color={colors.primary} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 15, color: colors.text, marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0, textAlign: isRTL ? 'right' : 'left' }}>
                    {clinic.phone}
                  </Text>
                  <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={colors.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEmail} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.tealLight, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="mail" size={20} color={colors.teal} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 15, color: colors.text, marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0, textAlign: isRTL ? 'right' : 'left' }}>
                    {clinic.email}
                  </Text>
                  <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </Card>

            {/* Opening Hours */}
            {clinic.openingHours?.length > 0 && (
              <Card variant="outlined" style={{ marginBottom: 100 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('clinic.openingHours')}
                </Text>
                {clinic.openingHours.map((hour, index) => (
                  <View key={index} style={[
                    { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: index < clinic.openingHours.length - 1 ? 1 : 0, borderBottomColor: colors.borderLight },
                    needsManualRTL && { flexDirection: 'row-reverse' },
                  ]}>
                    <Text style={{ fontSize: 14, color: colors.text }}>{hour.day}</Text>
                    <Text style={{ fontSize: 14, color: hour.isClosed ? colors.danger : colors.textSecondary }}>
                      {hour.isClosed ? t('clinic.closed') : `${hour.open} - ${hour.close}`}
                    </Text>
                  </View>
                ))}
              </Card>
            )}
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 32, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Button
            title={t('clinic.bookAppointment')}
            onPress={handleBookPress}
            fullWidth
            size="lg"
            icon={<Ionicons name="calendar" size={20} color="white" />}
          />
        </View>
      </View>
    </>
  );
}
