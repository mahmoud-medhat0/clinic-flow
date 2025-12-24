import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/LanguageContext';

function ThemeToggleButton() {
  const { isDark, setThemeMode, colors } = useTheme();
  const { isRTL } = useTranslation();

  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        marginLeft: isRTL ? 16 : 0,
        marginRight: isRTL ? 0 : 16,
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.surfaceSecondary,
      }}
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={20}
        color={isDark ? '#fbbf24' : '#6366f1'}
      />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerRight: () => <ThemeToggleButton />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: t('tabs.book'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={26}
              color={color}
            />
          ),
          headerTitle: t('booking.title'),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: t('tabs.appointments'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={24}
              color={color}
            />
          ),
          headerTitle: t('appointments.title'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
          ),
          headerTitle: t('profile.title'),
        }}
      />
    </Tabs>
  );
}

