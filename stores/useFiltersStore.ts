import { create } from 'zustand';
import type { CategoriaId, Filtros } from '@/lib/types';

type FiltersState = Filtros & {
  setCategorias: (c: CategoriaId[]) => void;
  toggleCategoria: (c: CategoriaId) => void;
  setRadio: (km: number) => void;
  setSoloGratis: (v: boolean) => void;
  setPrecioRango: (min: 0 | 1 | 2 | 3, max: 0 | 1 | 2 | 3) => void;
  setPrecioMax: (p: 0 | 1 | 2 | 3) => void;
  setMinRating: (r: 0 | 1 | 2 | 3 | 4 | 5) => void;
  reset: () => void;
};

const DEFAULT: Filtros = {
  categorias: [],
  radioKm: 20000,
  soloGratis: false,
  precioMin: 0,
  precioMax: 3,
  minRating: 0,
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
  setSoloGratis: (soloGratis) =>
    set(soloGratis ? { soloGratis: true, precioMin: 0, precioMax: 0 } : { soloGratis: false, precioMax: 3 }),
  setPrecioRango: (precioMin, precioMax) => set({ precioMin, precioMax, soloGratis: false }),
  setPrecioMax: (precioMax) => set({ precioMax }),
  setMinRating: (minRating) => set({ minRating }),
  reset: () => set({ ...DEFAULT }),
}));
