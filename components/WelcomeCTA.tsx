import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const BENEFICIOS = [
  { icon: 'options', txt: 'Personaliza tu feed' },
  { icon: 'notifications', txt: 'Notificaciones de panoramas cerca' },
  { icon: 'sync', txt: 'Favoritos entre dispositivos' },
  { icon: 'mail-open', txt: 'Invitaciones exclusivas' },
];

export function WelcomeCTA({ compacto = false }: { compacto?: boolean }) {
  const router = useRouter();

  return (
    <View style={[styles.box, compacto && styles.compacto]}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={20} color="#E94F37" />
        <Text style={styles.titulo}>Inicia sesión para desbloquear</Text>
      </View>
      {!compacto && (
        <View style={styles.lista}>
          {BENEFICIOS.map((b) => (
            <View key={b.txt} style={styles.item}>
              <Ionicons name={b.icon as any} size={14} color="#666" />
              <Text style={styles.itemTxt}>{b.txt}</Text>
            </View>
          ))}
        </View>
      )}
      <Pressable style={styles.btn} onPress={() => router.push('/auth/login' as any)}>
        <Ionicons name="logo-google" size={16} color="#fff" />
        <Text style={styles.btnTxt}>Continuar con Google</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff8f6',
    borderWidth: 1,
    borderColor: '#ffe0d7',
    gap: 12,
  },
  compacto: { padding: 12, gap: 8 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titulo: { fontSize: 15, fontWeight: '800', color: '#111' },
  lista: { gap: 6 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemTxt: { fontSize: 13, color: '#444' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111',
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
