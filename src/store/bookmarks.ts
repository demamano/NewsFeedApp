import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Story } from '../api/types';

interface BookmarksState {
  items: Record<number, Story>;
  order: number[];
  hasHydrated: boolean;

  toggle: (story: Story) => void;
  add: (story: Story) => void;
  remove: (id: number) => void;
  isBookmarked: (id: number) => boolean;
  list: () => Story[];
  setHydrated: (v: boolean) => void;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      items: {},
      order: [],
      hasHydrated: false,

      toggle: story => {
        const { items, order } = get();
        if (items[story.id]) {
          const nextItems = { ...items };
          delete nextItems[story.id];
          set({
            items: nextItems,
            order: order.filter(id => id !== story.id),
          });
        } else {
          set({
            items: { ...items, [story.id]: story },
            order: [story.id, ...order],
          });
        }
      },

      add: story => {
        const { items, order } = get();
        if (items[story.id]) return;
        set({
          items: { ...items, [story.id]: story },
          order: [story.id, ...order],
        });
      },

      remove: id => {
        const { items, order } = get();
        if (!items[id]) return;
        const nextItems = { ...items };
        delete nextItems[id];
        set({ items: nextItems, order: order.filter(x => x !== id) });
      },

      isBookmarked: id => !!get().items[id],

      list: () => {
        const { items, order } = get();
        return order.map(id => items[id]).filter(Boolean);
      },

      setHydrated: v => set({ hasHydrated: v }),
    }),
    {
      name: 'newsfeed:bookmarks:v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ items: state.items, order: state.order }),
      onRehydrateStorage: () => state => {
        state?.setHydrated(true);
      },
    },
  ),
);
