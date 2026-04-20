export type CategoriaId =
  | 'gastronomia'
  | 'aire_libre'
  | 'cultura'
  | 'nocturno'
  | 'familiar'
  | 'deporte';

export type Panorama = {
  id: string;
  nombre: string;
  descripcion: string | null;
  categoria: CategoriaId;
  precio_nivel: 0 | 1 | 2 | 3;
  direccion: string | null;
  imagen_url: string | null;
  lat: number;
  lng: number;
  distancia_m?: number;
  rating_promedio?: number;
  total_reviews?: number;
};

export type Review = {
  id: string;
  panorama_id: string;
  user_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comentario: string | null;
  created_at: string;
  updated_at: string;
  user_nombre?: string;
  user_avatar?: string;
};

export type Filtros = {
  categorias: CategoriaId[];
  radioKm: number;
  soloGratis: boolean;
  precioMin: 0 | 1 | 2 | 3;
  precioMax: 0 | 1 | 2 | 3;
  minRating: 0 | 1 | 2 | 3 | 4 | 5;
};

export type UbicacionActual = {
  lat: number;
  lng: number;
  esDefault: boolean;
};
