import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/LanguageContext';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
}

export function SuccessModal({
  visible,
  onClose,
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
}: SuccessModalProps) {
  const { colors, isDark } = useTheme();
  const { isRTL } = useTranslation();

  const needsManualRTL = isRTL && !I18nManager.isRTL;

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
              {/* Success Icon */}
              <View style={[styles.iconContainer, { backgroundColor: isDark ? `${colors.success}20` : `${colors.success}15` }]}>
                <Ionicons name="checkmark-circle" size={64} color={colors.success} />
              </View>

              {/* Title */}
              <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>
                {title}
              </Text>

              {/* Message */}
              <Text style={[styles.message, { color: colors.textSecondary, textAlign: 'center' }]}>
                {message}
              </Text>

              {/* Actions */}
              <View style={[styles.actions, needsManualRTL && styles.rtlRow]}>
                {secondaryButtonText && onSecondaryPress && (
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton, { borderColor: colors.border }]}
                    onPress={() => {
                      onSecondaryPress();
                      onClose();
                    }}
                  >
                    <Text style={[styles.buttonText, { color: colors.text }]}>
                      {secondaryButtonText}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.button, 
                    styles.primaryButton, 
                    { backgroundColor: colors.primary },
                    !secondaryButtonText && { width: '100%' }
                  ]}
                  onPress={() => {
                    onPrimaryPress();
                    onClose();
                  }}
                >
                  <Text style={[styles.buttonText, { color: '#fff' }]}>
                    {primaryButtonText}
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  primaryButton: {},
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
