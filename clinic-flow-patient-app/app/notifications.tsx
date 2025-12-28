import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation, useLanguage } from '../contexts/LanguageContext';
import { NotificationType, mockNotifications } from '../data/notifications';

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const router = useRouter();

  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const [notifications, setNotifications] = React.useState(mockNotifications);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handlePress = (notification: typeof notifications[0]) => {
    // Mark as read
    markNotificationAsRead(notification.id);
    
    // Navigate if actionUrl exists
    if (notification.actionUrl) {
      router.push(notification.actionUrl as any);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'appointment': return 'calendar';
      case 'reminder': return 'time';
      case 'system': return 'information-circle';
      default: return 'notifications';
    }
  };

  const getColor = (type: NotificationType) => {
    switch (type) {
      case 'appointment': return colors.primary;
      case 'reminder': return '#f59e0b';
      case 'system': return colors.teal;
      default: return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: t('profile.notifications'),
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerRight: () => (
            <TouchableOpacity 
              onPress={markAllNotificationsAsRead}
              style={{
                marginRight: needsManualRTL ? 0 : 16,
                marginLeft: needsManualRTL ? 16 : 0,
              }}
            >
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                {t('notifications.markAllRead') || 'Mark All Read'}
              </Text>
            </TouchableOpacity>
          ),
        }} 
      />

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              { 
                backgroundColor: item.read ? colors.background : colors.surface,
                borderColor: colors.border,
              },
              needsManualRTL && styles.rtlItem
            ]}
            onPress={() => handlePress(item)}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${getColor(item.type)}20` }]}>
              <Ionicons name={getIcon(item.type)} size={24} color={getColor(item.type)} />
            </View>
            <View style={[styles.content, needsManualRTL && { alignItems: 'flex-end' }]}>
              <View style={[styles.header, needsManualRTL && styles.rtlHeader]}>
                <Text style={[styles.title, { color: colors.text, fontWeight: item.read ? '500' : '700', textAlign: needsManualRTL ? 'right' : 'left' }]}>
                  {item.title}
                </Text>
                <Text style={[styles.time, { color: colors.textMuted }]}>{item.time}</Text>
              </View>
              <Text 
                style={[styles.message, { color: colors.textSecondary, textAlign: needsManualRTL ? 'right' : 'left' }]}
                numberOfLines={2}
              >
                {item.message}
              </Text>
            </View>
            {!item.read && (
              <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('notifications.empty') || 'No notifications'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {t('notifications.emptySubtitle') || 'You\'re all caught up!'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 16,
  },
  rtlItem: {
    flexDirection: 'row-reverse',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  rtlHeader: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
  time: {
    fontSize: 12,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
  },
});
