import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface QuickActionButtonProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  onPress: () => void;
}

export function QuickActionButton({ label, icon, color, onPress }: QuickActionButtonProps) {
  const { colors, isDark } = useTheme();
  const buttonColor = color || colors.primary;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isDark ? `${buttonColor}30` : `${buttonColor}15` },
        ]}
      >
        <Ionicons name={icon} size={24} color={buttonColor} />
      </View>
      <Text style={[styles.label, { color: colors.text }]} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
