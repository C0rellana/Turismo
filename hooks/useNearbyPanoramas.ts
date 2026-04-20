import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Panorama } from '@/lib/types';
import { useFiltersStore } from '@/stores/useFiltersStore';
import { useLocationStore } from '@/stores/useLocationStore';

type Estado = 'idle' | 'cargando' | 'ok' | 'error';

export function useNearbyPanoramas() {
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const { categorias, radioKm, soloGratis, precioMin, precioMax, minRating } = useFiltersStore();

  const [panoramas, setPanoramas] = useState<Panorama[]>([]);
  const [estado, setEstado] = useState<Estado>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchPanoramas = useCallback(async () => {
    if (!ubicacion) return;
    setEstado('cargando');
    setError(null);
    try {
      const { data, error: err } = await supabase.rpc('panoramas_cerca', {
        lat: ubicacion.lat,
        lng: ubicacion.lng,
        radio_m: radioKm * 1000,
      });
      if (err) throw err;
      let lista = (data ?? []) as Panorama[];
      if (categorias.length) {
        lista = lista.filter((p) => categorias.includes(p.categoria));
      }
      if (soloGratis) {
        lista = lista.filter((p) => p.precio_nivel === 0);
      } else {
        lista = lista.filter((p) => p.precio_nivel >= precioMin && p.precio_nivel <= precioMax);
      }
      if (minRating > 0) {
        lista = lista.filter((p) => (p.rating_promedio ?? 0) >= minRating);
      }
      setPanoramas(lista);
      setEstado('ok');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
      setEstado('error');
    }
  }, [ubicacion, radioKm, categorias, soloGratis, precioMin, precioMax, minRating]);

  useEffect(() => {
    fetchPanoramas();
  }, [fetchPanoramas]);

  return { panoramas, estado, error, refetch: fetchPanoramas };
}
