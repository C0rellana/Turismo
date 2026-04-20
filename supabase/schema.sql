-- Panoramas Cerca - Schema
-- Ejecutar en Supabase SQL Editor una vez creado el proyecto.

create extension if not exists postgis;

create table if not exists panoramas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  categoria text not null check (categoria in
    ('gastronomia', 'aire_libre', 'cultura', 'nocturno', 'familiar', 'deporte')),
  precio_nivel smallint not null default 1 check (precio_nivel between 0 and 3),
  direccion text,
  location geography(point, 4326) not null,
  imagen_url text,
  created_at timestamptz default now()
);

create index if not exists panoramas_location_idx on panoramas using gist (location);
create index if not exists panoramas_categoria_idx on panoramas (categoria);

-- RPC: búsqueda por cercanía en metros, ordenada por distancia ascendente.
create or replace function panoramas_cerca(
  lat double precision,
  lng double precision,
  radio_m int default 10000
) returns table (
  id uuid,
  nombre text,
  descripcion text,
  categoria text,
  precio_nivel smallint,
  direccion text,
  imagen_url text,
  lat double precision,
  lng double precision,
  distancia_m double precision
) language sql stable as $$
  select
    p.id,
    p.nombre,
    p.descripcion,
    p.categoria,
    p.precio_nivel,
    p.direccion,
    p.imagen_url,
    st_y(p.location::geometry) as lat,
    st_x(p.location::geometry) as lng,
    st_distance(p.location, st_makepoint(lng, lat)::geography) as distancia_m
  from panoramas p
  where st_dwithin(p.location, st_makepoint(lng, lat)::geography, radio_m)
  order by p.location <-> st_makepoint(lng, lat)::geography;
$$;

-- RLS: lectura pública, escritura sólo service role.
alter table panoramas enable row level security;

drop policy if exists "panoramas_read_public" on panoramas;
create policy "panoramas_read_public" on panoramas
  for select using (true);
