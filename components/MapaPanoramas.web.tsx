import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import type { Panorama, UbicacionActual } from '@/lib/types';

type Props = {
  ubicacion: UbicacionActual;
  panoramas: Panorama[];
  onSelect: (p: Panorama) => void;
  seleccionadoId?: string;
};

export function MapaPanoramas(_: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="map-outline" size={48} color="#999" />
      <Text style={styles.title}>Mapa no disponible en web</Text>
      <Text style={styles.subtitle}>Usá la vista lista para explorar panoramas.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 12 },
  subtitle: { fontSize: 13, color: '#777', marginTop: 4, textAlign: 'center' },
});
