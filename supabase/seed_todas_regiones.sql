-- seed_todas_regiones.sql — Chile completo (16 regiones)
-- Lugares turísticos + panoramas próximos por región.
-- Ejecutar después de schema.sql. Complementa seed.sql (Santiago) y seed_maule.sql.

-- ============================================================
-- LUGARES TURÍSTICOS POR REGIÓN
-- ============================================================

insert into lugares (nombre, descripcion, categoria, tipo, precio_nivel, direccion, imagen_url, location, moderado) values

-- ARICA Y PARINACOTA
('Morro de Arica', 'Cerro histórico con museo y vista al Pacífico.', 'cultura', 'turistico', 0, 'Arica', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', st_makepoint(-70.3180, -18.4827)::geography, true),
('Parque Nacional Lauca', 'Altiplano 4500 msnm, lago Chungará y volcán Parinacota.', 'aire_libre', 'turistico', 1, 'Putre', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', st_makepoint(-69.2333, -18.2333)::geography, true),
('Valle de Azapa', 'Oasis con aceitunas, pucarás y museo arqueológico San Miguel.', 'cultura', 'turistico', 1, 'Azapa, Arica', 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800', st_makepoint(-70.2500, -18.5167)::geography, true),
('Playa Chinchorro', 'Playa urbana amplia de Arica.', 'familiar', 'turistico', 0, 'Arica', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', st_makepoint(-70.3000, -18.4500)::geography, true),

-- TARAPACÁ
('Iquique Centro', 'Edificios patrimoniales siglo XIX, Teatro Municipal.', 'cultura', 'turistico', 0, 'Iquique', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', st_makepoint(-70.1431, -20.2208)::geography, true),
('Playa Cavancha', 'Playa principal de Iquique.', 'familiar', 'turistico', 0, 'Iquique', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', st_makepoint(-70.1500, -20.2500)::geography, true),
('Humberstone y Santa Laura', 'Oficinas salitreras patrimonio UNESCO.', 'cultura', 'turistico', 1, 'Pozo Almonte', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800', st_makepoint(-69.7900, -20.2061)::geography, true),
('Géiseres de Puchuldiza', 'Géiseres a 4200 msnm, espectáculo al amanecer.', 'aire_libre', 'turistico', 2, 'Colchane', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', st_makepoint(-68.9167, -19.4167)::geography, true),

-- ANTOFAGASTA
('San Pedro de Atacama', 'Pueblo adobe, portal al desierto más árido del mundo.', 'cultura', 'turistico', 2, 'San Pedro de Atacama', 'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=800', st_makepoint(-68.1997, -22.9087)::geography, true),
('Valle de la Luna', 'Formaciones rocosas lunares, atardeceres icónicos.', 'aire_libre', 'turistico', 1, 'San Pedro de Atacama', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', st_makepoint(-68.2833, -22.9333)::geography, true),
('Géiseres del Tatio', 'Campo de géiseres a 4320 msnm, tour al amanecer.', 'aire_libre', 'turistico', 2, 'El Tatio', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', st_makepoint(-68.0100, -22.3333)::geography, true),
('La Portada', 'Arco natural sobre el mar, símbolo de Antofagasta.', 'aire_libre', 'turistico', 0, 'Antofagasta', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', st_makepoint(-70.4000, -23.5000)::geography, true),
('Mano del Desierto', 'Escultura gigantesca en medio del desierto.', 'cultura', 'turistico', 0, 'Ruta 5 Antofagasta', 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800', st_makepoint(-70.1500, -24.1000)::geography, true),

-- ATACAMA
('Parque Nacional Pan de Azúcar', 'Costa con pingüinos humboldt y desierto florido.', 'aire_libre', 'turistico', 1, 'Chañaral', 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800', st_makepoint(-70.6500, -26.1500)::geography, true),
('Bahía Inglesa', 'Playa turquesa con balneario familiar.', 'familiar', 'turistico', 1, 'Caldera', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', st_makepoint(-70.8500, -27.1000)::geography, true),
('Laguna Verde', 'Lago altoandino esmeralda a 4300 msnm.', 'aire_libre', 'turistico', 2, 'Copiapó', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800', st_makepoint(-69.3000, -26.9167)::geography, true),
('Desierto Florido', 'Alfombra de flores en primavera tras lluvia (septiembre-noviembre).', 'aire_libre', 'turistico', 0, 'Copiapó', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', st_makepoint(-70.3333, -27.3667)::geography, true),

-- COQUIMBO
('La Serena', 'Ciudad colonial, iglesias y playa Avenida del Mar.', 'cultura', 'turistico', 1, 'La Serena', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', st_makepoint(-71.2528, -29.9078)::geography, true),
('Valle del Elqui', 'Cuna del pisco, observatorios y Gabriela Mistral.', 'gastronomia', 'turistico', 1, 'Pisco Elqui', 'https://images.unsplash.com/photo-1470162656305-6f429ba817bf?w=800', st_makepoint(-70.4833, -30.1333)::geography, true),
('Observatorio Mamalluca', 'Astronomía turística con telescopios.', 'cultura', 'turistico', 2, 'Vicuña', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', st_makepoint(-70.7333, -29.9833)::geography, true),
('Parque Fray Jorge', 'Bosque nativo en medio del desierto, UNESCO.', 'aire_libre', 'turistico', 1, 'Ovalle', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800', st_makepoint(-71.6167, -30.6333)::geography, true),
('Tongoy', 'Balneario con playa larga y ostras.', 'familiar', 'turistico', 1, 'Tongoy', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', st_makepoint(-71.5000, -30.2667)::geography, true),

-- O'HIGGINS
('Santa Cruz', 'Corazón del valle de Colchagua, museo y ruta del vino.', 'gastronomia', 'turistico', 2, 'Santa Cruz', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', st_makepoint(-71.3667, -34.6333)::geography, true),
('Pichilemu', 'Capital del surf en Chile, Punta de Lobos.', 'deporte', 'turistico', 1, 'Pichilemu', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800', st_makepoint(-72.0000, -34.3833)::geography, true),
('Termas del Flaco', 'Termas cordilleranas con camping.', 'aire_libre', 'turistico', 1, 'San Fernando', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', st_makepoint(-70.5000, -34.9500)::geography, true),
('Museo del Huaso Colchagua', 'Colección histórica rural chilena.', 'cultura', 'turistico', 1, 'Santa Cruz', 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800', st_makepoint(-71.3683, -34.6386)::geography, true),

-- ÑUBLE
('Termas de Chillán', 'Centro de ski y termas naturales.', 'aire_libre', 'turistico', 3, 'Pinto', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', st_makepoint(-71.4167, -36.9000)::geography, true),
('Chillán Viejo', 'Casa de Bernardo O''Higgins, historia patria.', 'cultura', 'turistico', 0, 'Chillán', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', st_makepoint(-72.1031, -36.6063)::geography, true),
('Cobquecura', 'Lobos marinos, Iglesia de Piedra.', 'aire_libre', 'turistico', 0, 'Cobquecura', 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800', st_makepoint(-72.7833, -36.1333)::geography, true),
('Mercado de Chillán', 'Mercado costumbrista, longaniza y charqui.', 'gastronomia', 'turistico', 1, 'Chillán', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', st_makepoint(-72.1050, -36.6100)::geography, true),

-- BIOBÍO
('Concepción Centro', 'Universidad, plaza de armas y Galería Historia.', 'cultura', 'turistico', 0, 'Concepción', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', st_makepoint(-73.0444, -36.8201)::geography, true),
('Salto del Laja', 'Cascadas famosas junto a la Ruta 5.', 'aire_libre', 'turistico', 1, 'Los Ángeles', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', st_makepoint(-72.4333, -37.2667)::geography, true),
('Lota', 'Parque Cousiño y minas históricas.', 'cultura', 'turistico', 1, 'Lota', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800', st_makepoint(-73.1600, -37.0900)::geography, true),
('Dichato', 'Balneario con playa amplia.', 'familiar', 'turistico', 0, 'Tomé', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', st_makepoint(-72.9500, -36.5500)::geography, true),
('Parque Nacional Nahuelbuta', 'Araucarias milenarias y vistas al Pacífico.', 'aire_libre', 'turistico', 1, 'Angol', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800', st_makepoint(-73.0000, -37.8167)::geography, true),

-- ARAUCANÍA
('Pucón', 'Volcán Villarrica, lago y aguas termales.', 'aire_libre', 'turistico', 2, 'Pucón', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', st_makepoint(-71.9796, -39.2714)::geography, true),
('Parque Nacional Villarrica', 'Ascenso al volcán y bosques de coihue.', 'aire_libre', 'turistico', 2, 'Pucón', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', st_makepoint(-71.9400, -39.4167)::geography, true),
('Villarrica', 'Ciudad a orillas del lago, Mercado Fritz.', 'cultura', 'turistico', 1, 'Villarrica', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', st_makepoint(-72.2167, -39.2833)::geography, true),
('Parque Nacional Conguillío', 'Araucarias, lago verde y volcán Llaima.', 'aire_libre', 'turistico', 1, 'Curacautín', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800', st_makepoint(-71.6500, -38.6833)::geography, true),
('Temuco Mercado Municipal', 'Gastronomía mapuche y artesanía.', 'gastronomia', 'turistico', 1, 'Temuco', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', st_makepoint(-72.5904, -38.7359)::geography, true),

-- LOS RÍOS
('Valdivia', 'Ciudad fluvial, Mercado Fluvial y cervecerías.', 'gastronomia', 'turistico', 1, 'Valdivia', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', st_makepoint(-73.2459, -39.8142)::geography, true),
('Niebla y Corral', 'Fuertes españoles, navegación por río Valdivia.', 'cultura', 'turistico', 1, 'Valdivia', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800', st_makepoint(-73.3833, -39.8667)::geography, true),
('Parque Nacional Alerce Costero', 'Alerces milenarios patrimonio UNESCO.', 'aire_libre', 'turistico', 1, 'La Unión', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800', st_makepoint(-73.4833, -40.1833)::geography, true),
('Saltos del Huilo Huilo', 'Reserva privada con cascadas y hoteles únicos.', 'aire_libre', 'turistico', 2, 'Panguipulli', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', st_makepoint(-71.9167, -39.8667)::geography, true),

-- AYSÉN
('Coyhaique', 'Capital regional, portal a la Patagonia.', 'cultura', 'turistico', 1, 'Coyhaique', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', st_makepoint(-72.0685, -45.5712)::geography, true),
('Capillas de Mármol', 'Cuevas talladas por el agua en Lago General Carrera.', 'aire_libre', 'turistico', 2, 'Puerto Río Tranquilo', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800', st_makepoint(-72.6833, -46.6333)::geography, true),
('Parque Nacional Queulat', 'Ventisquero Colgante, bosque valdiviano.', 'aire_libre', 'turistico', 1, 'Puyuhuapi', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800', st_makepoint(-72.5167, -44.4667)::geography, true),
('Carretera Austral', 'Ruta escénica 1240 km de glaciares y fiordos.', 'aire_libre', 'turistico', 2, 'Aysén', 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800', st_makepoint(-72.4000, -45.7000)::geography, true),

-- MAGALLANES
('Torres del Paine', 'Parque Nacional estrella, trekking W y circuito O.', 'aire_libre', 'turistico', 3, 'Puerto Natales', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800', st_makepoint(-72.9833, -51.0000)::geography, true),
('Punta Arenas', 'Ciudad más austral continental, Cementerio Municipal.', 'cultura', 'turistico', 1, 'Punta Arenas', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', st_makepoint(-70.9171, -53.1638)::geography, true),
('Puerto Natales', 'Portal a Torres del Paine, costanera y glacier bar.', 'gastronomia', 'turistico', 2, 'Puerto Natales', 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800', st_makepoint(-72.5100, -51.7236)::geography, true),
('Isla Magdalena', 'Colonia de pingüinos magallánicos.', 'aire_libre', 'turistico', 2, 'Punta Arenas', 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800', st_makepoint(-70.5667, -52.9333)::geography, true),
('Cabo Froward', 'Punta más austral del continente sudamericano.', 'aire_libre', 'turistico', 2, 'Punta Arenas', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', st_makepoint(-71.2667, -53.9000)::geography, true);

-- ============================================================
-- PANORAMAS PRÓXIMOS POR REGIÓN (eventos con fecha)
-- ============================================================

insert into lugares (nombre, descripcion, categoria, tipo, precio_nivel, direccion, imagen_url, location, fecha_inicio, fecha_fin, moderado) values

-- Norte
('Carnaval Andino Con la Fuerza del Sol — Arica', 'Desfile de comparsas andinas, baile y caporales.', 'cultura', 'panorama', 0, 'Arica', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', st_makepoint(-70.3126, -18.4783)::geography, now() + interval '15 days', now() + interval '17 days', true),
('Festival de la Tirana', 'Baile religioso andino, diablada y morenadas.', 'cultura', 'panorama', 0, 'La Tirana, Tarapacá', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', st_makepoint(-69.5444, -20.2631)::geography, now() + interval '8 days', now() + interval '10 days', true),
('Atardecer en Valle de la Luna — Tour', 'Tour guiado atardecer + pisco sour en miradores.', 'aire_libre', 'panorama', 2, 'San Pedro de Atacama', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', st_makepoint(-68.2833, -22.9333)::geography, now() + interval '3 days', now() + interval '3 days' + interval '4 hours', true),
('Carnaval de Flores — Copiapó', 'Festival del desierto florido con música y gastronomía.', 'familiar', 'panorama', 0, 'Copiapó', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800', st_makepoint(-70.3333, -27.3667)::geography, now() + interval '22 days', now() + interval '24 days', true),
('Noche de Observación Astronómica', 'Telescopios abiertos al público con astrónomo guía.', 'cultura', 'panorama', 2, 'Vicuña, Coquimbo', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', st_makepoint(-70.7333, -29.9833)::geography, now() + interval '5 days', now() + interval '5 days' + interval '4 hours', true),

-- Centro
('Festival del Huaso de Olmué', 'Música, cueca y gastronomía tradicional chilena.', 'cultura', 'panorama', 1, 'Olmué, Valparaíso', 'https://images.unsplash.com/photo-1553532435-93d532a0fcde?w=800', st_makepoint(-71.1833, -33.0000)::geography, now() + interval '12 days', now() + interval '14 days', true),
('Año Nuevo en el Mar — Valparaíso', 'Fuegos artificiales costanera, el más grande de Chile.', 'nocturno', 'panorama', 0, 'Valparaíso', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', st_makepoint(-71.6127, -33.0472)::geography, now() + interval '40 days', now() + interval '41 days', true),
('Fiesta de la Vendimia — Santa Cruz', 'Pisado de uva, comida típica y música del valle.', 'gastronomia', 'panorama', 1, 'Santa Cruz', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', st_makepoint(-71.3667, -34.6333)::geography, now() + interval '6 days', now() + interval '8 days', true),
('Maratón Pichilemu', 'Carrera costera 10k/21k/42k.', 'deporte', 'panorama', 1, 'Pichilemu', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800', st_makepoint(-72.0000, -34.3833)::geography, now() + interval '28 days', now() + interval '28 days' + interval '6 hours', true),

-- Sur
('Feria Costumbrista Chillán', 'Longaniza, chicha y cueca en el mercado típico.', 'gastronomia', 'panorama', 0, 'Chillán', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', st_makepoint(-72.1031, -36.6063)::geography, now() + interval '9 days', now() + interval '11 days', true),
('Lollapalooza Concepción', 'Festival musical 3 días con artistas internacionales.', 'nocturno', 'panorama', 3, 'Concepción', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', st_makepoint(-73.0444, -36.8201)::geography, now() + interval '35 days', now() + interval '38 days', true),
('Festival We Tripantu — Temuco', 'Año nuevo mapuche con ceremonia y gastronomía.', 'cultura', 'panorama', 0, 'Temuco', 'https://images.unsplash.com/photo-1553532435-93d532a0fcde?w=800', st_makepoint(-72.5904, -38.7359)::geography, now() + interval '18 days', now() + interval '19 days', true),
('Bierfest Valdivia', 'Cerveza artesanal, salchichas y kuchen.', 'gastronomia', 'panorama', 1, 'Valdivia', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', st_makepoint(-73.2459, -39.8142)::geography, now() + interval '16 days', now() + interval '18 days', true),
('Trekking guiado Volcán Osorno', 'Ascenso al refugio con guía UIAGM.', 'deporte', 'panorama', 3, 'Puerto Varas', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', st_makepoint(-72.4933, -41.1000)::geography, now() + interval '11 days', now() + interval '11 days' + interval '10 hours', true),

-- Extremo sur
('Navegación Capillas de Mármol', 'Tour en kayak por cuevas de mármol.', 'aire_libre', 'panorama', 3, 'Río Tranquilo, Aysén', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800', st_makepoint(-72.6833, -46.6333)::geography, now() + interval '20 days', now() + interval '20 days' + interval '6 hours', true),
('Torres del Paine Full Day', 'Base de las Torres con guía, ida y vuelta.', 'aire_libre', 'panorama', 3, 'Puerto Natales', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800', st_makepoint(-72.9833, -51.0000)::geography, now() + interval '25 days', now() + interval '25 days' + interval '12 hours', true),
('Fiesta de la Patagonia — Punta Arenas', 'Gastronomía patagónica, cordero al palo, música local.', 'familiar', 'panorama', 1, 'Punta Arenas', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', st_makepoint(-70.9171, -53.1638)::geography, now() + interval '32 days', now() + interval '34 days', true);
