import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation, useLanguage, Language } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import Constants from 'expo-constants';

type ThemeMode = 'light' | 'dark' | 'system';

export default function ProfileScreen() {
  const { colors, themeMode, setThemeMode, isDark } = useTheme();
  const { t, isRTL } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { patient, isAuthenticated, isGuest, logout } = useAuth();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
  ];

  const themes: { code: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { code: 'light', label: 'Light', icon: 'sunny-outline' },
    { code: 'dark', label: 'Dark', icon: 'moon-outline' },
    { code: 'system', label: 'System', icon: 'phone-portrait-outline' },
  ];

  const handleLanguageChange = async (lang: Language) => {
    await changeLanguage(lang);
    setShowLanguagePicker(false);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    setShowThemePicker(false);
  };

  const getThemeLabel = () => {
    const theme = themes.find(t => t.code === themeMode);
    return theme?.label || 'System';
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const MenuRow = ({
    icon,
    label,
    value,
    onPress,
    showChevron = true,
    danger = false,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: danger ? colors.dangerLight : colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: isRTL ? 0 : 12,
          marginLeft: isRTL ? 12 : 0,
        }}
      >
        <Ionicons
          name={icon}
          size={20}
          color={danger ? colors.danger : colors.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '500',
            color: danger ? colors.danger : colors.text,
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          {label}
        </Text>
      </View>
      {value && (
        <Text
          style={{
            fontSize: 14,
            color: colors.textMuted,
            marginRight: isRTL ? 0 : 8,
            marginLeft: isRTL ? 8 : 0,
          }}
        >
          {value}
        </Text>
      )}
      {showChevron && onPress && (
        <Ionicons
          name={isRTL ? 'chevron-back' : 'chevron-forward'}
          size={20}
          color={colors.textMuted}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <Card style={{ marginBottom: 16, alignItems: 'center', paddingVertical: 24 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}
        >
          <Ionicons name="person" size={36} color={colors.primary} />
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 4,
          }}
        >
          {patient?.name || t('profile.guest')}
        </Text>
        {isGuest && (
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              textAlign: 'center',
            }}
          >
            {t('profile.guestMessage')}
          </Text>
        )}
        {patient?.phone && (
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            {patient.phone}
          </Text>
        )}
      </Card>

      {/* Login/Register for Guests */}
      {!isAuthenticated && (
        <Card style={{ marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => router.push('/login')}
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 14,
              backgroundColor: colors.primary,
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <Ionicons name="log-in-outline" size={20} color={colors.white} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.white,
                marginLeft: isRTL ? 0 : 8,
                marginRight: isRTL ? 8 : 0,
              }}
            >
              {t('profile.login')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/register')}
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 14,
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.primary,
            }}
          >
            <Ionicons name="person-add-outline" size={20} color={colors.primary} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.primary,
                marginLeft: isRTL ? 0 : 8,
                marginRight: isRTL ? 8 : 0,
              }}
            >
              {t('profile.register')}
            </Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Preferences */}
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: colors.textMuted,
          textTransform: 'uppercase',
          marginBottom: 8,
          textAlign: isRTL ? 'right' : 'left',
          marginLeft: isRTL ? 0 : 4,
          marginRight: isRTL ? 4 : 0,
        }}
      >
        {t('profile.preferences')}
      </Text>
      <Card style={{ marginBottom: 16 }}>
        {/* Language Picker */}
        <MenuRow
          icon="language-outline"
          label={t('profile.language')}
          value={t(`languages.${language}`)}
          onPress={() => {
            setShowLanguagePicker(!showLanguagePicker);
            setShowThemePicker(false);
          }}
        />
        {showLanguagePicker && (
          <View
            style={{
              paddingVertical: 8,
              paddingLeft: isRTL ? 0 : 48,
              paddingRight: isRTL ? 48 : 0,
            }}
          >
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleLanguageChange(lang.code)}
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color:
                      language === lang.code ? colors.primary : colors.text,
                    fontWeight: language === lang.code ? '600' : '400',
                  }}
                >
                  {lang.label}
                </Text>
                {language === lang.code && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Dark Mode Picker */}
        <MenuRow
          icon={isDark ? 'moon' : 'sunny-outline'}
          label="Theme"
          value={getThemeLabel()}
          onPress={() => {
            setShowThemePicker(!showThemePicker);
            setShowLanguagePicker(false);
          }}
        />
        {showThemePicker && (
          <View
            style={{
              paddingVertical: 8,
              paddingLeft: isRTL ? 0 : 48,
              paddingRight: isRTL ? 48 : 0,
            }}
          >
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.code}
                onPress={() => handleThemeChange(theme.code)}
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                }}
              >
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons 
                    name={theme.icon} 
                    size={18} 
                    color={themeMode === theme.code ? colors.primary : colors.textMuted} 
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: themeMode === theme.code ? colors.primary : colors.text,
                      fontWeight: themeMode === theme.code ? '600' : '400',
                    }}
                  >
                    {theme.label}
                  </Text>
                </View>
                {themeMode === theme.code && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <MenuRow
          icon="notifications-outline"
          label={t('profile.notifications')}
          onPress={() => {}}
        />
      </Card>

      {/* Account Section (for logged in users) */}
      {isAuthenticated && (
        <>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: colors.textMuted,
              textTransform: 'uppercase',
              marginBottom: 8,
              textAlign: isRTL ? 'right' : 'left',
              marginLeft: isRTL ? 0 : 4,
              marginRight: isRTL ? 4 : 0,
            }}
          >
            {t('profile.account')}
          </Text>
          <Card style={{ marginBottom: 16 }}>
            <MenuRow
              icon="create-outline"
              label={t('profile.editProfile')}
              onPress={() => {}}
            />
            <MenuRow
              icon="lock-closed-outline"
              label={t('profile.changePassword')}
              onPress={() => {}}
            />
            <MenuRow
              icon="log-out-outline"
              label={t('profile.logout')}
              onPress={handleLogout}
              danger
              showChevron={false}
            />
          </Card>
        </>
      )}

      {/* Version */}
      <Text
        style={{
          fontSize: 12,
          color: colors.textMuted,
          textAlign: 'center',
          marginTop: 16,
        }}
      >
        {t('profile.version')} {Constants.expoConfig?.version || '1.0.0'}
      </Text>
    </ScrollView>
  );
}
