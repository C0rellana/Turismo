import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Lugar, TipoLugar } from '@/lib/types';
import { useFiltersStore } from '@/stores/useFiltersStore';
import { useLocationStore } from '@/stores/useLocationStore';

type Estado = 'idle' | 'cargando' | 'ok' | 'error';

type Opts = {
  tipos?: TipoLugar[];
  q?: string;
  pageSize?: number;
};

export function useNearbyLugares(opts: Opts = {}) {
  const { tipos, q, pageSize = 50 } = opts;
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const { categorias, radioKm, soloGratis, precioMin, precioMax, minRating, tags } = useFiltersStore();

  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [estado, setEstado] = useState<Estado>('idle');
  const [error, setError] = useState<string | null>(null);
  const [hayMas, setHayMas] = useState(true);
  const offsetRef = useRef(0);

  const fetchPage = useCallback(
    async (reset: boolean) => {
      if (!ubicacion) return;
      if (reset) offsetRef.current = 0;
      setEstado('cargando');
      setError(null);
      try {
        const { data, error: err } = await supabase.rpc('lugares_cerca', {
          lat: ubicacion.lat,
          lng: ubicacion.lng,
          radio_m: radioKm * 1000,
          tipos: tipos && tipos.length > 0 ? tipos : null,
          q: q && q.trim() ? q.trim() : null,
          p_limit: pageSize,
          p_offset: offsetRef.current,
        });
        if (err) throw err;
        let lista = ((data ?? []) as Lugar[]);
        if (categorias.length) {
          lista = lista.filter((l) => categorias.includes(l.categoria));
        }
        if (soloGratis) {
          lista = lista.filter((l) => l.precio_nivel === 0);
        } else {
          lista = lista.filter((l) => l.precio_nivel >= precioMin && l.precio_nivel <= precioMax);
        }
        if (minRating > 0) {
          lista = lista.filter((l) => (l.rating_promedio ?? 0) >= minRating);
        }
        if (tags.length > 0) {
          lista = lista.filter((l) => tags.every((t) => (l.tags ?? []).includes(t)));
        }
        setLugares((prev) => (reset ? lista : [...prev, ...lista]));
        setHayMas(lista.length === pageSize);
        offsetRef.current += pageSize;
        setEstado('ok');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
        setEstado('error');
      }
    },
    [ubicacion, radioKm, categorias, soloGratis, precioMin, precioMax, minRating, tipos, q, pageSize, tags],
  );

  useEffect(() => {
    fetchPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ubicacion, radioKm, categorias.join(','), soloGratis, precioMin, precioMax, minRating, tipos?.join(','), q, tags.join(',')]);

  return {
    lugares,
    estado,
    error,
    hayMas,
    refetch: () => fetchPage(true),
    loadMore: () => fetchPage(false),
  };
}

/** Alias compatibilidad. Deprecated. */
export const useNearbyPanoramas = useNearbyLugares;
