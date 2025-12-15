import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import '../global.css';

import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AppProvider } from '../contexts/AppContext';

function RootLayoutContent() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="appointment/[id]"
          options={{
            title: 'Appointment Details',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="patient/[id]"
          options={{
            title: 'Patient Profile',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="inventory/item/[id]"
          options={{
            title: 'Item Details',
            presentation: 'card',
          }}
        />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="notifications"
          options={{
            presentation: 'modal',
          }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AppProvider>
            <RootLayoutContent />
          </AppProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
