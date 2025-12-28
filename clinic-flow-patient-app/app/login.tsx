import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, I18nManager } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const { login, isLoading } = useAuth();

  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = t('common.required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('errors.emailInvalid');
    }
    
    if (!password.trim()) {
      newErrors.password = t('common.required');
    } else if (password.length < 6) {
      newErrors.password = t('errors.passwordMin');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    try {
      await login({ email, password });
      router.replace('/(tabs)');
    } catch (err) {
      setErrors({ email: t('errors.unauthorized') });
    }
  };

  const handleGuestContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
          paddingTop: insets.top + 60,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: insets.top + 12,
            [isRTL ? 'right' : 'left']: 20,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={isRTL ? 'arrow-forward' : 'arrow-back'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              backgroundColor: colors.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Ionicons name="medical" size={40} color={colors.primary} />
          </View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: colors.text,
              marginBottom: 8,
            }}
          >
            {t('auth.welcomeBack')}
          </Text>
          <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: 'center' }}>
            {t('auth.loginSubtitle')}
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16 }}>
          <Input
            label={t('auth.email')}
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textMuted} />}
          />

          <Input
            label={t('auth.password')}
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
            error={errors.password}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity style={{ alignSelf: isRTL ? 'flex-start' : 'flex-end' }}>
            <Text style={{ color: colors.primary, fontWeight: '500' }}>
              {t('auth.forgotPassword')}
            </Text>
          </TouchableOpacity>

          {/* Demo User Quick Fill */}
          <TouchableOpacity 
            onPress={() => {
              // Use guest mode for demo in production
              router.replace('/(tabs)');
            }}
            style={{
              marginTop: 8,
              padding: 12,
              backgroundColor: `${colors.primary}10`,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: `${colors.primary}30`,
              borderStyle: 'dashed',
            }}
          >
            <View style={[
              { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
              needsManualRTL && { flexDirection: 'row-reverse' },
            ]}>
              <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>
                {t('auth.continueAsGuest')}
              </Text>
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 4 }}>
              {t('auth.guestSubtitle') || 'No login required'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <View style={{ marginTop: 32, gap: 16 }}>
          <Button
            title={t('auth.loginButton')}
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            size="lg"
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            <Text style={{ color: colors.textMuted }}>{t('auth.orContinueWith')}</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </View>

          <Button
            title={t('auth.continueAsGuest')}
            onPress={handleGuestContinue}
            variant="outline"
            fullWidth
          />
        </View>

        {/* Register Link */}
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'center',
            marginTop: 32,
            gap: 4,
          }}
        >
          <Text style={{ color: colors.textSecondary }}>{t('auth.noAccount')}</Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>
              {t('auth.signUp')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
