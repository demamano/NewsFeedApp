import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/theme';
import { StatusIcon } from './StatusIcon';

interface Props {
  visible: boolean;
}

export function OfflineBanner({ visible }: Props) {
  if (!visible) return null;
  return (
    <View style={styles.wrap} accessibilityLiveRegion="polite">
      <StatusIcon glyph="offline" color="#fff" size={14} />
      <Text style={styles.label}>You're offline — showing cached view.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  label: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
