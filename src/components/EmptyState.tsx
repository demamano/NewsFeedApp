import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import { StatusIcon } from './StatusIcon';

interface Props {
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'empty' | 'error';
}

export function EmptyState({ title, body, actionLabel, onAction, variant = 'empty' }: Props) {
  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.iconWrap,
          variant === 'error' ? styles.iconError : styles.iconNeutral,
        ]}>
        <StatusIcon
          glyph={variant === 'error' ? 'warning' : 'empty'}
          color={variant === 'error' ? colors.danger : colors.textMuted}
          size={28}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onAction}>
          <Text style={styles.buttonLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconNeutral: { backgroundColor: colors.surfaceAlt },
  iconError: { backgroundColor: '#3A1F22' },
  title: { ...typography.title, color: colors.text, textAlign: 'center' },
  body: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 320,
  },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  buttonPressed: { backgroundColor: colors.accentDim },
  buttonLabel: { color: '#fff', fontWeight: '600' },
});
