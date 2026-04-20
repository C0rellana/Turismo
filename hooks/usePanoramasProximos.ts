import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Lugar } from '@/lib/types';
import { useLocationStore } from '@/stores/useLocationStore';

export function usePanoramasProximos(dias = 30, limite = 20) {
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!ubicacion) return;
    let cancelado = false;
    (async () => {
      setCargando(true);
      const { data, error } = await supabase.rpc('panoramas_proximos', {
        lat: ubicacion.lat,
        lng: ubicacion.lng,
        radio_m: 100000,
        dias,
        p_limit: limite,
      });
      if (cancelado) return;
      if (error) console.warn('[proximos]', error.message);
      setLugares((data ?? []) as Lugar[]);
      setCargando(false);
    })();
    return () => {
      cancelado = true;
    };
  }, [ubicacion, dias, limite]);

  return { lugares, cargando };
}
