import React, { useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
  Share,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { StoriesStackParamList } from '../../navigation/types';
import { colors, radius, spacing, typography } from '../../theme/theme';
import { StatusIcon } from '../../components/StatusIcon';
import { useBookmarksStore } from '../../store/bookmarks';
import { absoluteTime, relativeTime } from '../../utils/time';
import { faviconUrl } from '../../utils/url';

type Props = NativeStackScreenProps<StoriesStackParamList, 'StoryDetail'>;

export function StoryDetailScreen({ route, navigation }: Props) {
  const { story } = route.params;
  const bookmarked = useBookmarksStore(s => !!s.items[story.id]);
  const toggleBookmark = useBookmarksStore(s => s.toggle);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        title: story.title,
        message: `${story.title}\n${story.url}`,
        url: story.url,
      });
    } catch {
      Alert.alert('Unable to share', 'Please try again.');
    }
  }, [story.title, story.url]);

  const handleOpenLink = useCallback(async () => {
    const can = await Linking.canOpenURL(story.url);
    if (!can) {
      Alert.alert('Cannot open link', story.url);
      return;
    }
    Linking.openURL(story.url);
  }, [story.url]);

  const handleToggleBookmark = useCallback(() => {
    toggleBookmark(story);
  }, [story, toggleBookmark]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            onPress={handleToggleBookmark}
            hitSlop={8}
            style={styles.headerBtn}>
            <StatusIcon
              glyph={bookmarked ? 'bookmark-filled' : 'bookmark-outline'}
              color={bookmarked ? colors.accent : colors.text}
              size={22}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share story"
            onPress={handleShare}
            hitSlop={8}
            style={styles.headerBtn}>
            <StatusIcon glyph="share" color={colors.text} size={22} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, bookmarked, handleShare, handleToggleBookmark]);

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.domainRow}>
            <Image
              source={{ uri: faviconUrl(story.domain, 64) }}
              style={styles.favicon}
              resizeMode="contain"
            />
            <Text style={styles.domain} numberOfLines={1}>
              {story.domain}
            </Text>
          </View>
          <Text style={styles.title}>{story.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Score</Text>
              <Text style={styles.metaValue}>{story.score}</Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Author</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {story.by}
              </Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Posted</Text>
              <Text style={styles.metaValue}>{relativeTime(story.time)}</Text>
            </View>
          </View>
          <Text style={styles.timestamp}>{absoluteTime(story.time)}</Text>
        </View>

        <Pressable
          onPress={handleOpenLink}
          accessibilityRole="link"
          accessibilityLabel={`Open ${story.url}`}
          style={({ pressed }) => [styles.linkCard, pressed && styles.linkCardPressed]}>
          <StatusIcon glyph="link" color={colors.accent} size={16} />
          <Text style={styles.linkText} numberOfLines={2}>
            {story.url}
          </Text>
        </Pressable>

        <View style={styles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
            onPress={handleOpenLink}>
            <Text style={styles.primaryBtnLabel}>Open Article</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={handleToggleBookmark}
            style={({ pressed }) => [
              styles.secondaryBtn,
              bookmarked && styles.secondaryBtnActive,
              pressed && styles.secondaryBtnPressed,
            ]}>
            <StatusIcon
              glyph={bookmarked ? 'bookmark-filled' : 'bookmark-outline'}
              color={bookmarked ? colors.accent : colors.text}
              size={16}
            />
            <Text
              style={[
                styles.secondaryBtnLabel,
                bookmarked && styles.secondaryBtnLabelActive,
              ]}>
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  domainRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  favicon: {
    width: 18,
    height: 18,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
  },
  domain: { ...typography.meta, color: colors.textMuted, flexShrink: 1 },
  title: { ...typography.heading, color: colors.text },
  metaRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  metaBlock: { flex: 1 },
  metaLabel: { ...typography.meta, color: colors.textMuted, marginBottom: 2 },
  metaValue: { ...typography.body, color: colors.text, fontWeight: '600' },
  timestamp: { ...typography.meta, color: colors.textMuted },

  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  linkCardPressed: { backgroundColor: colors.surfaceAlt },
  linkText: {
    flex: 1,
    ...typography.body,
    color: colors.accent,
  },

  buttonRow: { flexDirection: 'row', gap: spacing.md },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  primaryBtnPressed: { backgroundColor: colors.accentDim },
  primaryBtnLabel: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  secondaryBtnActive: { borderColor: colors.accent },
  secondaryBtnPressed: { backgroundColor: colors.surface },
  secondaryBtnLabel: { color: colors.text, fontWeight: '600' },
  secondaryBtnLabelActive: { color: colors.accent },

  headerActions: { flexDirection: 'row', gap: spacing.lg, paddingRight: spacing.sm },
  headerBtn: { padding: spacing.xs },
});
