import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Panorama } from '@/lib/types';
import { useFiltersStore } from '@/stores/useFiltersStore';
import { useLocationStore } from '@/stores/useLocationStore';

type Estado = 'idle' | 'cargando' | 'ok' | 'error';

export function useNearbyPanoramas() {
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const { categorias, radioKm, precioMax } = useFiltersStore();

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
      lista = lista.filter((p) => p.precio_nivel <= precioMax);
      setPanoramas(lista);
      setEstado('ok');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
      setEstado('error');
    }
  }, [ubicacion, radioKm, categorias, precioMax]);

  useEffect(() => {
    fetchPanoramas();
  }, [fetchPanoramas]);

  return { panoramas, estado, error, refetch: fetchPanoramas };
}
