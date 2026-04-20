import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Perfil() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const onLogin = () => router.push('/auth/login' as any);
  const onPublicar = () => {
    if (!user) {
      router.push({ pathname: '/auth/login' as any, params: { redirect: '/crear-panorama' } });
    } else {
      router.push('/crear-panorama' as any);
    }
  };

  const confirmarSalir = () =>
    Alert.alert('Cerrar sesión', '¿Seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => signOut() },
    ]);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.heroGuest}>
            <View style={styles.iconCircle}>
              <Ionicons name="person" size={48} color="#fff" />
            </View>
            <Text style={styles.titulo}>Tu perfil te espera</Text>
            <Text style={styles.subtitulo}>
              Iniciá sesión para publicar panoramas y sincronizar tus favoritos.
            </Text>
            <Pressable style={styles.btnPrimario} onPress={onLogin}>
              <Ionicons name="logo-google" size={18} color="#fff" />
              <Text style={styles.btnPrimarioTxt}>Iniciar sesión con Google</Text>
            </Pressable>
          </View>

          <Pressable style={styles.ctaPublicar} onPress={onPublicar}>
            <View style={styles.ctaIcon}>
              <Ionicons name="add-circle" size={28} color="#E94F37" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ctaTitulo}>¿Querés publicar un panorama?</Text>
              <Text style={styles.ctaDesc}>
                Compartí tu lugar favorito con la comunidad.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#bbb" />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const displayName =
    (user.user_metadata?.full_name as string) ??
    (user.user_metadata?.name as string) ??
    user.email ??
    'Usuario';
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.userHeader}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <Pressable style={styles.menuItem} onPress={onPublicar}>
            <Ionicons name="add-circle" size={22} color="#E94F37" />
            <Text style={styles.menuLabel}>Publicar panorama</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/favorites' as any)}>
            <Ionicons name="heart" size={22} color="#E94F37" />
            <Text style={styles.menuLabel}>Mis favoritos</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={confirmarSalir}>
            <Ionicons name="log-out" size={22} color="#666" />
            <Text style={styles.menuLabel}>Cerrar sesión</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20, gap: 16 },
  heroGuest: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E94F37',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  titulo: { fontSize: 24, fontWeight: '800', color: '#111', textAlign: 'center' },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
  },
  btnPrimario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#111',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
  },
  btnPrimarioTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  ctaPublicar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  ctaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF0EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaTitulo: { fontSize: 15, fontWeight: '700', color: '#111' },
  ctaDesc: { fontSize: 13, color: '#666', marginTop: 2 },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 16,
  },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarFallback: {
    backgroundColor: '#E94F37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: { fontSize: 18, fontWeight: '800', color: '#111' },
  userEmail: { fontSize: 13, color: '#666', marginTop: 2 },
  menu: { gap: 8, marginTop: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  menuLabel: { flex: 1, fontSize: 15, color: '#222', fontWeight: '500' },
});
