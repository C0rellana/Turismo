import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIAS } from '@/constants/categories';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export default function Intereses() {
  const router = useRouter();
  const intereses = useOnboardingStore((s) => s.intereses);
  const toggle = useOnboardingStore((s) => s.toggleInteres);

  const continuar = () => router.push('/(onboarding)/radio' as any);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.paso}>Paso 1 de 3</Text>
        <Text style={styles.titulo}>¿Qué te interesa?</Text>
        <Text style={styles.subtitulo}>
          Elige una o más categorías. Usamos esto para pre-filtrar tus panoramas.
        </Text>

        <View style={styles.grid}>
          {CATEGORIAS.map((cat) => {
            const activo = intereses.includes(cat.id);
            return (
              <Pressable
                key={cat.id}
                onPress={() => toggle(cat.id)}
                style={[styles.chip, activo && { borderColor: cat.color, backgroundColor: cat.color + '15' }]}>
                <View style={[styles.chipIcon, { backgroundColor: cat.color }]}>
                  <Ionicons name={cat.icono as any} size={22} color="#fff" />
                </View>
                <Text style={[styles.chipLabel, activo && { color: cat.color, fontWeight: '700' }]}>
                  {cat.nombre}
                </Text>
                {activo && <Ionicons name="checkmark-circle" size={18} color={cat.color} />}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={continuar} style={styles.btnPrimario}>
          <Text style={styles.btnPrimarioTxt}>
            {intereses.length > 0 ? 'Siguiente' : 'Omitir'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 24 },
  paso: { color: '#888', fontSize: 13, marginBottom: 4 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 8 },
  subtitulo: { color: '#666', fontSize: 15, lineHeight: 22, marginBottom: 24 },
  grid: { gap: 12 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  chipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipLabel: { flex: 1, fontSize: 16, color: '#222' },
  footer: { padding: 24, paddingTop: 8 },
  btnPrimario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 14,
  },
  btnPrimarioTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
