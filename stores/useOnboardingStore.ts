import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type OnboardingState = {
  completado: boolean;
  completar: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completado: false,
      completar: () => set({ completado: true }),
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
