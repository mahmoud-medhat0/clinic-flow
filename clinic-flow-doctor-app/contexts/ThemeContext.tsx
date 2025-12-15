import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  teal: string;
  tealLight: string;
  border: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  card: string;
  shadow: string;
}

const lightColors: ThemeColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceSecondary: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  primary: '#0ea5e9',
  primaryLight: '#e0f2fe',
  teal: '#14b8a6',
  tealLight: '#ccfbf1',
  border: '#e2e8f0',
  success: '#22c55e',
  successLight: '#dcfce7',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  card: '#ffffff',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkColors: ThemeColors = {
  background: '#0f172a',
  surface: '#1e293b',
  surfaceSecondary: '#334155',
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  textMuted: '#64748b',
  primary: '#38bdf8',
  primaryLight: '#0c4a6e',
  teal: '#2dd4bf',
  tealLight: '#134e4a',
  border: '#334155',
  success: '#4ade80',
  successLight: '#14532d',
  warning: '#fbbf24',
  warningLight: '#713f12',
  danger: '#f87171',
  dangerLight: '#7f1d1d',
  card: '#1e293b',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const isDark = mode === 'system' 
    ? systemColorScheme === 'dark' 
    : mode === 'dark';

  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = useCallback(() => {
    setMode(current => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'light';
      return isDark ? 'light' : 'dark';
    });
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ mode, isDark, colors, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
