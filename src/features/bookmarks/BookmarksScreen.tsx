import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootTabParamList, StoriesStackParamList } from '../../navigation/types';
import { Story } from '../../api/types';
import { useBookmarksStore } from '../../store/bookmarks';
import { colors, spacing, typography } from '../../theme/theme';
import { EmptyState } from '../../components/EmptyState';
import { SwipeableBookmarkRow } from './SwipeableBookmarkRow';
import { STORY_ROW_HEIGHT } from '../stories/components/StoryRow';

type Props = BottomTabScreenProps<RootTabParamList, 'BookmarksTab'>;

export function BookmarksScreen(_: Props) {
  const items = useBookmarksStore(s => s.items);
  const order = useBookmarksStore(s => s.order);
  const remove = useBookmarksStore(s => s.remove);
  const hasHydrated = useBookmarksStore(s => s.hasHydrated);

  const rootNav =
    useNavigation<NativeStackNavigationProp<StoriesStackParamList>>();

  const stories = useMemo<Story[]>(
    () => order.map(id => items[id]).filter(Boolean),
    [items, order],
  );

  const handleOpen = useCallback(
    (story: Story) => {
      rootNav.navigate('FeedTab' as never, {
        screen: 'StoryDetail',
        params: { story },
      } as never);
    },
    [rootNav],
  );

  const keyExtractor = useCallback((s: Story) => String(s.id), []);
  const getItemLayout = useCallback(
    (_data: ArrayLike<Story> | null | undefined, index: number) => ({
      length: STORY_ROW_HEIGHT,
      offset: STORY_ROW_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.heading}>Bookmarks</Text>
        <Text style={styles.sub}>
          {stories.length} {stories.length === 1 ? 'story' : 'stories'}
        </Text>
      </View>
      {!hasHydrated ? (
        <EmptyState title="Loading bookmarks…" />
      ) : stories.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          body="Tap the star on any story to save it here for later."
        />
      ) : (
        <FlatList
          testID="bookmarks-list"
          data={stories}
          renderItem={({ item }) => (
            <SwipeableBookmarkRow story={item} onPress={handleOpen} onRemove={remove} />
          )}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          initialNumToRender={10}
          windowSize={7}
          removeClippedSubviews
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  heading: { ...typography.heading, color: colors.text },
  sub: { ...typography.meta, color: colors.textMuted, marginTop: spacing.xs },
});
