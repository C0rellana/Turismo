import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/constants/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  const isMobileWeb =
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    window.innerWidth < 900;

  // iPhone home indicator ~34px, Android gesture bar ~24-34px
  const bottomPad =
    Platform.OS === 'web'
      ? isMobileWeb
        ? 34
        : 10
      : Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 10,
          lineHeight: 13,
          marginTop: 0,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarStyle: {
          borderTopColor: colors.borderSoft,
          borderTopWidth: 1,
          backgroundColor: colors.surface,
          paddingBottom: bottomPad,
          paddingTop: 6,
          height: 58 + bottomPad,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="explorar"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => <Ionicons name="compass" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="panoramas"
        options={{
          title: 'Panoramas',
          tabBarIcon: ({ color, size }) => <Ionicons name="sparkles" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen name="favorites" options={{ href: null }} />
    </Tabs>
  );
}
