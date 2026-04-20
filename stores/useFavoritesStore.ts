import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { Panorama } from '@/lib/types';
import { useAuthStore } from './useAuthStore';

type FavoritesState = {
  favoritos: Record<string, Panorama>;
  sincronizando: boolean;
  toggle: (p: Panorama) => Promise<void>;
  esFavorito: (id: string) => boolean;
  remove: (id: string) => Promise<void>;
  list: () => Panorama[];
  fetchFromServer: () => Promise<void>;
  mergeLocalToServer: () => Promise<void>;
  clearMemory: () => void;
};

async function upsertFavServer(userId: string, panoramaId: string) {
  const { error } = await supabase
    .from('favoritos')
    .upsert({ user_id: userId, panorama_id: panoramaId });
  if (error) console.warn('[fav upsert]', error.message);
}

async function deleteFavServer(userId: string, panoramaId: string) {
  const { error } = await supabase
    .from('favoritos')
    .delete()
    .eq('user_id', userId)
    .eq('panorama_id', panoramaId);
  if (error) console.warn('[fav delete]', error.message);
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoritos: {},
      sincronizando: false,

      toggle: async (p) => {
        const user = useAuthStore.getState().user;
        const existe = !!get().favoritos[p.id];
        set((s) => {
          const next = { ...s.favoritos };
          if (existe) delete next[p.id];
          else next[p.id] = p;
          return { favoritos: next };
        });
        if (user) {
          if (existe) await deleteFavServer(user.id, p.id);
          else await upsertFavServer(user.id, p.id);
        }
      },

      esFavorito: (id) => !!get().favoritos[id],

      remove: async (id) => {
        const user = useAuthStore.getState().user;
        set((s) => {
          const next = { ...s.favoritos };
          delete next[id];
          return { favoritos: next };
        });
        if (user) await deleteFavServer(user.id, id);
      },

      list: () => Object.values(get().favoritos),

      fetchFromServer: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        set({ sincronizando: true });
        const { data, error } = await supabase
          .from('favoritos')
          .select('panorama_id, panoramas(id, nombre, descripcion, categoria, precio_nivel, direccion, imagen_url)')
          .eq('user_id', user.id);
        if (error) {
          console.warn('[fav fetch]', error.message);
          set({ sincronizando: false });
          return;
        }
        const mapa: Record<string, Panorama> = {};
        for (const row of data ?? []) {
          const p: any = (row as any).panoramas;
          if (!p) continue;
          mapa[p.id] = {
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            categoria: p.categoria,
            precio_nivel: p.precio_nivel,
            direccion: p.direccion,
            imagen_url: p.imagen_url,
            lat: 0,
            lng: 0,
          };
        }
        set({ favoritos: mapa, sincronizando: false });
      },

      mergeLocalToServer: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const locales = Object.keys(get().favoritos);
        if (locales.length === 0) return;
        const payload = locales.map((panorama_id) => ({
          user_id: user.id,
          panorama_id,
        }));
        const { error } = await supabase.from('favoritos').upsert(payload);
        if (error) console.warn('[fav merge]', error.message);
      },

      clearMemory: () => set({ favoritos: {} }),
    }),
    {
      name: 'favoritos-panoramas',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ favoritos: s.favoritos }),
    },
  ),
);
