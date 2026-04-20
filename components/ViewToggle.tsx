import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  modo: 'mapa' | 'lista';
  onChange: (m: 'mapa' | 'lista') => void;
  disabledMapa?: boolean;
};

export function ViewToggle({ modo, onChange, disabledMapa }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => !disabledMapa && onChange('mapa')}
        style={[styles.btn, modo === 'mapa' && styles.btnActivo, disabledMapa && styles.btnDisabled]}
      >
        <Ionicons name="map" size={16} color={modo === 'mapa' ? '#fff' : '#333'} />
        <Text style={[styles.txt, modo === 'mapa' && styles.txtActivo]}>Mapa</Text>
      </Pressable>
      <Pressable
        onPress={() => onChange('lista')}
        style={[styles.btn, modo === 'lista' && styles.btnActivo]}
      >
        <Ionicons name="list" size={16} color={modo === 'lista' ? '#fff' : '#333'} />
        <Text style={[styles.txt, modo === 'lista' && styles.txtActivo]}>Lista</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 3,
    alignSelf: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  btnActivo: { backgroundColor: '#111' },
  btnDisabled: { opacity: 0.4 },
  txt: { fontSize: 13, fontWeight: '500', color: '#333' },
  txtActivo: { color: '#fff' },
});
