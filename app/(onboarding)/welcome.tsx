import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocationStore } from '@/stores/useLocationStore';

export default function Welcome() {
  const router = useRouter();
  const solicitar = useLocationStore((s) => s.solicitar);
  const usarDefault = useLocationStore((s) => s.usarDefault);
  const [cargando, setCargando] = useState(false);

  const onPermitir = async () => {
    setCargando(true);
    await solicitar();
    router.push('/(onboarding)/intereses' as any);
  };

  const onSaltar = () => {
    usarDefault();
    router.push('/(onboarding)/intereses' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Ionicons name="location" size={48} color="#fff" />
        </View>
        <Text style={styles.titulo}>Panoramas cerca tuyo</Text>
        <Text style={styles.subtitulo}>
          Descubrí qué hacer alrededor: gastronomía, cultura, aire libre y más.
        </Text>
      </View>

      <View style={styles.acciones}>
        <Pressable onPress={onPermitir} style={styles.btnPrimario} disabled={cargando}>
          <Ionicons name="navigate" size={18} color="#fff" />
          <Text style={styles.btnPrimarioTxt}>
            {cargando ? 'Solicitando...' : 'Permitir ubicación'}
          </Text>
        </Pressable>
        <Pressable onPress={onSaltar} style={styles.btnSecundario}>
          <Text style={styles.btnSecundarioTxt}>Continuar sin ubicación</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'space-between' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#3A86FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { fontSize: 26, fontWeight: '700', color: '#111', textAlign: 'center' },
  subtitulo: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, paddingHorizontal: 12 },
  acciones: { gap: 12 },
  btnPrimario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnPrimarioTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnSecundario: { paddingVertical: 12, alignItems: 'center' },
  btnSecundarioTxt: { color: '#666', fontSize: 14 },
});
