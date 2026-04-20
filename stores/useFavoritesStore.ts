import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { Lugar } from '@/lib/types';
import { useAuthStore } from './useAuthStore';

type FavoritesState = {
  favoritos: Record<string, Lugar>;
  sincronizando: boolean;
  toggle: (l: Lugar) => Promise<void>;
  esFavorito: (id: string) => boolean;
  remove: (id: string) => Promise<void>;
  list: () => Lugar[];
  fetchFromServer: () => Promise<void>;
  mergeLocalToServer: () => Promise<void>;
  clearMemory: () => void;
};

async function upsertFavServer(userId: string, lugarId: string) {
  const { error } = await supabase
    .from('favoritos')
    .upsert({ user_id: userId, lugar_id: lugarId });
  if (error) console.warn('[fav upsert]', error.message);
}

async function deleteFavServer(userId: string, lugarId: string) {
  const { error } = await supabase
    .from('favoritos')
    .delete()
    .eq('user_id', userId)
    .eq('lugar_id', lugarId);
  if (error) console.warn('[fav delete]', error.message);
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoritos: {},
      sincronizando: false,

      toggle: async (l) => {
        const user = useAuthStore.getState().user;
        const existe = !!get().favoritos[l.id];
        set((s) => {
          const next = { ...s.favoritos };
          if (existe) delete next[l.id];
          else next[l.id] = l;
          return { favoritos: next };
        });
        if (user) {
          if (existe) await deleteFavServer(user.id, l.id);
          else await upsertFavServer(user.id, l.id);
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
          .select(
            'lugar_id, lugares(id, nombre, descripcion, categoria, tipo, precio_nivel, direccion, imagen_url, fecha_inicio, fecha_fin)',
          )
          .eq('user_id', user.id);
        if (error) {
          console.warn('[fav fetch]', error.message);
          set({ sincronizando: false });
          return;
        }
        const mapa: Record<string, Lugar> = {};
        for (const row of data ?? []) {
          const l: any = (row as any).lugares;
          if (!l) continue;
          mapa[l.id] = {
            id: l.id,
            nombre: l.nombre,
            descripcion: l.descripcion,
            categoria: l.categoria,
            tipo: l.tipo,
            precio_nivel: l.precio_nivel,
            direccion: l.direccion,
            imagen_url: l.imagen_url,
            fecha_inicio: l.fecha_inicio,
            fecha_fin: l.fecha_fin,
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
        const payload = locales.map((lugar_id) => ({
          user_id: user.id,
          lugar_id,
        }));
        const { error } = await supabase.from('favoritos').upsert(payload);
        if (error) console.warn('[fav merge]', error.message);
      },

      clearMemory: () => set({ favoritos: {} }),
    }),
    {
      name: 'favoritos-lugares',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ favoritos: s.favoritos }),
    },
  ),
);
