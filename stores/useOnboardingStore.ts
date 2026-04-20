import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CategoriaId } from '@/lib/types';

export type Compania = 'solo' | 'pareja' | 'familia' | 'amigos';

type OnboardingState = {
  completado: boolean;
  intereses: CategoriaId[];
  radioKm: number;
  compania: Compania | null;
  setIntereses: (c: CategoriaId[]) => void;
  toggleInteres: (c: CategoriaId) => void;
  setRadio: (km: number) => void;
  setCompania: (c: Compania) => void;
  completar: () => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      completado: false,
      intereses: [],
      radioKm: 25,
      compania: null,
      setIntereses: (intereses) => set({ intereses }),
      toggleInteres: (c) => {
        const { intereses } = get();
        set({
          intereses: intereses.includes(c)
            ? intereses.filter((x) => x !== c)
            : [...intereses, c],
        });
      },
      setRadio: (radioKm) => set({ radioKm }),
      setCompania: (compania) => set({ compania }),
      completar: () => set({ completado: true }),
      reset: () =>
        set({ completado: false, intereses: [], radioKm: 25, compania: null }),
    }),
    {
      name: 'onboarding-status',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function useStoreHidratado() {
  const [hidratado, setHidratado] = useState(useOnboardingStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useOnboardingStore.persist.onFinishHydration(() => setHidratado(true));
    setHidratado(useOnboardingStore.persist.hasHydrated());
    return () => {
      unsub();
    };
  }, []);

  return hidratado;
}
