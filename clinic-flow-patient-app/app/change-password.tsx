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

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const { changePassword } = useAuth();

  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = t('errors.passwordMin');
    }
    
    if (!newPassword || newPassword.length < 6) {
      newErrors.newPassword = t('errors.passwordMin');
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await changePassword(currentPassword, newPassword);
      
      Alert.alert(
        t('common.done'),
        'Password changed successfully',
        [{ text: t('common.close'), onPress: () => router.back() }]
      );
    } catch (err) {
      Alert.alert(t('common.error'), 'Current password is incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: t('profile.changePassword'),
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
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              marginBottom: 16,
              textAlign: needsManualRTL ? 'right' : 'left',
            }}
          >
            Please enter your current password and choose a new password.
          </Text>

          <Input
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            error={errors.currentPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={t('auth.passwordPlaceholder')}
            error={errors.newPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label={t('auth.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            error={errors.confirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </Card>

        <Button
          title={t('common.save')}
          onPress={handleChangePassword}
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
