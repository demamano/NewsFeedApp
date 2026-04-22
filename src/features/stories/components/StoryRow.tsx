import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Story } from '../../../api/types';
import { colors, radius, spacing, typography } from '../../../theme/theme';
import { faviconUrl } from '../../../utils/url';
import { relativeTime } from '../../../utils/time';
import { StatusIcon } from '../../../components/StatusIcon';

interface Props {
  story: Story;
  onPress: (story: Story) => void;
  isBookmarked?: boolean;
}

function StoryRowBase({ story, onPress, isBookmarked }: Props) {
  const handlePress = () => onPress(story);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${story.title}, ${story.score} points, ${relativeTime(
        story.time,
      )}`}
      onPress={handlePress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <Image
        source={{ uri: faviconUrl(story.domain, 64) }}
        style={styles.favicon}
        resizeMode="contain"
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={3}>
          {story.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta} numberOfLines={1}>
            {story.domain}
          </Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.meta}>{story.score} pts</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.meta}>{relativeTime(story.time)}</Text>
        </View>
      </View>
      <View style={styles.trailing}>
        {isBookmarked ? (
          <StatusIcon glyph="bookmark-filled" color={colors.accent} size={14} />
        ) : null}
        <StatusIcon glyph="chevron" color={colors.textMuted} size={22} />
      </View>
    </Pressable>
  );
}

export const STORY_ROW_HEIGHT = 96;

export const StoryRow = memo(StoryRowBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.bg,
    height: STORY_ROW_HEIGHT,
  },
  rowPressed: { backgroundColor: colors.surface },
  favicon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
  },
  body: { flex: 1, marginHorizontal: spacing.md },
  title: { ...typography.title, color: colors.text },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  meta: { ...typography.meta, color: colors.textMuted },
  metaDot: {
    ...typography.meta,
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
