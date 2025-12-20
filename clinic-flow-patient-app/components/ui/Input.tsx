import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  required,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  const { colors } = useTheme();
  const { isRTL } = useLanguage();

  return (
    <View style={{ width: '100%' }}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: colors.text,
            marginBottom: 6,
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          {label}
          {required && <Text style={{ color: colors.danger }}> *</Text>}
        </Text>
      )}
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.border,
          borderRadius: 12,
          paddingHorizontal: 12,
        }}
      >
        {leftIcon && (
          <View style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }}>
            {leftIcon}
          </View>
        )}
        <TextInput
          {...props}
          style={{
            flex: 1,
            paddingVertical: 14,
            fontSize: 16,
            color: colors.text,
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr',
          }}
          placeholderTextColor={colors.textMuted}
        />
        {rightIcon && (
          <View style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && (
        <Text
          style={{
            fontSize: 12,
            color: colors.danger,
            marginTop: 4,
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
