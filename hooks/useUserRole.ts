import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/lib/types';
import { useAuthStore } from '@/stores/useAuthStore';

type ProfileRow = { role: UserRole; verificado: boolean };

export function useUserRole() {
  const user = useAuthStore((s) => s.user);
  const [role, setRole] = useState<UserRole>('visitor');
  const [verificado, setVerificado] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!user) {
      setRole('visitor');
      setVerificado(false);
      return;
    }
    let cancelled = false;
    setCargando(true);
    (async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, verificado')
        .eq('user_id', user.id)
        .maybeSingle();
      if (cancelled) return;
      setCargando(false);
      if (error || !data) {
        setRole('registered');
        setVerificado(false);
        return;
      }
      const prof = data as ProfileRow;
      setRole(prof.role);
      setVerificado(prof.verificado);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const esAdmin = role === 'admin' || role === 'moderator';
  const esVerificado = verificado || role === 'verified' || esAdmin;
  const puedePublicarSinAprobacion = esVerificado;

  return { role, verificado, esAdmin, esVerificado, puedePublicarSinAprobacion, cargando };
}
