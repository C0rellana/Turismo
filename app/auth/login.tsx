import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { user, estado, error, signInWithGoogle } = useAuthStore();

  useEffect(() => {
    if (user) {
      if (redirect) router.replace(redirect as any);
      else if (router.canGoBack()) router.back();
      else router.replace('/(tabs)');
    }
  }, [user, redirect, router]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Ionicons name="compass" size={56} color="#E94F37" />
        </View>
        <Text style={styles.title}>Únete a la comunidad</Text>
        <Text style={styles.subtitle}>
          Inicia sesión para publicar panoramas y sincronizar tus favoritos entre dispositivos.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.googleBtn}
          onPress={signInWithGoogle}
          disabled={estado === 'cargando'}>
          {estado === 'cargando' ? (
            <ActivityIndicator color="#222" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#222" />
              <Text style={styles.googleBtnText}>Continuar con Google</Text>
            </>
          )}
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.fineprint}>
          Puedes seguir usando la app sin cuenta: verás panoramas y guardarlos como favoritos
          localmente.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#FFF0EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  actions: {
    paddingBottom: 24,
    gap: 12,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#222',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  googleBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  error: {
    color: '#E94F37',
    textAlign: 'center',
    fontSize: 13,
  },
  fineprint: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
});
