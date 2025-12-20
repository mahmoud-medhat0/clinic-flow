import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';

type Language = 'en' | 'ar' | 'fr';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { language, changeLanguage, isRTL } = useLanguage();
  const { doctor, unreadNotificationsCount } = useApp();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: t('settings.english') },
    { code: 'ar', label: t('settings.arabic') },
    { code: 'fr', label: t('settings.french') },
  ];

  const doctorName = language === 'ar' && doctor.nameAr ? doctor.nameAr : doctor.name;
  const clinicName = language === 'ar' && doctor.clinicNameAr ? doctor.clinicNameAr : doctor.clinicName;

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<Language | null>(null);

  const handleLogout = () => {
    router.replace('/login');
  };

  const handleLanguageChange = (lang: Language) => {
    const currentIsRTL = language === 'ar';
    const newIsRTL = lang === 'ar';
    
    // If RTL direction will change, show confirmation
    if (currentIsRTL !== newIsRTL) {
      setPendingLanguage(lang);
    } else {
      // Same direction, change immediately
      changeLanguage(lang);
    }
  };

  const   confirmLanguageChange = () => {
    if (pendingLanguage) {
      changeLanguage(pendingLanguage);
      setPendingLanguage(null);
    }
  };

  // Format 24h time to 12h AM/PM
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );

  const SettingRow = ({
    icon,
    label,
    value,
    onPress,
    rightContent,
    showChevron = true,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    rightContent?: React.ReactNode;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.settingRow, isRTL && styles.rtlRow]}
      onPress={onPress}
      disabled={!onPress && !rightContent}
    >
      <View style={[styles.settingLeft, isRTL && styles.rtlRow]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }, isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={[styles.settingLabel, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
      </View>
      <View style={[styles.settingRight, isRTL && styles.rtlRow]}>
        {value && <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>}
        {rightContent}
        {showChevron && onPress && (
          <Ionicons
            name={isRTL ? 'chevron-back' : 'chevron-forward'}
            size={20}
            color={colors.textMuted}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Doctor Info */}
        <Section title={t('settings.doctorInfo')}>
          <View style={[styles.profileHeader, isRTL && styles.rtlRow]}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryLight }, isRTL ? {marginLeft: 16, marginRight: 0} : {marginRight: 16}]}>
              <Ionicons name="person" size={32} color={colors.primary} />
            </View>
            <View style={[styles.profileInfo, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={[styles.profileName, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>{doctorName}</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {doctor.email}
              </Text>
            </View>
          </View>
        </Section>

        {/* Clinic Info */}
        <Section title={t('settings.clinicInfo')}>
          <SettingRow icon="business-outline" label={clinicName || 'Clinic'} showChevron={false} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {/* Working Schedule */}
          <View style={[styles.scheduleContainer, isRTL && styles.rtlRow]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }, isRTL ? {marginLeft: 12, marginRight: 0} : {marginRight: 12}]}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.scheduleContent}>
              <Text style={[styles.settingLabel, { color: colors.text, marginBottom: 10, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('settings.workingDays')}
              </Text>
              {doctor.schedule?.map((item) => (
                <View 
                  key={item.day} 
                  style={[
                    styles.scheduleRow,
                    { opacity: item.isActive ? 1 : 0.4 },
                    isRTL && styles.rtlRow
                  ]}
                >
                  <Text style={[styles.scheduleDay, { color: colors.text }]}>
                    {t(`days.${item.day}`)}
                  </Text>
                  <Text style={[styles.scheduleTime, { color: item.isActive ? colors.primary : colors.textMuted }]}>
                    {item.isActive ? `${formatTime(item.start)} - ${formatTime(item.end)}` : t('common.closed')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Section>

        {/* Notifications */}
        <Section title={t('settings.notifications')}>
          <SettingRow 
            icon="notifications-outline" 
            label={t('notifications.title')} 
            onPress={() => router.push('/notifications')}
            rightContent={
              unreadNotificationsCount > 0 ? (
                <View style={[styles.badge, { backgroundColor: colors.danger }]} />
              ) : null
            }
          />
        </Section>

        {/* Language */}
        <Section title={t('settings.language')}>
          {languages.map((lang, index) => (
            <React.Fragment key={lang.code}>
              {index > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <TouchableOpacity
                style={[styles.settingRow, isRTL && styles.rtlRow]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text style={[styles.settingLabel, { color: colors.text }]}>{lang.label}</Text>
                {language === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </Section>

        <ConfirmationModal
          visible={pendingLanguage !== null}
          title={t('settings.language')}
          message={
            pendingLanguage === 'ar'
              ? 'Changing to Arabic requires app restart to apply RTL layout. Continue?'
              : language === 'ar' 
                ? 'تغيير اللغة يتطلب إعادة تشغيل التطبيق. هل تريد المتابعة؟'
                : 'Changing language requires app restart. Continue?'
          }
          type="warning"
          onConfirm={confirmLanguageChange}
          onClose={() => setPendingLanguage(null)}
        />

        {/* Theme */}
        <Section title={t('settings.theme')}>
          <View style={[styles.settingRow, isRTL && styles.rtlRow]}>
            <View style={[styles.settingLeft, isRTL && styles.rtlRow]}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }, isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }]}>
                <Ionicons
                  name={isDark ? 'moon' : 'sunny'}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.settingLabel, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {isDark ? t('settings.darkMode') : t('settings.lightMode')}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </Section>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.dangerLight }, isRTL && styles.rtlRow]}
          onPress={() => setShowLogoutModal(true)}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>
            {t('settings.logout')}
          </Text>
        </TouchableOpacity>

        <ConfirmationModal
          visible={showLogoutModal}
          title={t('settings.logout')}
          message={language === 'ar' ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?'}
          type="danger"
          onConfirm={handleLogout}
          onClose={() => setShowLogoutModal(false)}
        />

        {/* App Version */}
        <Text style={[styles.version, { color: colors.textMuted }]}>
          ClinicFlow Doctor v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionContent: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    width: '80%',
    fontSize: 15,
  },
  settingValue: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 10,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
  },
  workingDaysContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  workingDaysContent: {
    flex: 1,
  },
  dayPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  dayPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scheduleContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  scheduleDay: {
    fontSize: 14,
    fontWeight: '500',
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
});
