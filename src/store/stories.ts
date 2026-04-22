import { create } from 'zustand';
import { Story } from '../api/types';
import { hnApi } from '../api/hn';

export type SortMode = 'score' | 'time';

export type LoadStatus = 'idle' | 'loading' | 'refreshing' | 'success' | 'error';

interface StoriesState {
  stories: Story[];
  status: LoadStatus;
  error: string | null;
  sort: SortMode;
  searchQuery: string;
  lastFetchedAt: number | null;

  setSort: (sort: SortMode) => void;
  setSearchQuery: (q: string) => void;
  load: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useStoriesStore = create<StoriesState>((set, get) => ({
  stories: [],
  status: 'idle',
  error: null,
  sort: 'score',
  searchQuery: '',
  lastFetchedAt: null,

  setSort: sort => set({ sort }),
  setSearchQuery: q => set({ searchQuery: q }),

  load: async () => {
    if (get().status === 'loading') return;
    set({ status: 'loading', error: null });
    try {
      const stories = await hnApi.topStories(20);
      set({ stories, status: 'success', lastFetchedAt: Date.now() });
    } catch (err) {
      set({
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to load stories',
      });
    }
  },

  refresh: async () => {
    set({ status: 'refreshing', error: null });
    try {
      const stories = await hnApi.topStories(20);
      set({ stories, status: 'success', lastFetchedAt: Date.now() });
    } catch (err) {
      set({
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to refresh',
      });
    }
  },
}));

export function sortStories(stories: Story[], sort: SortMode): Story[] {
  const copy = stories.slice();
  if (sort === 'score') {
    copy.sort((a, b) => b.score - a.score);
  } else {
    copy.sort((a, b) => b.time - a.time);
  }
  return copy;
}

export function filterStories(stories: Story[], query: string): Story[] {
  const q = query.trim().toLowerCase();
  if (!q) return stories;
  return stories.filter(
    s =>
      s.title.toLowerCase().includes(q) ||
      s.domain.toLowerCase().includes(q) ||
      s.by.toLowerCase().includes(q),
  );
}
