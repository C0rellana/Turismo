import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SANTIAGO_DEFAULT } from '@/constants/categories';
import type { UbicacionActual } from '@/lib/types';

type Estado = 'idle' | 'pidiendo' | 'concedido' | 'denegado' | 'error';

type LocationState = {
  gps: UbicacionActual | null;
  custom: (UbicacionActual & { label?: string }) | null;
  estado: Estado;
  ubicacion: UbicacionActual | null; // resuelta: custom > gps
  solicitar: () => Promise<UbicacionActual>;
  usarDefault: () => void;
  setCustom: (lat: number, lng: number, label?: string) => void;
  limpiarCustom: () => void;
};

function resolver(
  gps: UbicacionActual | null,
  custom: (UbicacionActual & { label?: string }) | null,
): UbicacionActual | null {
  if (custom) return { lat: custom.lat, lng: custom.lng, esDefault: false };
  return gps;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      gps: null,
      custom: null,
      estado: 'idle',
      ubicacion: null,

      solicitar: async () => {
        set({ estado: 'pidiendo' });
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            const gps = { ...SANTIAGO_DEFAULT, esDefault: true };
            set({ gps, estado: 'denegado', ubicacion: resolver(gps, get().custom) });
            return gps;
          }
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const gps = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            esDefault: false,
          };
          set({ gps, estado: 'concedido', ubicacion: resolver(gps, get().custom) });
          return gps;
        } catch {
          const gps = { ...SANTIAGO_DEFAULT, esDefault: true };
          set({ gps, estado: 'error', ubicacion: resolver(gps, get().custom) });
          return gps;
        }
      },

      usarDefault: () => {
        const gps = { ...SANTIAGO_DEFAULT, esDefault: true };
        set({ gps, estado: 'denegado', ubicacion: resolver(gps, get().custom) });
      },

      setCustom: (lat, lng, label) => {
        const custom = { lat, lng, esDefault: false, label };
        set({ custom, ubicacion: resolver(get().gps, custom) });
      },

      limpiarCustom: () => {
        set({ custom: null, ubicacion: resolver(get().gps, null) });
      },
    }),
    {
      name: 'location-state',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s: LocationState) => ({ custom: s.custom }),
      onRehydrateStorage: () => (state: LocationState | undefined) => {
        // Tras rehydrate, recalcular ubicación resuelta
        if (state) {
          const ubicacion = resolver(state.gps, state.custom);
          if (ubicacion) state.ubicacion = ubicacion;
        }
      },
    } as any,
  ),
);
