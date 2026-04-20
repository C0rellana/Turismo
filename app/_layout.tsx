import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStoreHidratado } from '@/stores/useOnboardingStore';

export default function RootLayout() {
  const hidratado = useStoreHidratado();

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
        </Stack>
      ) : (
        <View style={{ flex: 1 }} />
      )}
    </GestureHandlerRootView>
  );
}
