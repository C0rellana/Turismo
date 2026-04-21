export type CategoriaId =
  | 'gastronomia'
  | 'aire_libre'
  | 'cultura'
  | 'nocturno'
  | 'familiar'
  | 'deporte'
  | 'musica'
  | 'bienestar'
  | 'compras'
  | 'eco';

export type TipoLugar = 'turistico' | 'panorama';

export type MediaTipo = 'image' | 'video';

export type UserRole = 'visitor' | 'registered' | 'verified' | 'moderator' | 'admin';

export type Lugar = {
  id: string;
  nombre: string;
  descripcion: string | null;
  categoria: CategoriaId;
  tipo: TipoLugar;
  precio_nivel: 0 | 1 | 2 | 3 | 4;
  direccion: string | null;
  imagen_url: string | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  lat: number;
  lng: number;
  distancia_m?: number;
  rating_promedio?: number;
  total_reviews?: number;
  tags?: string[];
  portada_tipo?: MediaTipo;
  portada_thumbnail?: string | null;
};

/** Alias de compatibilidad. Deprecated: usar Lugar. */
export type Panorama = Lugar;

export type LugarImagen = {
  id: string;
  lugar_id: string;
  url: string;
  orden: number;
  tipo?: MediaTipo;
  thumbnail_url?: string | null;
  duracion_s?: number | null;
};

export type LugarMedia = LugarImagen;

export type Review = {
  id: string;
  lugar_id: string;
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
  precioMin: 0 | 1 | 2 | 3 | 4;
  precioMax: 0 | 1 | 2 | 3 | 4;
  minRating: 0 | 1 | 2 | 3 | 4 | 4 | 5;
  tipos: TipoLugar[];
  q: string;
  tags: string[];
};

export type UbicacionActual = {
  lat: number;
  lng: number;
  esDefault: boolean;
};
