import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/LanguageContext';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'success' | 'warning' | 'info';
  icon?: keyof typeof Ionicons.glyphMap;
}

export function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = 'info',
  icon
}: ConfirmationModalProps) {
  const { colors, isDark } = useTheme();
  const { isRTL, t } = useTranslation();

  const needsManualRTL = isRTL && !I18nManager.isRTL;

  const getThemeColor = () => {
    switch (type) {
      case 'danger': return colors.danger;
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      default: return colors.primary;
    }
  };

  const themeColor = getThemeColor();
  const getDefaultIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'danger': return 'alert-circle';
      case 'warning': return 'warning';
      case 'success': return 'checkmark-circle';
      default: return 'information-circle';
    }
  };
  const defaultIcon = getDefaultIcon();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.header, needsManualRTL && styles.rtlHeader]}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? `${themeColor}20` : `${themeColor}15` }]}>
                  <Ionicons name={icon || defaultIcon} size={28} color={themeColor} />
                </View>
                <Text style={[styles.title, { color: colors.text, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                  {title}
                </Text>
              </View>

              <Text style={[styles.message, { color: colors.textSecondary, textAlign: needsManualRTL ? 'right' : 'left' }]}>
                {message}
              </Text>

              <View style={[styles.actions, needsManualRTL && styles.rtlRow]}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, { color: colors.text }]}>
                    {cancelText || t('common.cancel')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.confirmButton, { backgroundColor: themeColor }]}
                  onPress={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  <Text style={[styles.buttonText, { color: '#fff' }]}>
                    {confirmText || t('common.confirm')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  rtlHeader: {},
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  confirmButton: {},
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
