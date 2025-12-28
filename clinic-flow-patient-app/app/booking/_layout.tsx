import { Stack } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { I18nManager } from 'react-native';

export default function BookingLayout() {
  const { colors } = useTheme();
  const { isRTL,t } = useTranslation();
  const needsManualRTL = isRTL && !I18nManager.isRTL;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('booking.title'),
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
