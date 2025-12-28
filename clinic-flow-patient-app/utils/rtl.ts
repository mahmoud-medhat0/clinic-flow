import { ViewStyle, TextStyle } from 'react-native';

/**
 * RTL Utility Functions
 * Provides reusable style helpers for consistent RTL support across the app
 */

/**
 * Returns row-reverse flex direction when RTL is needed
 */
export const getRTLFlexStyle = (needsManualRTL: boolean): ViewStyle => ({
    flexDirection: needsManualRTL ? 'row-reverse' : 'row',
});

/**
 * Returns appropriate text alignment for RTL
 */
export const getRTLTextAlign = (needsManualRTL: boolean): TextStyle => ({
    textAlign: needsManualRTL ? 'right' : 'left',
});

/**
 * Returns appropriate margin for icons in RTL (left margin in RTL, right margin in LTR)
 */
export const getRTLIconMargin = (needsManualRTL: boolean, margin: number = 12): ViewStyle =>
    needsManualRTL
        ? { marginLeft: margin, marginRight: 0 }
        : { marginRight: margin, marginLeft: 0 };

/**
 * Returns flex-end alignment when RTL is needed
 */
export const getRTLAlignment = (needsManualRTL: boolean): ViewStyle =>
    needsManualRTL ? { alignItems: 'flex-end' } : {};

/**
 * Common RTL styles that can be spread into style arrays
 */
export const RTLStyles = {
    row: { flexDirection: 'row' as const },
    rowReverse: { flexDirection: 'row-reverse' as const },
};
