import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CategoryChip } from '@/components/CategoryChip';
import { CATEGORIAS } from '@/constants/categories';
import { formatPrecio } from '@/lib/distance';
import { useFiltersStore } from '@/stores/useFiltersStore';

const RADIOS = [5, 10, 25, 50, 200, 2000, 20000];
const PRECIOS: (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];

export default function Filters() {
  const router = useRouter();
  const { categorias, radioKm, precioMax, toggleCategoria, setRadio, setPrecioMax, reset } =
    useFiltersStore();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.seccion}>Categorías</Text>
        <View style={styles.chips}>
          {CATEGORIAS.map((c) => (
            <CategoryChip
              key={c.id}
              categoria={c}
              activa={categorias.includes(c.id)}
              onPress={() => toggleCategoria(c.id)}
            />
          ))}
        </View>

        <Text style={styles.seccion}>Radio de búsqueda</Text>
        <View style={styles.chips}>
          {RADIOS.map((km) => (
            <Pressable
              key={km}
              onPress={() => setRadio(km)}
              style={[styles.radioChip, radioKm === km && styles.radioChipActivo]}
            >
              <Text style={[styles.radioTxt, radioKm === km && styles.radioTxtActivo]}>
                {km >= 20000 ? 'Sin límite' : km >= 2000 ? 'Todo Chile' : `${km} km`}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.seccion}>Precio máximo</Text>
        <View style={styles.chips}>
          {PRECIOS.map((p) => (
            <Pressable
              key={p}
              onPress={() => setPrecioMax(p)}
              style={[styles.radioChip, precioMax === p && styles.radioChipActivo]}
            >
              <Text style={[styles.radioTxt, precioMax === p && styles.radioTxtActivo]}>
                {formatPrecio(p)}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={reset} style={styles.btnReset}>
          <Ionicons name="refresh" size={16} color="#666" />
          <Text style={styles.btnResetTxt}>Reiniciar</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.btnAplicar}>
          <Text style={styles.btnAplicarTxt}>Aplicar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  scroll: { padding: 16, gap: 8 },
  seccion: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  radioChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  radioChipActivo: { backgroundColor: '#111', borderColor: '#111' },
  radioTxt: { fontSize: 13, color: '#333', fontWeight: '500' },
  radioTxtActivo: { color: '#fff' },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  btnReset: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  btnResetTxt: { color: '#666', fontWeight: '600' },
  btnAplicar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  btnAplicarTxt: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
