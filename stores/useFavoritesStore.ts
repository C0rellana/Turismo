import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Panorama } from '@/lib/types';

type FavoritesState = {
  favoritos: Record<string, Panorama>;
  toggle: (p: Panorama) => void;
  esFavorito: (id: string) => boolean;
  remove: (id: string) => void;
  list: () => Panorama[];
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoritos: {},
      toggle: (p) =>
        set((s) => {
          const next = { ...s.favoritos };
          if (next[p.id]) delete next[p.id];
          else next[p.id] = p;
          return { favoritos: next };
        }),
      esFavorito: (id) => !!get().favoritos[id],
      remove: (id) =>
        set((s) => {
          const next = { ...s.favoritos };
          delete next[id];
          return { favoritos: next };
        }),
      list: () => Object.values(get().favoritos),
    }),
    {
      name: 'favoritos-panoramas',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ favoritos: s.favoritos }),
    },
  ),
);
