import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = t('errors.nameRequired');
    }
    
    if (!email.trim()) {
      newErrors.email = t('common.required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('errors.emailInvalid');
    }
    
    if (!phone.trim()) {
      newErrors.phone = t('errors.phoneRequired');
    }
    
    if (!password.trim()) {
      newErrors.password = t('common.required');
    } else if (password.length < 6) {
      newErrors.password = t('errors.passwordMin');
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordMatch');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    try {
      await register({
        name,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
      });
      router.replace('/(tabs)');
    } catch (err) {
      setErrors({ email: t('errors.validation') });
    }
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
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: colors.text,
              marginBottom: 8,
            }}
          >
            {t('auth.createAccount')}
          </Text>
          <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: 'center' }}>
            {t('auth.registerSubtitle')}
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16 }}>
          <Input
            label={t('auth.fullName')}
            placeholder={t('auth.fullNamePlaceholder')}
            value={name}
            onChangeText={setName}
            autoComplete="name"
            error={errors.name}
            leftIcon={<Ionicons name="person-outline" size={20} color={colors.textMuted} />}
          />

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
            label={t('auth.phone')}
            placeholder={t('auth.phonePlaceholder')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
            error={errors.phone}
            required
            leftIcon={<Ionicons name="call-outline" size={20} color={colors.textMuted} />}
          />

          <Input
            label={t('auth.password')}
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="new-password"
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

          <Input
            label={t('auth.confirmPassword')}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            error={errors.confirmPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />}
          />
        </View>

        {/* Register Button */}
        <View style={{ marginTop: 32 }}>
          <Button
            title={t('auth.registerButton')}
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            size="lg"
          />
        </View>

        {/* Terms */}
        <Text
          style={{
            fontSize: 12,
            color: colors.textMuted,
            textAlign: 'center',
            marginTop: 16,
            lineHeight: 18,
          }}
        >
          {t('auth.termsAgree')}{' '}
          <Text style={{ color: colors.primary }}>{t('auth.termsOfService')}</Text>
          {' '}{t('auth.and')}{' '}
          <Text style={{ color: colors.primary }}>{t('auth.privacyPolicy')}</Text>
        </Text>

        {/* Login Link */}
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'center',
            marginTop: 24,
            gap: 4,
          }}
        >
          <Text style={{ color: colors.textSecondary }}>{t('auth.hasAccount')}</Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>
              {t('auth.login')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
