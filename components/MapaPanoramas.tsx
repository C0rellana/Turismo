import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { CATEGORIAS_MAP } from '@/constants/categories';
import type { Panorama, UbicacionActual } from '@/lib/types';

type Props = {
  ubicacion: UbicacionActual;
  panoramas: Panorama[];
  onSelect: (p: Panorama) => void;
  seleccionadoId?: string;
};

export function MapaPanoramas({ ubicacion, panoramas, onSelect, seleccionadoId }: Props) {
  const mapRef = useRef<MapView>(null);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_DEFAULT}
      style={styles.map}
      showsUserLocation={!ubicacion.esDefault}
      initialRegion={{
        latitude: ubicacion.lat,
        longitude: ubicacion.lng,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }}
    >
      {panoramas.map((p) => {
        const cat = CATEGORIAS_MAP[p.categoria];
        return (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            pinColor={cat.color}
            onPress={() => onSelect(p)}
            title={p.nombre}
            description={p.direccion ?? undefined}
          />
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
