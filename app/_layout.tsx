import {
  Fraunces_400Regular_Italic,
  Fraunces_700Bold,
  useFonts as useFraunces,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInter,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, TextInput, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/stores/useAuthStore';
import { useStoreHidratado } from '@/stores/useOnboardingStore';

export default function RootLayout() {
  const hidratado = useStoreHidratado();
  const initAuth = useAuthStore((s) => s.init);

  const [interReady] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [fraunReady] = useFraunces({ Fraunces_700Bold, Fraunces_400Regular_Italic });

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Apply default font family
  useEffect(() => {
    if (interReady) {
      const anyText = Text as any;
      const anyInput = TextInput as any;
      anyText.defaultProps = anyText.defaultProps || {};
      anyText.defaultProps.style = [{ fontFamily: 'Inter_400Regular' }, anyText.defaultProps.style];
      anyInput.defaultProps = anyInput.defaultProps || {};
      anyInput.defaultProps.style = [
        { fontFamily: 'Inter_400Regular' },
        anyInput.defaultProps.style,
      ];
    }
  }, [interReady]);

  const listo = hidratado && interReady && fraunReady;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      {listo ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lugar/[id]" options={{ headerShown: true, title: '' }} />
          <Stack.Screen
            name="filters"
            options={{ presentation: 'modal', headerShown: true, title: 'Filtros' }}
          />
          <Stack.Screen
            name="auth/login"
            options={{ presentation: 'modal', headerShown: true, title: 'Iniciar sesión' }}
          />
          <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
          <Stack.Screen name="crear-lugar" options={{ headerShown: true, title: 'Publicar' }} />
        </Stack>
      ) : (
        <View style={{ flex: 1 }} />
      )}
    </GestureHandlerRootView>
  );
}
