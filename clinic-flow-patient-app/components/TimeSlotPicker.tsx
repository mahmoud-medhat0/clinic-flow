import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, useTranslation } from '../contexts/LanguageContext';
import type { TimeSlot } from '../services/clinics';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlotPicker({ slots, selectedTime, onSelect }: TimeSlotPickerProps) {
  const { colors } = useTheme();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();

  if (slots.length === 0) {
    return (
      <View style={{ padding: 24, alignItems: 'center' }}>
        <Text style={{ fontSize: 15, color: colors.textMuted, textAlign: 'center' }}>
          {t('booking.noSlots')}
        </Text>
        <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 4, textAlign: 'center' }}>
          {t('booking.noSlotsSubtitle')}
        </Text>
      </View>
    );
  }

  // Group slots into rows of 4
  const rows: TimeSlot[][] = [];
  for (let i = 0; i < slots.length; i += 4) {
    rows.push(slots.slice(i, i + 4));
  }

  return (
    <View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 12,
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        {t('booking.selectTime')}
      </Text>
      
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            marginBottom: 10,
            gap: 10,
          }}
        >
          {row.map((slot) => {
            const isSelected = selectedTime === slot.time;
            const isDisabled = !slot.available;

            return (
              <TouchableOpacity
                key={slot.time}
                onPress={() => !isDisabled && onSelect(slot.time)}
                disabled={isDisabled}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderRadius: 10,
                  backgroundColor: isSelected
                    ? colors.primary
                    : isDisabled
                    ? colors.surfaceSecondary
                    : colors.surface,
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: isSelected
                      ? colors.white
                      : isDisabled
                      ? colors.textMuted
                      : colors.text,
                  }}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            );
          })}
          {/* Fill empty slots in last row */}
          {row.length < 4 &&
            Array(4 - row.length)
              .fill(null)
              .map((_, i) => <View key={`empty-${i}`} style={{ flex: 1 }} />)}
        </View>
      ))}
    </View>
  );
}
