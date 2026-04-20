import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Lugar } from '@/lib/types';

/** C.16 — Más del mismo creador (si el lugar tiene creado_por) */
export function useLugaresCreador(lugarId: string, limite = 8) {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!lugarId) return;
    let cancelado = false;
    (async () => {
      setCargando(true);
      const { data: origen } = await supabase
        .from('lugares')
        .select('creado_por')
        .eq('id', lugarId)
        .maybeSingle();
      if (!origen?.creado_por) {
        if (!cancelado) {
          setLugares([]);
          setCargando(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from('lugares')
        .select('id, nombre, descripcion, categoria, tipo, precio_nivel, direccion, imagen_url, fecha_inicio, fecha_fin')
        .eq('creado_por', origen.creado_por)
        .eq('moderado', true)
        .neq('id', lugarId)
        .order('created_at', { ascending: false })
        .limit(limite);
      if (cancelado) return;
      if (error) console.warn('[creador]', error.message);
      setLugares(((data ?? []) as any[]).map((r) => ({ ...r, lat: 0, lng: 0 })) as Lugar[]);
      setCargando(false);
    })();
    return () => {
      cancelado = true;
    };
  }, [lugarId, limite]);

  return { lugares, cargando };
}
