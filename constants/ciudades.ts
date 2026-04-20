export type Ciudad = {
  nombre: string;
  region: string;
  lat: number;
  lng: number;
};

export const CIUDADES_CHILE: Ciudad[] = [
  { nombre: 'Arica', region: 'Arica y Parinacota', lat: -18.4783, lng: -70.3126 },
  { nombre: 'Iquique', region: 'Tarapacá', lat: -20.2208, lng: -70.1431 },
  { nombre: 'San Pedro de Atacama', region: 'Antofagasta', lat: -22.9087, lng: -68.1997 },
  { nombre: 'Antofagasta', region: 'Antofagasta', lat: -23.6509, lng: -70.3975 },
  { nombre: 'La Serena', region: 'Coquimbo', lat: -29.9078, lng: -71.2528 },
  { nombre: 'Valparaíso', region: 'Valparaíso', lat: -33.0472, lng: -71.6127 },
  { nombre: 'Viña del Mar', region: 'Valparaíso', lat: -33.0246, lng: -71.5518 },
  { nombre: 'Santiago', region: 'Metropolitana', lat: -33.4489, lng: -70.6693 },
  { nombre: 'Rancagua', region: "O'Higgins", lat: -34.1708, lng: -70.7400 },
  { nombre: 'Curicó', region: 'Maule', lat: -34.9833, lng: -71.2333 },
  { nombre: 'Talca', region: 'Maule', lat: -35.4264, lng: -71.6554 },
  { nombre: 'Linares', region: 'Maule', lat: -35.8464, lng: -71.5933 },
  { nombre: 'Constitución', region: 'Maule', lat: -35.3333, lng: -72.4167 },
  { nombre: 'Chillán', region: 'Ñuble', lat: -36.6063, lng: -72.1031 },
  { nombre: 'Concepción', region: 'Biobío', lat: -36.8201, lng: -73.0444 },
  { nombre: 'Temuco', region: 'Araucanía', lat: -38.7359, lng: -72.5904 },
  { nombre: 'Pucón', region: 'Araucanía', lat: -39.2714, lng: -71.9796 },
  { nombre: 'Valdivia', region: 'Los Ríos', lat: -39.8142, lng: -73.2459 },
  { nombre: 'Puerto Montt', region: 'Los Lagos', lat: -41.4717, lng: -72.9360 },
  { nombre: 'Coyhaique', region: 'Aysén', lat: -45.5712, lng: -72.0685 },
  { nombre: 'Punta Arenas', region: 'Magallanes', lat: -53.1638, lng: -70.9171 },
];
