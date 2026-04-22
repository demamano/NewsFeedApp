import React, { useCallback, useEffect, useMemo } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { StoriesStackParamList } from '../../navigation/types';
import {
  filterStories,
  sortStories,
  useStoriesStore,
} from '../../store/stories';
import { useBookmarksStore } from '../../store/bookmarks';
import { Story } from '../../api/types';
import { colors, spacing, typography } from '../../theme/theme';
import { StoryRow, STORY_ROW_HEIGHT } from './components/StoryRow';
import { SortToggle } from './components/SortToggle';
import { SearchBar } from './components/SearchBar';
import { StoryListSkeleton } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';
import { OfflineBanner } from '../../components/OfflineBanner';
import { useDebounce } from '../../hooks/useDebounce';
import { useOnline } from '../../hooks/useOnline';

type Props = NativeStackScreenProps<StoriesStackParamList, 'StoryList'>;

export function StoryListScreen({ navigation }: Props) {
  const stories = useStoriesStore(s => s.stories);
  const status = useStoriesStore(s => s.status);
  const error = useStoriesStore(s => s.error);
  const sort = useStoriesStore(s => s.sort);
  const searchQuery = useStoriesStore(s => s.searchQuery);
  const setSort = useStoriesStore(s => s.setSort);
  const setSearchQuery = useStoriesStore(s => s.setSearchQuery);
  const load = useStoriesStore(s => s.load);
  const refresh = useStoriesStore(s => s.refresh);

  const isBookmarked = useBookmarksStore(s => s.isBookmarked);
  const online = useOnline();

  const debouncedSearch = useDebounce(searchQuery, 250);

  useEffect(() => {
    if (status === 'idle') {
      load();
    }
  }, [status, load]);

  const displayed = useMemo(() => {
    const sorted = sortStories(stories, sort);
    return filterStories(sorted, debouncedSearch);
  }, [stories, sort, debouncedSearch]);

  const handleOpen = useCallback(
    (story: Story) => navigation.navigate('StoryDetail', { story }),
    [navigation],
  );

  const renderItem: ListRenderItem<Story> = useCallback(
    ({ item }) => (
      <StoryRow story={item} onPress={handleOpen} isBookmarked={isBookmarked(item.id)} />
    ),
    [handleOpen, isBookmarked],
  );

  const keyExtractor = useCallback((item: Story) => String(item.id), []);
  const getItemLayout = useCallback(
    (_: ArrayLike<Story> | null | undefined, index: number) => ({
      length: STORY_ROW_HEIGHT,
      offset: STORY_ROW_HEIGHT * index,
      index,
    }),
    [],
  );

  const isInitialLoading = status === 'loading' && stories.length === 0;
  const isError = status === 'error' && stories.length === 0;
  const isEmptyAfterLoad =
    status === 'success' && displayed.length === 0;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <OfflineBanner visible={!online} />
      <View style={styles.header}>
        <Text style={styles.heading}>News Feed</Text>
        <View style={styles.controls}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <View style={{ height: spacing.sm }} />
          <SortToggle value={sort} onChange={setSort} />
        </View>
      </View>

      {isInitialLoading ? (
        <StoryListSkeleton />
      ) : isError ? (
        <EmptyState
          variant="error"
          title="Couldn't load stories"
          body={error ?? 'Please try again.'}
          actionLabel="Retry"
          onAction={load}
        />
      ) : (
        <FlatList
          testID="story-list"
          data={displayed}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          initialNumToRender={10}
          windowSize={7}
          maxToRenderPerBatch={10}
          removeClippedSubviews
          refreshControl={
            <RefreshControl
              refreshing={status === 'refreshing'}
              onRefresh={refresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          ListEmptyComponent={
            isEmptyAfterLoad ? (
              <EmptyState
                title={
                  debouncedSearch
                    ? 'No matching stories'
                    : 'No stories yet'
                }
                body={
                  debouncedSearch
                    ? `Nothing matched "${debouncedSearch}". Try a different query.`
                    : 'Pull down to refresh.'
                }
              />
            ) : null
          }
          contentContainerStyle={
            displayed.length === 0 ? styles.emptyListContent : undefined
          }
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
  heading: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  controls: {},
  emptyListContent: { flexGrow: 1 },
});
