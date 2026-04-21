import type { CategoriaId } from '@/lib/types';

export type CategoriaDef = {
  id: CategoriaId;
  nombre: string;
  icono: string;
  color: string;
};

export const CATEGORIAS: readonly CategoriaDef[] = [
  { id: 'gastronomia', nombre: 'Gastronomía', icono: 'restaurant', color: '#E94F37' },
  { id: 'aire_libre', nombre: 'Aire libre', icono: 'leaf', color: '#44AF69' },
  { id: 'cultura', nombre: 'Cultura', icono: 'color-palette', color: '#3A86FF' },
  { id: 'nocturno', nombre: 'Nocturno', icono: 'moon', color: '#8338EC' },
  { id: 'familiar', nombre: 'Familiar', icono: 'happy', color: '#FFB400' },
  { id: 'deporte', nombre: 'Deporte', icono: 'football', color: '#06A77D' },
  { id: 'musica', nombre: 'Música', icono: 'musical-notes', color: '#D946EF' },
  { id: 'bienestar', nombre: 'Bienestar', icono: 'flower', color: '#10B981' },
  { id: 'compras', nombre: 'Compras', icono: 'bag', color: '#EAB308' },
  { id: 'eco', nombre: 'Ecoturismo', icono: 'earth', color: '#2D6A4F' },
] as const;

export const CATEGORIAS_MAP = Object.fromEntries(
  CATEGORIAS.map((c) => [c.id, c]),
) as Record<CategoriaId, CategoriaDef>;

export const SANTIAGO_DEFAULT = { lat: -33.4489, lng: -70.6693 };
