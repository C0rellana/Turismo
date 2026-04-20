-- Panoramas Cerca - Seed Data (Santiago, Chile)
-- ~30 panoramas distribuidos por categoría.
-- Ejecutar después de schema.sql.

insert into panoramas (nombre, descripcion, categoria, precio_nivel, direccion, imagen_url, location) values
-- Aire libre
('Cerro San Cristóbal', 'Parque metropolitano con funicular, mirador y piscinas.', 'aire_libre', 0, 'Pío Nono, Recoleta', 'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=800', st_makepoint(-70.6297, -33.4256)::geography),
('Parque Bicentenario', 'Parque urbano con lagunas, flamencos y áreas de picnic.', 'aire_libre', 0, 'Av. Bicentenario 3800, Vitacura', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800', st_makepoint(-70.5857, -33.3977)::geography),
('Cajón del Maipo', 'Escapada de día a la cordillera, trekking y termas.', 'aire_libre', 1, 'San José de Maipo', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', st_makepoint(-70.3567, -33.6430)::geography),
('Parque Araucano', 'Parque familiar con anfiteatro y juegos.', 'aire_libre', 0, 'Presidente Riesco 5330, Las Condes', 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800', st_makepoint(-70.5763, -33.4033)::geography),
('Parque O''Higgins', 'Parque histórico con juegos mecánicos y Movistar Arena.', 'aire_libre', 0, 'Av. Beauchef, Santiago', 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800', st_makepoint(-70.6590, -33.4650)::geography),

-- Cultura
('Museo Bellas Artes', 'Museo de arte chileno y muestras internacionales.', 'cultura', 0, 'José Miguel de la Barra 650, Santiago', 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800', st_makepoint(-70.6440, -33.4370)::geography),
('Centro GAM', 'Centro cultural con teatro, exposiciones y café.', 'cultura', 0, 'Av. Libertador Bernardo O''Higgins 227', 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800', st_makepoint(-70.6395, -33.4411)::geography),
('Museo de la Memoria', 'Museo de los derechos humanos 1973-1990.', 'cultura', 0, 'Matucana 501, Quinta Normal', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800', st_makepoint(-70.6823, -33.4404)::geography),
('La Chascona', 'Casa-museo de Pablo Neruda en Bellavista.', 'cultura', 2, 'Fernando Márquez de la Plata 0192', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800', st_makepoint(-70.6350, -33.4330)::geography),
('Teatro Municipal', 'Temporadas de ópera, ballet y orquesta.', 'cultura', 2, 'Agustinas 794, Santiago', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800', st_makepoint(-70.6496, -33.4413)::geography),

-- Gastronomía
('Mercado Central', 'Mercado histórico de pescados y mariscos.', 'gastronomia', 2, 'San Pablo 967, Santiago', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', st_makepoint(-70.6508, -33.4343)::geography),
('Barrio Italia', 'Calle con cafés, restaurantes y anticuarios.', 'gastronomia', 2, 'Av. Italia, Providencia', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', st_makepoint(-70.6206, -33.4413)::geography),
('La Vega Central', 'Mercado frutas/verduras, pulperías y cocinerías típicas.', 'gastronomia', 1, 'Antonia López de Bello 743', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', st_makepoint(-70.6457, -33.4328)::geography),
('Liguria Bellavista', 'Bar clásico santiaguino, terraza y cocina chilena.', 'gastronomia', 2, 'Pío Nono 131, Recoleta', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', st_makepoint(-70.6357, -33.4332)::geography),
('Boragó', 'Alta cocina con ingredientes nativos.', 'gastronomia', 3, 'Nueva Costanera 3467, Vitacura', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', st_makepoint(-70.5812, -33.3960)::geography),
('Peumayen Ancestral', 'Menú degustación de cocina mapuche.', 'gastronomia', 3, 'Constitución 136, Providencia', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', st_makepoint(-70.6328, -33.4310)::geography),

-- Nocturno
('Bellavista', 'Barrio bohemio con bares y discotecas.', 'nocturno', 2, 'Barrio Bellavista, Recoleta', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', st_makepoint(-70.6345, -33.4318)::geography),
('Bar The Clinic', 'Pub con trivia y cerveza artesanal.', 'nocturno', 2, 'Monjitas 578, Santiago', 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800', st_makepoint(-70.6445, -33.4368)::geography),
('Club Blondie', 'Discoteca histórica, indie y britpop.', 'nocturno', 2, 'Alameda 2879, Santiago', 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800', st_makepoint(-70.6795, -33.4528)::geography),
('Bocanáriz', 'Bar de vinos con cata y picoteo.', 'nocturno', 2, 'José Victorino Lastarria 276', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', st_makepoint(-70.6401, -33.4384)::geography),

-- Familiar
('Buin Zoo', 'Zoológico con más de 3000 animales.', 'familiar', 2, 'Panamericana Sur Km 32, Buin', 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800', st_makepoint(-70.7406, -33.7340)::geography),
('Fantasilandia', 'Parque de diversiones con montañas rusas.', 'familiar', 3, 'Beauchef 938, Santiago', 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800', st_makepoint(-70.6612, -33.4650)::geography),
('Museo Interactivo Mirador', 'MIM, museo interactivo para niños.', 'familiar', 2, 'Av. Punta Arenas 6711, La Granja', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', st_makepoint(-70.6256, -33.5341)::geography),
('Parquemet Teleférico', 'Teleférico con vistas panorámicas.', 'familiar', 2, 'Pío Nono, Recoleta', 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=800', st_makepoint(-70.6273, -33.4193)::geography),

-- Deporte
('Estadio Nacional', 'Estadio y parque deportivo de Ñuñoa.', 'deporte', 0, 'Av. Grecia 2001, Ñuñoa', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800', st_makepoint(-70.6104, -33.4643)::geography),
('Parque Metropolitano Piscinas', 'Piscinas Tupahue y Antilén.', 'deporte', 2, 'Cerro San Cristóbal', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800', st_makepoint(-70.6270, -33.4220)::geography),
('Skatepark Parque Forestal', 'Skatepark público con rampas.', 'deporte', 0, 'Parque Forestal, Santiago', 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800', st_makepoint(-70.6415, -33.4355)::geography),
('Ciclovía Mapocho', 'Circuito de bici junto al río Mapocho.', 'deporte', 0, 'Av. Andrés Bello', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800', st_makepoint(-70.6112, -33.4230)::geography),
('Farellones', 'Centro de ski en temporada, hiking en verano.', 'deporte', 3, 'Camino a Farellones', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', st_makepoint(-70.3231, -33.3547)::geography),
('Escalada Los Peumos', 'Muro de escalada indoor.', 'deporte', 2, 'Av. Las Condes 11000', 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800', st_makepoint(-70.5103, -33.3702)::geography);

-- Marcar todos los seeds como moderados (visibles a anon).
update panoramas set moderado = true where creado_por is null and moderado = false;
