import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

const OPCIONES = [
  { km: 5, label: '5 km', desc: 'Mi barrio' },
  { km: 10, label: '10 km', desc: 'Mi zona' },
  { km: 25, label: '25 km', desc: 'Mi ciudad' },
  { km: 50, label: '50 km', desc: 'Mi región' },
];

export default function Radio() {
  const router = useRouter();
  const radioKm = useOnboardingStore((s) => s.radioKm);
  const setRadio = useOnboardingStore((s) => s.setRadio);

  const continuar = () => router.push('/(onboarding)/compania' as any);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.paso}>Paso 2 de 3</Text>
        <Text style={styles.titulo}>¿Qué tan lejos?</Text>
        <Text style={styles.subtitulo}>
          Radio de búsqueda desde tu ubicación actual.
        </Text>

        <View style={styles.opciones}>
          {OPCIONES.map((op) => {
            const activo = radioKm === op.km;
            return (
              <Pressable
                key={op.km}
                onPress={() => setRadio(op.km)}
                style={[styles.opcion, activo && styles.opcionActiva]}>
                <View style={styles.opcionLeft}>
                  <Text style={[styles.opcionLabel, activo && styles.textoActivo]}>{op.label}</Text>
                  <Text style={styles.opcionDesc}>{op.desc}</Text>
                </View>
                {activo && <Ionicons name="checkmark-circle" size={22} color="#E94F37" />}
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
        <Pressable onPress={continuar} style={styles.btnPrimario}>
          <Text style={styles.btnPrimarioTxt}>Siguiente</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
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
  opciones: { gap: 12 },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#eee',
  },
  opcionActiva: { borderColor: '#E94F37', backgroundColor: '#FFF5F3' },
  opcionLeft: { flex: 1 },
  opcionLabel: { fontSize: 17, fontWeight: '600', color: '#222' },
  textoActivo: { color: '#E94F37' },
  opcionDesc: { fontSize: 13, color: '#888', marginTop: 2 },
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
  btnPrimarioTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
  },
  btnSecundarioTxt: { color: '#666', fontSize: 15 },
});
