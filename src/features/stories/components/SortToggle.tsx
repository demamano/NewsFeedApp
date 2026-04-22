import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../../theme/theme';
import { SortMode } from '../../../store/stories';

interface Props {
  value: SortMode;
  onChange: (v: SortMode) => void;
}

const OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'score', label: 'Top' },
  { value: 'time', label: 'New' },
];

export function SortToggle({ value, onChange }: Props) {
  return (
    <View style={styles.wrap} accessibilityRole="tablist">
      {OPTIONS.map(opt => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Sort by ${opt.label}`}
            onPress={() => onChange(opt.value)}
            style={[styles.pill, active && styles.pillActive]}>
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    padding: 3,
    alignSelf: 'flex-start',
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  pillActive: { backgroundColor: colors.accent },
  label: { ...typography.meta, color: colors.textMuted },
  labelActive: { color: '#fff' },
});
