-- seed_maule.sql — Región del Maule (Chile)
-- Lugares turísticos fijos + panoramas/eventos próximos.
-- Ejecutar DESPUÉS de schema.sql (requiere tabla lugares con tipo_lugar).

-- ============================================================
-- 1. LUGARES TURÍSTICOS (tipo = 'turistico')
-- ============================================================

insert into lugares (nombre, descripcion, categoria, tipo, precio_nivel, direccion, imagen_url, location, moderado) values

-- Parques y naturaleza
('Parque Nacional Radal Siete Tazas', 'Cascadas escalonadas en pozones de roca volcánica. Trekking y senderismo.', 'aire_libre', 'turistico', 1, 'Molina, Maule', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', st_makepoint(-70.9939, -35.4661)::geography, true),
('Reserva Nacional Altos de Lircay', 'Red de senderos cordilleranos, Enladrillado y Valle del Venado.', 'aire_libre', 'turistico', 1, 'Vilches, San Clemente', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800', st_makepoint(-71.0497, -35.5879)::geography, true),
('Laguna del Maule', 'Lago alto-andino con pesca deportiva y paisajes volcánicos.', 'aire_libre', 'turistico', 1, 'San Clemente, Maule', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', st_makepoint(-70.5000, -36.0333)::geography, true),
('Embalse Colbún', 'Lago artificial para navegar, pescar y acampar.', 'aire_libre', 'turistico', 0, 'Colbún, Maule', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800', st_makepoint(-71.4086, -35.7222)::geography, true),
('Cajón del Río Achibueno', 'Valle andino con camping, cabalgatas y termas.', 'aire_libre', 'turistico', 1, 'Linares', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', st_makepoint(-71.3333, -35.9500)::geography, true),
('Santuario de la Naturaleza Roca Oceánica', 'Formación rocosa frente al mar en Constitución.', 'aire_libre', 'turistico', 0, 'Constitución', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', st_makepoint(-72.4500, -35.3400)::geography, true),

-- Playas
('Playa de Iloca', 'Playa extensa y tranquila, ideal para familias.', 'familiar', 'turistico', 0, 'Iloca, Licantén', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', st_makepoint(-72.1833, -34.9300)::geography, true),
('Playa Duao', 'Caleta pesquera con olas para surf y gastronomía costera.', 'aire_libre', 'turistico', 0, 'Duao, Licantén', 'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800', st_makepoint(-72.1692, -34.8897)::geography, true),
('Playa Pelluhue', 'Balneario tradicional del sur del Maule.', 'familiar', 'turistico', 0, 'Pelluhue', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', st_makepoint(-72.5817, -35.8122)::geography, true),
('Playa Curanipe', 'Playa virgen con mariscos frescos y caletas.', 'aire_libre', 'turistico', 0, 'Curanipe', 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800', st_makepoint(-72.6253, -35.8286)::geography, true),
('Lago Vichuquén', 'Lago costero con deportes náuticos y casas de veraneo.', 'deporte', 'turistico', 2, 'Vichuquén', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800', st_makepoint(-72.0431, -34.8756)::geography, true),

-- Termas
('Termas de Panimávida', 'Termas históricas con hotel y tratamientos.', 'aire_libre', 'turistico', 2, 'Colbún', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', st_makepoint(-71.4219, -35.7244)::geography, true),
('Termas de Quinamávida', 'Aguas termales minerales, ambiente tranquilo.', 'aire_libre', 'turistico', 2, 'Colbún', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', st_makepoint(-71.4100, -35.7400)::geography, true),

-- Cultura Talca
('Museo O''Higginiano y de Bellas Artes', 'Casona colonial, arte e historia de Chile.', 'cultura', 'turistico', 0, '1 Norte 875, Talca', 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800', st_makepoint(-71.6554, -35.4264)::geography, true),
('Plaza de Armas de Talca', 'Centro histórico con palmeras y edificios patrimoniales.', 'cultura', 'turistico', 0, 'Talca', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', st_makepoint(-71.6660, -35.4264)::geography, true),
('Villa Cultural Huilquilemu', 'Casona patrimonial con museo de arte religioso y artesanía.', 'cultura', 'turistico', 1, 'Km 7 camino a San Clemente, Talca', 'https://images.unsplash.com/photo-1553532435-93d532a0fcde?w=800', st_makepoint(-71.5700, -35.4300)::geography, true),
('Mercado Central de Talca', 'Cocinerías típicas, frutas y artesanía.', 'gastronomia', 'turistico', 1, '1 Sur con 5 Oriente, Talca', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', st_makepoint(-71.6530, -35.4280)::geography, true),
('Cerro La Virgen', 'Mirador panorámico sobre Talca.', 'aire_libre', 'turistico', 0, 'Talca', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', st_makepoint(-71.6700, -35.4100)::geography, true),

-- Viñas
('Viña Balduzzi', 'Viña familiar con tour y degustación.', 'gastronomia', 'turistico', 2, 'Av. Balmaceda 1189, San Javier', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', st_makepoint(-71.7333, -35.6000)::geography, true),
('Viña Miguel Torres', 'Bodega con restaurante de altura y degustaciones.', 'gastronomia', 'turistico', 3, 'Panamericana Sur Km 195, Curicó', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', st_makepoint(-71.2400, -34.9833)::geography, true),
('Viña San Pedro Molina', 'Viña histórica valle de Molina.', 'gastronomia', 'turistico', 2, 'Molina', 'https://images.unsplash.com/photo-1470162656305-6f429ba817bf?w=800', st_makepoint(-71.2833, -35.1167)::geography, true),
('Viña Casa Donoso', 'Casona patrimonial, vinos premium valle del Maule.', 'gastronomia', 'turistico', 3, 'Camino a Las Rastras, Talca', 'https://images.unsplash.com/photo-1524593166156-312f362cada0?w=800', st_makepoint(-71.5500, -35.4500)::geography, true),

-- Gastronomía costera
('Caleta de Duao', 'Mariscos frescos y empanadas de mariscos.', 'gastronomia', 'turistico', 1, 'Duao', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', st_makepoint(-72.1692, -34.8897)::geography, true),

-- Familiar / aventura
('Parque Inglés Radal', 'Centro de esquí y actividades outdoor.', 'deporte', 'turistico', 2, 'Parque Nacional Radal', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', st_makepoint(-70.9000, -35.4800)::geography, true);

-- ============================================================
-- 2. PANORAMAS / EVENTOS PRÓXIMOS (tipo = 'panorama', con fecha)
-- ============================================================

insert into lugares (nombre, descripcion, categoria, tipo, precio_nivel, direccion, imagen_url, location, fecha_inicio, fecha_fin, moderado) values

('Fiesta de la Vendimia — Curicó', 'Festival tradicional con pisado de uva, música y degustación.', 'familiar', 'panorama', 1, 'Plaza de Armas, Curicó', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800',
  st_makepoint(-71.2400, -34.9833)::geography,
  now() + interval '5 days', now() + interval '7 days', true),

('Feria Costumbrista de Constitución', 'Gastronomía costera, artesanía y folclore.', 'gastronomia', 'panorama', 0, 'Costanera, Constitución', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
  st_makepoint(-72.4167, -35.3333)::geography,
  now() + interval '10 days', now() + interval '12 days', true),

('Festival de la Cereza — Linares', 'Fiesta agrícola con catas, música y shows familiares.', 'familiar', 'panorama', 0, 'Parque Municipal, Linares', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800',
  st_makepoint(-71.5933, -35.8464)::geography,
  now() + interval '14 days', now() + interval '16 days', true),

('Trekking nocturno Altos de Lircay', 'Caminata guiada con luna llena al Mirador del Venado.', 'aire_libre', 'panorama', 2, 'Reserva Altos de Lircay, Vilches', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
  st_makepoint(-71.0497, -35.5879)::geography,
  now() + interval '3 days', now() + interval '3 days' + interval '8 hours', true),

('Cicletada familiar Talca-Colbún', 'Ruta ciclista recreativa, 20 km llanos.', 'deporte', 'panorama', 0, 'Partida Plaza Talca', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
  st_makepoint(-71.6554, -35.4264)::geography,
  now() + interval '7 days', now() + interval '7 days' + interval '4 hours', true),

('Feria Gastronómica del Vino — Valle Maule', 'Productores locales, maridajes, food trucks.', 'gastronomia', 'panorama', 2, 'Parque de las Esculturas, Talca', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
  st_makepoint(-71.6500, -35.4300)::geography,
  now() + interval '20 days', now() + interval '22 days', true),

('Concierto al aire libre — Plaza de Linares', 'Orquesta sinfónica regional, entrada liberada.', 'cultura', 'panorama', 0, 'Plaza de Armas, Linares', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
  st_makepoint(-71.5933, -35.8464)::geography,
  now() + interval '6 days', now() + interval '6 days' + interval '3 hours', true),

('Feria de artesanos — Villa Huilquilemu', 'Tejidos, cerámica y greda de la región.', 'cultura', 'panorama', 0, 'Villa Cultural Huilquilemu', 'https://images.unsplash.com/photo-1553532435-93d532a0fcde?w=800',
  st_makepoint(-71.5700, -35.4300)::geography,
  now() + interval '2 days', now() + interval '4 days', true),

('Campeonato regional de surf — Pellines', 'Competencia amateur y profesional, olas del Maule.', 'deporte', 'panorama', 0, 'Playa Pellines, Constitución', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
  st_makepoint(-72.4800, -35.4000)::geography,
  now() + interval '18 days', now() + interval '20 days', true),

('Luna de Vino — Noche en Viña Balduzzi', 'Degustación nocturna con música en vivo y picoteo.', 'nocturno', 'panorama', 3, 'Viña Balduzzi, San Javier', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  st_makepoint(-71.7333, -35.6000)::geography,
  now() + interval '9 days', now() + interval '9 days' + interval '5 hours', true),

('Fiesta del Camarón — Duao', 'Celebración costumbrista de la pesca artesanal.', 'gastronomia', 'panorama', 1, 'Caleta Duao', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
  st_makepoint(-72.1692, -34.8897)::geography,
  now() + interval '25 days', now() + interval '27 days', true),

('Expo Rural — Talca', 'Feria agropecuaria con animales, maquinaria y food.', 'familiar', 'panorama', 1, 'Parque Ferial, Talca', 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
  st_makepoint(-71.6400, -35.4200)::geography,
  now() + interval '30 days', now() + interval '35 days', true),

('Cata ciega Chardonnay — Centro', 'Somelier guía degustación blind a ciegas.', 'gastronomia', 'panorama', 2, 'Restaurante Casa Chueca, Talca', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
  st_makepoint(-71.6554, -35.4264)::geography,
  now() + interval '4 days', now() + interval '4 days' + interval '3 hours', true);

-- ============================================================
-- 3. Ubicación default de la región (para app)
-- ============================================================
-- Talca: -35.4264, -71.6554
-- Considerar actualizar constants/categories.ts SANTIAGO_DEFAULT
-- si se quiere cambiar arranque a Talca.
