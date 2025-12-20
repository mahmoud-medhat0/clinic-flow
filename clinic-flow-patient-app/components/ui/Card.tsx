import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  style,
  ...props
}: CardProps) {
  const { colors, isDark } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return 12;
      case 'lg': return 20;
      default: return 16;
    }
  };

  const getStyle = () => {
    const base = {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: getPadding(),
    };

    switch (variant) {
      case 'elevated':
        return {
          ...base,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'outlined':
        return {
          ...base,
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return base;
    }
  };

  return (
    <View style={[getStyle(), style]} {...props}>
      {children}
    </View>
  );
}
