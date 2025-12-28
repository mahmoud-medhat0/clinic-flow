import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, I18nManager, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const { patient, updateProfile } = useAuth();

  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [name, setName] = useState(patient?.name || '');
  const [phone, setPhone] = useState(patient?.phone || '');
  const [email, setEmail] = useState(patient?.email || '');
  const [dateOfBirth, setDateOfBirth] = useState(patient?.dateOfBirth || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = t('errors.nameRequired');
    }
    
    if (!phone.trim()) {
      newErrors.phone = t('errors.phoneRequired');
    }
    
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await updateProfile({
        name,
        phone,
        email,
        dateOfBirth,
      });
      
      Alert.alert(
        t('common.done'),
        'Profile updated successfully',
        [{ text: t('common.close'), onPress: () => router.back() }]
      );
    } catch (err) {
      Alert.alert(t('common.error'), t('errors.server'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: t('profile.editProfile'),
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 16 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={{ marginBottom: 16 }}>
          <Input
            label={t('profile.name')}
            value={name}
            onChangeText={setName}
            placeholder={t('auth.fullNamePlaceholder')}
            error={errors.name}
            autoCapitalize="words"
          />

          <Input
            label={t('profile.phone')}
            value={phone}
            onChangeText={setPhone}
            placeholder={t('auth.phonePlaceholder')}
            error={errors.phone}
            keyboardType="phone-pad"
          />

          <Input
            label={t('profile.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.emailPlaceholder')}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label={t('profile.dateOfBirth')}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="DD/MM/YYYY"
          />
        </Card>

        <Button
          title={t('common.save')}
          onPress={handleSave}
          loading={isLoading}
          fullWidth
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});
