import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CategoriaId, Filtros, TipoLugar } from '@/lib/types';

type FiltersState = Filtros & {
  setCategorias: (c: CategoriaId[]) => void;
  toggleCategoria: (c: CategoriaId) => void;
  setRadio: (km: number) => void;
  setSoloGratis: (v: boolean) => void;
  setPrecioRango: (min: 0 | 1 | 2 | 3 | 4, max: 0 | 1 | 2 | 3 | 4) => void;
  setPrecioMax: (p: 0 | 1 | 2 | 3 | 4) => void;
  setMinRating: (r: 0 | 1 | 2 | 3 | 4 | 4 | 5) => void;
  setTipos: (t: TipoLugar[]) => void;
  setQ: (q: string) => void;
  setTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  reset: () => void;
};

const DEFAULT: Filtros = {
  categorias: [],
  radioKm: 20000,
  soloGratis: false,
  precioMin: 1,
  precioMax: 4,
  minRating: 0,
  tipos: [],
  q: '',
  tags: [],
};

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      ...DEFAULT,
      setCategorias: (categorias) => set({ categorias }),
      toggleCategoria: (c) =>
        set((s) => ({
          categorias: s.categorias.includes(c)
            ? s.categorias.filter((x) => x !== c)
            : [...s.categorias, c],
        })),
      setRadio: (radioKm) => set({ radioKm }),
      setSoloGratis: (soloGratis) =>
        set(
          soloGratis
            ? { soloGratis: true, precioMin: 0, precioMax: 0 }
            : { soloGratis: false, precioMin: 1, precioMax: 4 },
        ),
      setPrecioRango: (precioMin, precioMax) =>
        set({ precioMin, precioMax, soloGratis: false }),
      setPrecioMax: (precioMax) => set({ precioMax }),
      setMinRating: (minRating) => set({ minRating }),
      setTipos: (tipos) => set({ tipos }),
      setQ: (q) => set({ q }),
      setTags: (tags) => set({ tags }),
      toggleTag: (tag) =>
        set((s) => ({
          tags: s.tags.includes(tag) ? s.tags.filter((t) => t !== tag) : [...s.tags, tag],
        })),
      reset: () => set({ ...DEFAULT }),
    }),
    {
      name: 'filters-state',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s: FiltersState) => ({
        categorias: s.categorias,
        radioKm: s.radioKm,
        soloGratis: s.soloGratis,
        precioMin: s.precioMin,
        precioMax: s.precioMax,
        minRating: s.minRating,
        tags: s.tags,
        // tipos y q no persisten (context-specific)
      }),
    } as any,
  ),
);
