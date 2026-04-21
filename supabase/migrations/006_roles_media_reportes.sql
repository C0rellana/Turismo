-- 006_roles_media_reportes.sql
-- Roles de usuario + tabla reportes + multi-media (video soporte).

-- ============================================================
-- 1. Roles de usuario (enum + tabla user_roles)
-- ============================================================

do $$ begin
  create type user_role as enum ('visitor', 'registered', 'verified', 'moderator', 'admin');
exception when duplicate_object then null; end $$;

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'registered',
  verificado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

drop policy if exists "profiles_read_own" on public.user_profiles;
drop policy if exists "profiles_read_public" on public.user_profiles;
drop policy if exists "profiles_insert_own" on public.user_profiles;
drop policy if exists "profiles_update_own" on public.user_profiles;
drop policy if exists "profiles_admin_all" on public.user_profiles;

create policy "profiles_read_public" on public.user_profiles
  for select using (true);

create policy "profiles_insert_own" on public.user_profiles
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "profiles_update_own" on public.user_profiles
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and role = 'registered'); -- user no puede auto-escalar rol

-- Trigger: al crear user en auth.users, crear profile
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (user_id, role)
  values (new.id, 'registered')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: saber si user es admin/moderator
create or replace function public.es_admin(uid uuid) returns boolean
language sql stable security invoker as $$
  select exists(
    select 1 from public.user_profiles
    where user_id = uid and role in ('admin', 'moderator')
  );
$$;

create or replace function public.es_verificado(uid uuid) returns boolean
language sql stable security invoker as $$
  select exists(
    select 1 from public.user_profiles
    where user_id = uid and (role in ('verified', 'moderator', 'admin') or verificado = true)
  );
$$;

-- ============================================================
-- 2. Auto-aprobar lugares de usuarios verificados
-- ============================================================

create or replace function public.auto_aprobar_lugar()
returns trigger language plpgsql security definer as $$
begin
  if new.creado_por is not null and public.es_verificado(new.creado_por) then
    new.moderado := true;
  end if;
  return new;
end;
$$;

drop trigger if exists lugares_auto_aprobar on public.lugares;
create trigger lugares_auto_aprobar
  before insert on public.lugares
  for each row execute function public.auto_aprobar_lugar();

-- RLS lugares: admin/moderator pueden todo
drop policy if exists "lugares_admin_all" on public.lugares;
create policy "lugares_admin_all" on public.lugares
  for all to authenticated
  using (public.es_admin(auth.uid()))
  with check (public.es_admin(auth.uid()));

-- ============================================================
-- 3. Multi-media: videos soporte
-- ============================================================

do $$ begin
  create type media_tipo as enum ('image', 'video');
exception when duplicate_object then null; end $$;

alter table public.lugar_imagenes
  add column if not exists tipo media_tipo not null default 'image',
  add column if not exists thumbnail_url text,
  add column if not exists duracion_s int;

alter table public.lugares
  add column if not exists portada_tipo media_tipo not null default 'image',
  add column if not exists portada_thumbnail text;

-- ============================================================
-- 4. Tabla reportes
-- ============================================================

do $$ begin
  create type reporte_tipo as enum ('lugar', 'review', 'usuario');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reporte_estado as enum ('pendiente', 'revisado', 'desestimado', 'aceptado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type reporte_motivo as enum (
    'contenido_inapropiado',
    'info_incorrecta',
    'spam',
    'duplicado',
    'lugar_cerrado',
    'violencia_odio',
    'otro'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.reportes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_tipo reporte_tipo not null,
  target_id uuid not null,
  motivo reporte_motivo not null,
  descripcion text,
  estado reporte_estado not null default 'pendiente',
  resuelto_por uuid references auth.users(id) on delete set null,
  resuelto_en timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists reportes_target_idx on public.reportes(target_tipo, target_id);
create index if not exists reportes_estado_idx on public.reportes(estado);
create index if not exists reportes_user_idx on public.reportes(user_id);

alter table public.reportes enable row level security;

drop policy if exists "reportes_insert_auth" on public.reportes;
drop policy if exists "reportes_read_own" on public.reportes;
drop policy if exists "reportes_admin_all" on public.reportes;

create policy "reportes_insert_auth" on public.reportes
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "reportes_read_own" on public.reportes
  for select to authenticated
  using (user_id = auth.uid());

create policy "reportes_admin_all" on public.reportes
  for all to authenticated
  using (public.es_admin(auth.uid()))
  with check (public.es_admin(auth.uid()));

-- ============================================================
-- 5. RPC: contar reportes pendientes (para badge admin)
-- ============================================================

create or replace function public.reportes_pendientes_count()
returns bigint language sql stable security invoker as $$
  select count(*) from public.reportes where estado = 'pendiente';
$$;

-- ============================================================
-- 6. Permitir upload de videos al bucket
-- ============================================================
-- NOTA: En Supabase Dashboard → Storage → bucket 'panoramas-imagenes':
-- permitir tipos MIME: image/*, video/mp4, video/webm, video/quicktime
