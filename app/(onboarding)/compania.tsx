import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFiltersStore } from '@/stores/useFiltersStore';
import { type Compania, useOnboardingStore } from '@/stores/useOnboardingStore';

const OPCIONES: { id: Compania; label: string; icon: any; color: string }[] = [
  { id: 'solo', label: 'Solo/a', icon: 'person', color: '#3A86FF' },
  { id: 'pareja', label: 'En pareja', icon: 'heart', color: '#E94F37' },
  { id: 'familia', label: 'En familia', icon: 'people', color: '#FFB400' },
  { id: 'amigos', label: 'Con amigos', icon: 'happy', color: '#06A77D' },
];

export default function CompaniaScreen() {
  const router = useRouter();
  const compania = useOnboardingStore((s) => s.compania);
  const setCompania = useOnboardingStore((s) => s.setCompania);
  const completar = useOnboardingStore((s) => s.completar);
  const intereses = useOnboardingStore((s) => s.intereses);
  const radioKm = useOnboardingStore((s) => s.radioKm);
  const setCategoriasFilter = useFiltersStore((s) => s.setCategorias);
  const setRadioFilter = useFiltersStore((s) => s.setRadio);

  const finalizar = () => {
    setCategoriasFilter(intereses);
    setRadioFilter(radioKm);
    completar();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.paso}>Paso 3 de 3</Text>
        <Text style={styles.titulo}>¿Con quién vas?</Text>
        <Text style={styles.subtitulo}>
          Adaptamos las sugerencias según la compañía.
        </Text>

        <View style={styles.grid}>
          {OPCIONES.map((op) => {
            const activo = compania === op.id;
            return (
              <Pressable
                key={op.id}
                onPress={() => setCompania(op.id)}
                style={[
                  styles.card,
                  activo && { borderColor: op.color, backgroundColor: op.color + '15' },
                ]}>
                <View style={[styles.iconBox, { backgroundColor: op.color }]}>
                  <Ionicons name={op.icon} size={28} color="#fff" />
                </View>
                <Text style={[styles.cardLabel, activo && { color: op.color, fontWeight: '800' }]}>
                  {op.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable onPress={() => router.back()} style={styles.btnSecundario}>
          <Ionicons name="arrow-back" size={18} color="#666" />
          <Text style={styles.btnSecundarioTxt}>Atrás</Text>
        </Pressable>
        <Pressable
          onPress={finalizar}
          style={[styles.btnPrimario, !compania && styles.btnDisabled]}>
          <Text style={styles.btnPrimarioTxt}>¡Empecemos!</Text>
          <Ionicons name="checkmark" size={18} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24 },
  paso: { color: '#888', fontSize: 13, marginBottom: 4 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 8 },
  subtitulo: { color: '#666', fontSize: 15, lineHeight: 22, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '48%',
    borderWidth: 1.5,
    borderColor: '#eee',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: { fontSize: 15, color: '#222', fontWeight: '600' },
  footer: { padding: 24, paddingTop: 8, flexDirection: 'row', gap: 12 },
  btnPrimario: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 14,
  },
  btnDisabled: { opacity: 0.5 },
  btnPrimarioTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
  },
  btnSecundarioTxt: { color: '#666', fontSize: 15 },
});
