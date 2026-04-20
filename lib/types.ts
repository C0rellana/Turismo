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
};

export type Filtros = {
  categorias: CategoriaId[];
  radioKm: number;
  precioMax: 0 | 1 | 2 | 3;
};

export type UbicacionActual = {
  lat: number;
  lng: number;
  esDefault: boolean;
};
