import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder }: SearchBarProps) {
  const { colors } = useTheme();
  const { isRTL } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }, isRTL && styles.rtlContainer]}>
      <Ionicons name="search-outline" size={20} color={colors.textMuted} />
      <TextInput
        style={[styles.input, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
      />
      {value.length > 0 && (
        <Ionicons
          name="close-circle"
          size={20}
          color={colors.textMuted}
          onPress={() => onChangeText('')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  rtlContainer: {
    flexDirection: 'row-reverse',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
});
