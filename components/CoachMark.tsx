import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  id: string;
  titulo: string;
  mensaje: string;
};

/**
 * A.3 — Coach-mark simple. Se muestra una sola vez por id (persistido).
 * Aparece arriba a la derecha con animación suave. Dismissible.
 */
export function CoachMark({ id, titulo, mensaje }: Props) {
  const [visible, setVisible] = useState(false);
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem(`coach:${id}`);
      if (!seen) {
        setVisible(true);
        setTimeout(() => {
          Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
        }, 600);
      }
    })();
  }, [id, opacity]);

  const dismiss = async () => {
    Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setVisible(false);
    });
    await AsyncStorage.setItem(`coach:${id}`, '1');
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.wrap, { opacity }]}>
      <Pressable onPress={dismiss} style={styles.inner}>
        <Ionicons name="bulb" size={20} color="#fff" />
        <Animated.View style={{ flex: 1 }}>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.mensaje}>{mensaje}</Text>
        </Animated.View>
        <Ionicons name="close" size={18} color="rgba(255,255,255,0.8)" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 12,
  },
  titulo: { color: '#fff', fontSize: 14, fontWeight: '700' },
  mensaje: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
});
