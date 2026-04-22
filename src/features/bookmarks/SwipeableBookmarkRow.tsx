import React, { useCallback } from 'react';
import { Animated, StyleSheet, View, Text, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Story } from '../../api/types';
import { colors, radius, spacing, typography } from '../../theme/theme';
import { StatusIcon } from '../../components/StatusIcon';
import { StoryRow } from '../stories/components/StoryRow';

interface Props {
  story: Story;
  onPress: (story: Story) => void;
  onRemove: (id: number) => void;
}

export function SwipeableBookmarkRow({ story, onPress, onRemove }: Props) {
  const renderRightActions = useCallback(
    (progress: Animated.AnimatedInterpolation<number>) => {
      const translate = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [80, 0],
      });
      return (
        <View style={styles.actionWrap}>
          <Animated.View style={{ transform: [{ translateX: translate }] }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${story.title} from bookmarks`}
              onPress={() => onRemove(story.id)}
              style={styles.removeBtn}>
              <StatusIcon glyph="delete" color="#fff" size={18} />
              <Text style={styles.removeLabel}>Remove</Text>
            </Pressable>
          </Animated.View>
        </View>
      );
    },
    [story.id, story.title, onRemove],
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      rightThreshold={40}>
      <StoryRow story={story} onPress={onPress} isBookmarked />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  actionWrap: {
    justifyContent: 'center',
    backgroundColor: colors.danger,
    paddingRight: spacing.lg,
  },
  removeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 96,
    height: '100%',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  removeLabel: { ...typography.meta, color: '#fff', fontWeight: '700' },
});
