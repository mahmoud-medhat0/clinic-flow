import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function LoadingState({ 
  message, 
  size = 'large',
  fullScreen = false 
}: LoadingStateProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const content = (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <ActivityIndicator size={size} color={colors.primary} />
      <Text
        style={{
          marginTop: 16,
          fontSize: 15,
          color: colors.textSecondary,
          textAlign: 'center',
        }}
      >
        {message || t('common.loading')}
      </Text>
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        {content}
      </View>
    );
  }

  return content;
}
