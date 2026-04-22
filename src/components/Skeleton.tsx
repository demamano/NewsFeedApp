import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

interface BlockProps {
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
}

function AnimatedBlock({ width = '100%', height = 12, style }: BlockProps) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.9,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        { width, height, backgroundColor: colors.skeleton, borderRadius: radius.sm, opacity: pulse },
        style,
      ]}
    />
  );
}

export function StoryRowSkeleton() {
  return (
    <View style={styles.row}>
      <AnimatedBlock width={40} height={40} style={styles.avatar} />
      <View style={styles.body}>
        <AnimatedBlock width="90%" height={14} />
        <AnimatedBlock width="60%" height={12} style={{ marginTop: spacing.sm }} />
        <AnimatedBlock width="40%" height={10} style={{ marginTop: spacing.sm }} />
      </View>
    </View>
  );
}

export function StoryListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <StoryRowSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: { borderRadius: radius.md },
  body: { flex: 1, marginLeft: spacing.md, justifyContent: 'center' },
});
