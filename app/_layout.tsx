import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStoreHidratado } from '@/stores/useOnboardingStore';
import { useAuthStore } from '@/stores/useAuthStore';

export default function RootLayout() {
  const hidratado = useStoreHidratado();
  const initAuth = useAuthStore((s) => s.init);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      {hidratado ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="panorama/[id]" options={{ headerShown: true, title: '' }} />
          <Stack.Screen
            name="filters"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Filtros',
            }}
          />
          <Stack.Screen
            name="auth/login"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Iniciar sesión',
            }}
          />
          <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
          <Stack.Screen
            name="crear-panorama"
            options={{ headerShown: true, title: 'Publicar panorama' }}
          />
        </Stack>
      ) : (
        <View style={{ flex: 1 }} />
      )}
    </GestureHandlerRootView>
  );
}
