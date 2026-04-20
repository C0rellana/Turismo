import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, type MapPressEvent } from 'react-native-maps';

type Props = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  color?: string;
};

export default function MiniMapaPicker({ lat, lng, onChange, color = '#E94F37' }: Props) {
  const onPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    onChange(latitude, longitude);
  };

  return (
    <View style={styles.box}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        onPress={onPress}>
        <Marker coordinate={{ latitude: lat, longitude: lng }} pinColor={color} />
      </MapView>
      <View style={styles.hint}>
        <Ionicons name="information-circle" size={14} color="#666" />
        <Text style={styles.hintTxt}>Tap en el mapa para ajustar el pin</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 8 },
  map: { height: 240, borderRadius: 12 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hintTxt: { fontSize: 12, color: '#666' },
});

export function PickerEmpty({ onUseCurrent }: { onUseCurrent: () => void }) {
  return (
    <Pressable onPress={onUseCurrent} style={styles2.empty}>
      <Ionicons name="location" size={24} color="#E94F37" />
      <Text style={styles2.emptyTxt}>Usar mi ubicación actual</Text>
    </Pressable>
  );
}

const styles2 = StyleSheet.create({
  empty: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  emptyTxt: { fontSize: 14, color: '#111', fontWeight: '600' },
});
