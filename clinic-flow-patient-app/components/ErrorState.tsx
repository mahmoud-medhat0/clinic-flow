import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { Button } from './ui/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.dangerLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
      </View>
      
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: colors.text,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {t('common.error')}
      </Text>
      
      <Text
        style={{
          fontSize: 14,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
          maxWidth: 280,
          marginBottom: 24,
        }}
      >
        {message || t('errors.server')}
      </Text>

      {onRetry && (
        <Button
          title={t('common.retry')}
          onPress={onRetry}
          variant="primary"
          icon={<Ionicons name="refresh" size={18} color="white" />}
        />
      )}
    </View>
  );
}
