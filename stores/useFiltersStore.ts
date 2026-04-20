import { create } from 'zustand';
import type { CategoriaId, Filtros } from '@/lib/types';

type FiltersState = Filtros & {
  setCategorias: (c: CategoriaId[]) => void;
  toggleCategoria: (c: CategoriaId) => void;
  setRadio: (km: number) => void;
  setPrecioMax: (p: 0 | 1 | 2 | 3) => void;
  reset: () => void;
};

const DEFAULT: Filtros = {
  categorias: [],
  radioKm: 20000,
  precioMax: 3,
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...DEFAULT,
  setCategorias: (categorias) => set({ categorias }),
  toggleCategoria: (c) =>
    set((s) => ({
      categorias: s.categorias.includes(c)
        ? s.categorias.filter((x) => x !== c)
        : [...s.categorias, c],
    })),
  setRadio: (radioKm) => set({ radioKm }),
  setPrecioMax: (precioMax) => set({ precioMax }),
  reset: () => set({ ...DEFAULT }),
}));
