import * as Location from 'expo-location';
import { create } from 'zustand';
import { SANTIAGO_DEFAULT } from '@/constants/categories';
import type { UbicacionActual } from '@/lib/types';

type LocationState = {
  ubicacion: UbicacionActual | null;
  estado: 'idle' | 'pidiendo' | 'concedido' | 'denegado' | 'error';
  solicitar: () => Promise<UbicacionActual>;
  usarDefault: () => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  ubicacion: null,
  estado: 'idle',

  solicitar: async () => {
    set({ estado: 'pidiendo' });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const ubicacion = { ...SANTIAGO_DEFAULT, esDefault: true };
        set({ ubicacion, estado: 'denegado' });
        return ubicacion;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const ubicacion = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        esDefault: false,
      };
      set({ ubicacion, estado: 'concedido' });
      return ubicacion;
    } catch {
      const ubicacion = { ...SANTIAGO_DEFAULT, esDefault: true };
      set({ ubicacion, estado: 'error' });
      return ubicacion;
    }
  },

  usarDefault: () => {
    set({ ubicacion: { ...SANTIAGO_DEFAULT, esDefault: true }, estado: 'denegado' });
  },
}));
