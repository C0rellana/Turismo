/**
 * Contenido editorial por región. Tips, descripciones, ciudades destacadas,
 * imperdibles. Usado en el tab Inicio para dar contexto turístico según
 * la ubicación actual del usuario.
 */

export type CiudadDestacada = {
  nombre: string;
  lat: number;
  lng: number;
  descripcion: string;
  imagen_url: string;
};

export type Imperdible = {
  titulo: string;
  descripcion: string;
  imagen_url: string;
  lat?: number;
  lng?: number;
  tag?: string;
};

export type Tip = {
  titulo: string;
  descripcion: string;
  icono: string; // Ionicons name
};

export type RegionInfo = {
  codigo: string;
  nombre: string;
  subtitulo: string;
  descripcion: string;
  imagen_hero: string;
  acento: string; // color overlay
  ciudades: CiudadDestacada[];
  imperdibles: Imperdible[];
  tips: Tip[];
  /** Bounding box aprox [lat_min, lat_max, lng_min, lng_max] */
  bbox: [number, number, number, number];
};

export const REGIONES: RegionInfo[] = [
  {
    codigo: 'maule',
    nombre: 'Región del Maule',
    subtitulo: 'Viñas, ríos y costa tradicional',
    descripcion:
      'Corazón vitivinícola de Chile. Mezcla de valles andinos, bosques nativos y playas tranquilas. Tierra de huasos, vino carmenere y gastronomía campesina.',
    imagen_hero:
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
    acento: '#B45309',
    ciudades: [
      {
        nombre: 'Talca',
        lat: -35.4264,
        lng: -71.6554,
        descripcion: 'Capital regional. Plaza histórica, viñas y museos.',
        imagen_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
      },
      {
        nombre: 'Constitución',
        lat: -35.3333,
        lng: -72.4167,
        descripcion: 'Puerto maderero, playa y Roca Oceánica.',
        imagen_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      },
      {
        nombre: 'Curicó',
        lat: -34.9833,
        lng: -71.2333,
        descripcion: 'Portal de viñas del valle de Curicó.',
        imagen_url: 'https://images.unsplash.com/photo-1524593166156-312f362cada0?w=600&q=80',
      },
      {
        nombre: 'Linares',
        lat: -35.8464,
        lng: -71.5933,
        descripcion: 'Ciudad agrícola y puerta al Achibueno.',
        imagen_url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&q=80',
      },
    ],
    imperdibles: [
      {
        titulo: 'Radal Siete Tazas',
        descripcion: 'Cascadas escalonadas únicas en pozones de roca volcánica.',
        imagen_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
        lat: -35.4661,
        lng: -70.9939,
        tag: 'Naturaleza',
      },
      {
        titulo: 'Ruta del Vino',
        descripcion: 'Más de 20 viñas abiertas en valles de Curicó, Talca y Maule.',
        imagen_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
        tag: 'Gastronomía',
      },
      {
        titulo: 'Altos de Lircay',
        descripcion: 'Trekking al Enladrillado y Valle del Venado, imperdibles andinos.',
        imagen_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
        lat: -35.5879,
        lng: -71.0497,
        tag: 'Aventura',
      },
      {
        titulo: 'Playas de Iloca y Duao',
        descripcion: 'Caletas pesqueras, mariscos y atardeceres sobre el Pacífico.',
        imagen_url: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800&q=80',
        lat: -34.93,
        lng: -72.1833,
        tag: 'Costa',
      },
    ],
    tips: [
      {
        titulo: 'Prueba el borgoña',
        descripcion: 'Tinto joven con frutilla, clásico de las fiestas campesinas del Maule.',
        icono: 'wine',
      },
      {
        titulo: 'Respeta el horario',
        descripcion: 'Museos y viñas suelen cerrar al mediodía. Planifica tour por bloques.',
        icono: 'time',
      },
      {
        titulo: 'Empanadas de mariscos',
        descripcion: 'Paraderos en la costa (Duao, Pellines, Iloca) son los mejores.',
        icono: 'fast-food',
      },
      {
        titulo: 'Llevá ropa de abrigo',
        descripcion: 'Cordillera fresca incluso en verano. Siete Tazas está a 800 msnm.',
        icono: 'thermometer',
      },
    ],
    bbox: [-36.2, -34.8, -72.7, -70.3],
  },
  {
    codigo: 'metropolitana',
    nombre: 'Región Metropolitana',
    subtitulo: 'Santiago, cordillera y valles',
    descripcion:
      'Capital vibrante entre la Cordillera de los Andes y el valle central. Mezcla urbana, gastronómica y patrimonial con escapadas rurales a 30 minutos.',
    imagen_hero:
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=1200&q=80',
    acento: '#0F766E',
    ciudades: [
      {
        nombre: 'Santiago',
        lat: -33.4489,
        lng: -70.6693,
        descripcion: 'Capital histórica, museos, gastronomía y centros culturales.',
        imagen_url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=600&q=80',
      },
      {
        nombre: 'Pirque',
        lat: -33.6553,
        lng: -70.5828,
        descripcion: 'Viñas Concha y Toro y naturaleza cordillerana.',
        imagen_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80',
      },
      {
        nombre: 'Cajón del Maipo',
        lat: -33.6430,
        lng: -70.3567,
        descripcion: 'Valle andino con termas, trekking y embalse El Yeso.',
        imagen_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
      },
      {
        nombre: 'Farellones',
        lat: -33.3547,
        lng: -70.3231,
        descripcion: 'Centros de esquí en invierno, hiking en verano.',
        imagen_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80',
      },
    ],
    imperdibles: [
      {
        titulo: 'Cerro San Cristóbal',
        descripcion: 'Mirador 360° de Santiago, funicular histórico y piscinas.',
        imagen_url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=800&q=80',
        lat: -33.4256,
        lng: -70.6297,
        tag: 'Mirador',
      },
      {
        titulo: 'Barrio Lastarria',
        descripcion: 'Calles peatonales con arte, teatros y mejores cafés del centro.',
        imagen_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
        tag: 'Cultura',
      },
      {
        titulo: 'Embalse El Yeso',
        descripcion: 'Lago turquesa a 2500 msnm, vistas imposibles del Cajón del Maipo.',
        imagen_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
        tag: 'Naturaleza',
      },
    ],
    tips: [
      {
        titulo: 'Metro > auto',
        descripcion: 'Red de metro eficiente. Evita arriendo de auto en el centro.',
        icono: 'subway',
      },
      {
        titulo: 'Restaurantes después de las 20h',
        descripcion: 'Cocinas abren tarde. Reservar en finde para evitar espera.',
        icono: 'restaurant',
      },
      {
        titulo: 'Smog en invierno',
        descripcion: 'Consultar calidad del aire. Preemergencias restringen circulación.',
        icono: 'cloud',
      },
    ],
    bbox: [-34.3, -33.0, -71.5, -70.0],
  },
  {
    codigo: 'valparaiso',
    nombre: 'Región de Valparaíso',
    subtitulo: 'Puerto, cerros y costa bohemia',
    descripcion:
      'Anfiteatro natural frente al Pacífico. Valparaíso Patrimonio de la Humanidad, viñas de Casablanca y playas de Viña del Mar hasta Cachagua.',
    imagen_hero:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    acento: '#7C3AED',
    ciudades: [
      {
        nombre: 'Valparaíso',
        lat: -33.0472,
        lng: -71.6127,
        descripcion: 'Cerros, ascensores patrimoniales y arte urbano.',
        imagen_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
      },
      {
        nombre: 'Viña del Mar',
        lat: -33.0246,
        lng: -71.5518,
        descripcion: 'Ciudad jardín con playas, casino y festival internacional.',
        imagen_url: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=600&q=80',
      },
      {
        nombre: 'Casablanca',
        lat: -33.3167,
        lng: -71.4167,
        descripcion: 'Valle vitivinícola especializado en sauvignon blanc.',
        imagen_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80',
      },
      {
        nombre: 'Zapallar',
        lat: -32.5489,
        lng: -71.4625,
        descripcion: 'Balneario exclusivo con cocinería El Chiringuito.',
        imagen_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      },
    ],
    imperdibles: [
      {
        titulo: 'La Sebastiana (Neruda)',
        descripcion: 'Casa-museo con vista al puerto. Arquitectura excéntrica.',
        imagen_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
        tag: 'Cultura',
      },
      {
        titulo: 'Ascensores de Valpo',
        descripcion: 'Concepción, Reina Victoria, El Peral. Patrimonio único en Latam.',
        imagen_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
        tag: 'Patrimonio',
      },
      {
        titulo: 'Caleta Portales',
        descripcion: 'Mariscos frescos directo del pescador, ambiente local.',
        imagen_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
        tag: 'Gastronomía',
      },
    ],
    tips: [
      {
        titulo: 'Cuidado con pertenencias',
        descripcion: 'Cerros turísticos OK, pero evita zonas bajas de noche.',
        icono: 'shield-checkmark',
      },
      {
        titulo: 'Camina los cerros',
        descripcion: 'Alegre, Concepción, Bellavista: callecitas con murales y cafés.',
        icono: 'walk',
      },
      {
        titulo: 'Viento en la costa',
        descripcion: 'Tarde trae marejada. Llevá cortavientos aunque haga sol.',
        icono: 'flag',
      },
    ],
    bbox: [-33.5, -32.0, -72.5, -70.7],
  },
  {
    codigo: 'los_lagos',
    nombre: 'Región de Los Lagos',
    subtitulo: 'Lagos, volcanes y Chiloé',
    descripcion:
      'Verde patagónico austral. Lagos Llanquihue y Todos los Santos, volcán Osorno, archipiélago de Chiloé con palafitos e iglesias de madera.',
    imagen_hero:
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=80',
    acento: '#059669',
    ciudades: [
      {
        nombre: 'Puerto Varas',
        lat: -41.3189,
        lng: -72.9856,
        descripcion: 'Ciudad de las rosas frente al Llanquihue y volcán Osorno.',
        imagen_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80',
      },
      {
        nombre: 'Puerto Montt',
        lat: -41.4717,
        lng: -72.9360,
        descripcion: 'Capital regional, puerta a Chiloé y Carretera Austral.',
        imagen_url: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&q=80',
      },
      {
        nombre: 'Castro (Chiloé)',
        lat: -42.4792,
        lng: -73.7631,
        descripcion: 'Palafitos coloridos y iglesia patrimonio UNESCO.',
        imagen_url: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=600&q=80',
      },
      {
        nombre: 'Frutillar',
        lat: -41.1256,
        lng: -73.0833,
        descripcion: 'Colonia alemana, Teatro del Lago y kuchen.',
        imagen_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      },
    ],
    imperdibles: [
      {
        titulo: 'Volcán Osorno',
        descripcion: 'Ascenso guiado a glaciares y vista panorámica del Llanquihue.',
        imagen_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
        tag: 'Aventura',
      },
      {
        titulo: 'Saltos del Petrohué',
        descripcion: 'Cascadas esmeralda en la ruta a Todos los Santos.',
        imagen_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
        tag: 'Naturaleza',
      },
      {
        titulo: 'Iglesias de Chiloé',
        descripcion: '16 iglesias de madera patrimonio de la humanidad UNESCO.',
        imagen_url: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&q=80',
        tag: 'Patrimonio',
      },
      {
        titulo: 'Curanto en hoyo',
        descripcion: 'Plato ancestral chilote: mariscos, carne y milcao bajo tierra.',
        imagen_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
        tag: 'Gastronomía',
      },
    ],
    tips: [
      {
        titulo: 'Llueve todo el año',
        descripcion: 'Incluso en verano. Cortavientos + zapatos impermeables obligados.',
        icono: 'rainy',
      },
      {
        titulo: 'Reservar ferry Chiloé',
        descripcion: 'En temporada alta el cruce Pargua-Chacao colapsa. Sale cada 30 min.',
        icono: 'boat',
      },
      {
        titulo: 'Probar la cazuela chilota',
        descripcion: 'Con luche, chochoca y cerdo ahumado. Típica invernal.',
        icono: 'restaurant',
      },
    ],
    bbox: [-43.5, -40.2, -74.5, -71.5],
  },

  // ================================================================
  // REGIONES ADICIONALES (norte + extremo sur)
  // ================================================================

  {
    codigo: 'arica',
    nombre: 'Región de Arica y Parinacota',
    subtitulo: 'Desierto, altiplano y Pacífico',
    descripcion:
      'Portal norte de Chile. Altiplano andino a 4500 msnm, volcán Parinacota y lago Chungará. Playas del Pacífico, valles fértiles y cultura aymara.',
    imagen_hero: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
    acento: '#D97706',
    ciudades: [
      { nombre: 'Arica', lat: -18.4783, lng: -70.3126, descripcion: 'Ciudad puerto, playas y Morro histórico.', imagen_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80' },
      { nombre: 'Putre', lat: -18.1953, lng: -69.5578, descripcion: 'Pueblo altiplánico, base para Parque Lauca.', imagen_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
    ],
    imperdibles: [
      { titulo: 'Lago Chungará', descripcion: 'Uno de los lagos más altos del mundo, frente al Parinacota.', imagen_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', tag: 'Naturaleza' },
      { titulo: 'Morro de Arica', descripcion: 'Cerro con vista al Pacífico y museo de la Guerra.', imagen_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', tag: 'Historia' },
      { titulo: 'Momias de Chinchorro', descripcion: 'Momificaciones más antiguas del mundo, patrimonio UNESCO.', imagen_url: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&q=80', tag: 'Cultura' },
    ],
    tips: [
      { titulo: 'Sube de a poco', descripcion: 'Aclimatación obligada para el altiplano. Coca mate ayuda.', icono: 'thermometer' },
      { titulo: 'Sol extremo', descripcion: 'Bloqueador 50+ y sombrero. Radiación UV muy alta.', icono: 'sunny' },
    ],
    bbox: [-19.2, -17.4, -71.0, -68.8],
  },

  {
    codigo: 'tarapaca',
    nombre: 'Región de Tarapacá',
    subtitulo: 'Desierto, salitreras y surf',
    descripcion:
      'Iquique y su Zona Franca, Humberstone patrimonio UNESCO y oasis de Pica. Altiplano con salares y pueblos andinos.',
    imagen_hero: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&q=80',
    acento: '#EA580C',
    ciudades: [
      { nombre: 'Iquique', lat: -20.2208, lng: -70.1431, descripcion: 'Playas, casino y centro histórico.', imagen_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80' },
      { nombre: 'Pica', lat: -20.4906, lng: -69.3297, descripcion: 'Oasis de limones y termas.', imagen_url: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&q=80' },
    ],
    imperdibles: [
      { titulo: 'Humberstone', descripcion: 'Oficina salitrera abandonada, patrimonio UNESCO.', imagen_url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80', tag: 'Patrimonio' },
      { titulo: 'Playa Cavancha', descripcion: 'Playa urbana, palmeras y atardeceres.', imagen_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80', tag: 'Costa' },
    ],
    tips: [{ titulo: 'Zona Franca', descripcion: 'Electrónica y perfumes sin impuestos en Iquique.', icono: 'bag' }],
    bbox: [-21.5, -19.2, -70.5, -68.5],
  },

  {
    codigo: 'antofagasta',
    nombre: 'Región de Antofagasta',
    subtitulo: 'Atacama, salares y astronomía',
    descripcion:
      'San Pedro de Atacama, Valle de la Luna, géiseres del Tatio y cielos con los mejores observatorios del planeta.',
    imagen_hero: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
    acento: '#B45309',
    ciudades: [
      { nombre: 'San Pedro de Atacama', lat: -22.9087, lng: -68.1997, descripcion: 'Pueblo adobe y portal al desierto.', imagen_url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=600&q=80' },
      { nombre: 'Antofagasta', lat: -23.6509, lng: -70.3975, descripcion: 'Ciudad puerto y La Portada.', imagen_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
    ],
    imperdibles: [
      { titulo: 'Valle de la Luna', descripcion: 'Atardecer lunar entre dunas y formaciones rocosas.', imagen_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', tag: 'Naturaleza' },
      { titulo: 'Géiseres del Tatio', descripcion: 'Campo geotérmico a 4320 msnm al amanecer.', imagen_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', tag: 'Aventura' },
      { titulo: 'Mano del Desierto', descripcion: 'Escultura gigante en medio del desierto más árido.', imagen_url: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&q=80', tag: 'Arte' },
    ],
    tips: [
      { titulo: 'Agua constante', descripcion: 'Humedad casi cero. 3 litros al día mínimo.', icono: 'water' },
      { titulo: 'Observación astronómica', descripcion: 'Reservar tour noche sin luna llena.', icono: 'sparkles' },
    ],
    bbox: [-25.5, -21.5, -70.7, -67.5],
  },

  {
    codigo: 'atacama',
    nombre: 'Región de Atacama',
    subtitulo: 'Desierto florido y Pacífico',
    descripcion:
      'Tras lluvias esporádicas el desierto florece. Playas esmeralda de Bahía Inglesa y salares altoandinos.',
    imagen_hero: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=1200&q=80',
    acento: '#EC4899',
    ciudades: [
      { nombre: 'Copiapó', lat: -27.3666, lng: -70.3322, descripcion: 'Capital minera, portal al desierto.', imagen_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80' },
      { nombre: 'Caldera', lat: -27.0667, lng: -70.8333, descripcion: 'Puerto pesquero y Bahía Inglesa.', imagen_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80' },
    ],
    imperdibles: [
      { titulo: 'Desierto Florido', descripcion: 'Miles de flores tras lluvias (sep-nov).', imagen_url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&q=80', tag: 'Naturaleza' },
      { titulo: 'Bahía Inglesa', descripcion: 'Playa de aguas turquesa, arena blanca.', imagen_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80', tag: 'Costa' },
    ],
    tips: [{ titulo: 'Temporada de flores', descripcion: 'Solo en años con precipitación. Consultar antes.', icono: 'flower' }],
    bbox: [-29.5, -25.5, -71.5, -69.0],
  },

  {
    codigo: 'coquimbo',
    nombre: 'Región de Coquimbo',
    subtitulo: 'Pisco, estrellas y costa',
    descripcion:
      'Valle del Elqui con sus observatorios, cuna del pisco y Gabriela Mistral. Playas de La Serena y parque Fray Jorge.',
    imagen_hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    acento: '#6D28D9',
    ciudades: [
      { nombre: 'La Serena', lat: -29.9078, lng: -71.2528, descripcion: 'Ciudad colonial con playa urbana.', imagen_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80' },
      { nombre: 'Pisco Elqui', lat: -30.1256, lng: -70.4931, descripcion: 'Cuna del pisco y observatorios.', imagen_url: 'https://images.unsplash.com/photo-1470162656305-6f429ba817bf?w=600&q=80' },
    ],
    imperdibles: [
      { titulo: 'Valle del Elqui', descripcion: 'Destilerías, observación astronómica.', imagen_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80', tag: 'Gastronomía' },
      { titulo: 'Observatorio Mamalluca', descripcion: 'Astronomía turística con guías.', imagen_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', tag: 'Astronomía' },
    ],
    tips: [{ titulo: 'Noches de Elqui', descripcion: 'Cielos más despejados del mundo. Abrigate, frío nocturno.', icono: 'star' }],
    bbox: [-32.0, -29.0, -72.0, -70.0],
  },

  {
    codigo: 'ohiggins',
    nombre: 'Región de O’Higgins',
    subtitulo: 'Vinos, huaso y surf',
    descripcion:
      'Valle de Colchagua, capital del vino chileno. Pichilemu meca del surf sudamericano. Tradición huasa.',
    imagen_hero: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
    acento: '#BE185D',
    ciudades: [
      { nombre: 'Santa Cruz', lat: -34.6333, lng: -71.3667, descripcion: 'Corazón Colchagua, museo y viñas.', imagen_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80' },
      { nombre: 'Pichilemu', lat: -34.3833, lng: -72.0, descripcion: 'Surf y Punta de Lobos.', imagen_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80' },
    ],
    imperdibles: [
      { titulo: 'Viñas de Colchagua', descripcion: '30+ viñas con tours y degustaciones.', imagen_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80', tag: 'Gastronomía' },
      { titulo: 'Punta de Lobos', descripcion: 'Ola mundial para surfistas.', imagen_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80', tag: 'Deporte' },
    ],
    tips: [{ titulo: 'Tren del Vino', descripcion: 'Recorre viñas en tren de los 1960s.', icono: 'train' }],
    bbox: [-35.0, -33.8, -72.2, -70.0],
  },

  {
    codigo: 'nuble',
    nombre: 'Región de Ñuble',
    subtitulo: 'Termas, longaniza y cuna O’Higgins',
    descripcion:
      'Chillán y sus termas con ski en invierno. Cobquecura y sus lobos marinos. Tierra de Bernardo O’Higgins y Claudio Arrau.',
    imagen_hero: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=80',
    acento: '#0891B2',
    ciudades: [
      { nombre: 'Chillán', lat: -36.6063, lng: -72.1031, descripcion: 'Mercado típico, longaniza y Murales Siqueiros.', imagen_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80' },
      { nombre: 'Cobquecura', lat: -36.1333, lng: -72.7833, descripcion: 'Iglesia de Piedra, lobos marinos.', imagen_url: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&q=80' },
    ],
    imperdibles: [
      { titulo: 'Termas de Chillán', descripcion: 'Ski + termas naturales. Complejo turístico.', imagen_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80', tag: 'Aventura' },
    ],
    tips: [{ titulo: 'Longaniza de Chillán', descripcion: 'La más famosa de Chile. Mercado central imprescindible.', icono: 'restaurant' }],
    bbox: [-37.2, -36.0, -73.0, -71.0],
  },

  {
    codigo: 'biobio',
    nombre: 'Región del Biobío',
    subtitulo: 'Universitaria y costa',
    descripcion:
      'Concepción con su vida universitaria. Salto del Laja, araucarias de Nahuelbuta y cuencas carboníferas patrimoniales.',
    imagen_hero: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=80',
    acento: '#0D9488',
    ciudades: [
      { nombre: 'Concepción', lat: -36.8201, lng: -73.0444, descripcion: 'Universidad, galería historia y rock indie.', imagen_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80' },
      { nombre: 'Los Ángeles', lat: -37.4697, lng: -72.3539, descripcion: 'Portal al Salto del Laja.', imagen_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80' },
    ],
    imperdibles: [
      { titulo: 'Salto del Laja', descripcion: 'Cascadas junto a la Ruta 5.', imagen_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', tag: 'Naturaleza' },
      { titulo: 'Parque Nahuelbuta', descripcion: 'Araucarias milenarias y Pacífico.', imagen_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80', tag: 'Naturaleza' },
    ],
    tips: [{ titulo: 'Lluvia asegurada', descripcion: 'Junio-agosto llueve casi todos los días.', icono: 'rainy' }],
    bbox: [-38.5, -36.7, -74.0, -71.5],
  },

  {
    codigo: 'araucania',
    nombre: 'Región de La Araucanía',
    subtitulo: 'Volcanes, lagos y cultura mapuche',
    descripcion:
      'Pucón, volcán Villarrica, termas y bosques de araucarias. Corazón del pueblo mapuche, su gastronomía y rituales.',
    imagen_hero: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=80',
    acento: '#DC2626',
    ciudades: [
      { nombre: 'Pucón', lat: -39.2714, lng: -71.9796, descripcion: 'Capital del turismo aventura.', imagen_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80' },
      { nombre: 'Temuco', lat: -38.7359, lng: -72.5904, descripcion: 'Capital regional, gastronomía mapuche.', imagen_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80' },
      { nombre: 'Villarrica', lat: -39.2833, lng: -72.2167, descripcion: 'Lago y volcán homónimo.', imagen_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
    ],
    imperdibles: [
      { titulo: 'Volcán Villarrica', descripcion: 'Ascenso a cráter activo con guía.', imagen_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80', tag: 'Aventura' },
      { titulo: 'Parque Conguillío', descripcion: 'Araucarias y lagos turquesa.', imagen_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80', tag: 'Naturaleza' },
    ],
    tips: [
      { titulo: 'Mari mari', descripcion: '"Hola" en mapudungún. Respeta la cultura local.', icono: 'hand-right' },
      { titulo: 'Termas múltiples', descripcion: 'Peumayén, Huife, Los Pozones. Hay para todos los bolsillos.', icono: 'water' },
    ],
    bbox: [-40.0, -37.8, -73.5, -70.7],
  },

  {
    codigo: 'los_rios',
    nombre: 'Región de Los Ríos',
    subtitulo: 'Selva valdiviana y cerveza artesanal',
    descripcion:
      'Valdivia, ciudad fluvial con influencia alemana. Alerces milenarios, fuertes españoles y salto del Huilo Huilo.',
    imagen_hero: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80',
    acento: '#0369A1',
    ciudades: [
      { nombre: 'Valdivia', lat: -39.8142, lng: -73.2459, descripcion: 'Mercado fluvial y cervecerías.', imagen_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80' },
      { nombre: 'Panguipulli', lat: -39.6367, lng: -72.3339, descripcion: 'Siete lagos andinos.', imagen_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
    ],
    imperdibles: [
      { titulo: 'Huilo Huilo', descripcion: 'Reserva privada con cascadas y hoteles tematizados.', imagen_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', tag: 'Naturaleza' },
      { titulo: 'Fuertes de Niebla', descripcion: 'Historia colonial española.', imagen_url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80', tag: 'Patrimonio' },
    ],
    tips: [{ titulo: 'Cervezas locales', descripcion: 'Kunstmann, Bundor, Cuello Negro. Ruta cervecera.', icono: 'beer' }],
    bbox: [-40.6, -39.3, -73.9, -71.8],
  },

  {
    codigo: 'aysen',
    nombre: 'Región de Aysén',
    subtitulo: 'Patagonia virgen y Carretera Austral',
    descripcion:
      'Fiordos, ventisqueros y pueblos aislados. Capillas de Mármol, Parque Queulat y ruta austral que conecta el fin del mundo.',
    imagen_hero: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
    acento: '#1E40AF',
    ciudades: [
      { nombre: 'Coyhaique', lat: -45.5712, lng: -72.0685, descripcion: 'Capital regional patagónica.', imagen_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80' },
      { nombre: 'Puerto Río Tranquilo', lat: -46.6333, lng: -72.6833, descripcion: 'Capillas de Mármol, ventisquero Exploradores.', imagen_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
    ],
    imperdibles: [
      { titulo: 'Capillas de Mármol', descripcion: 'Cuevas talladas por el agua en Lago General Carrera.', imagen_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', tag: 'Naturaleza' },
      { titulo: 'Ventisquero Colgante Queulat', descripcion: 'Glaciar colgante sobre el fiordo.', imagen_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80', tag: 'Naturaleza' },
    ],
    tips: [
      { titulo: 'Tanquea siempre', descripcion: 'Gasolineras escasas. Llena cuando puedas.', icono: 'car' },
      { titulo: 'Conectividad limitada', descripcion: 'Internet y celular intermitente. Descarga mapas offline.', icono: 'cloud-offline' },
    ],
    bbox: [-48.0, -43.5, -76.0, -71.5],
  },

  {
    codigo: 'magallanes',
    nombre: 'Región de Magallanes',
    subtitulo: 'Torres del Paine y fin del mundo',
    descripcion:
      'Parque Nacional Torres del Paine, uno de los más bellos del planeta. Pingüinos, estrechos y Tierra del Fuego.',
    imagen_hero: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=80',
    acento: '#1E3A8A',
    ciudades: [
      { nombre: 'Punta Arenas', lat: -53.1638, lng: -70.9171, descripcion: 'Ciudad austral continental, cementerio y pingüineras.', imagen_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80' },
      { nombre: 'Puerto Natales', lat: -51.7236, lng: -72.5100, descripcion: 'Base para Torres del Paine.', imagen_url: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&q=80' },
    ],
    imperdibles: [
      { titulo: 'Torres del Paine', descripcion: 'Trekking W (5 días) o circuito O (10 días).', imagen_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80', tag: 'Aventura' },
      { titulo: 'Isla Magdalena', descripcion: 'Colonia de pingüinos magallánicos.', imagen_url: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80', tag: 'Fauna' },
    ],
    tips: [
      { titulo: 'Viento feroz', descripcion: 'Hasta 120 km/h. Ropa técnica imprescindible.', icono: 'flag' },
      { titulo: 'Reservar con meses', descripcion: 'Albergues Torres del Paine se agotan con 6 meses.', icono: 'calendar' },
    ],
    bbox: [-56.5, -48.0, -76.0, -66.5],
  },
];

const REGION_GENERICA: RegionInfo = {
  codigo: 'chile',
  nombre: 'Chile',
  subtitulo: 'De Arica a la Antártica',
  descripcion:
    'Más de 4000 km de costa, desierto más árido del mundo, bosques patagónicos y hielos eternos. Una geografía única en el planeta.',
  imagen_hero: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
  acento: '#2D6A4F',
  ciudades: [],
  imperdibles: [],
  tips: [
    { titulo: 'Usa la bandera', descripcion: 'Toca la bandera arriba para elegir región y ver contenido.', icono: 'flag' },
  ],
  bbox: [-56.5, -17.4, -76.0, -66.5],
};

/** Busca la región por lat/lng. Fallback: Chile genérico. */
export function getRegionByLatLng(lat: number, lng: number): RegionInfo {
  for (const r of REGIONES) {
    const [latMin, latMax, lngMin, lngMax] = r.bbox;
    if (lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax) {
      return r;
    }
  }
  return REGION_GENERICA;
}
