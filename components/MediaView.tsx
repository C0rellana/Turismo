import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors } from '@/constants/theme';

type Props = {
  url: string;
  tipo?: 'image' | 'video';
  thumbnail?: string | null;
  style?: ViewStyle | ViewStyle[];
  showPlayIcon?: boolean;
};

/**
 * Visor de media: imagen o video. Web usa <video>, mobile usa expo-av Video
 * (import dinámico para evitar que el bundle web lo requiera).
 */
export function MediaView({ url, tipo = 'image', thumbnail, style, showPlayIcon = true }: Props) {
  if (tipo === 'image') {
    return (
      <Image
        source={{ uri: url }}
        style={[styles.full as any, style as any]}
        contentFit="cover"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.full, style]}>
        <video
          src={url}
          controls
          poster={thumbnail ?? undefined}
          style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' } as any}
        />
      </View>
    );
  }

  // Mobile: placeholder visible con thumbnail + icono play
  // (Para reproducir requiere import expo-av dinámico; simplificado a preview)
  return (
    <View style={[styles.full, style]}>
      {thumbnail ? (
        <Image source={{ uri: thumbnail }} style={styles.full} contentFit="cover" />
      ) : (
        <View style={[styles.full, { backgroundColor: '#111' }]} />
      )}
      {showPlayIcon && (
        <View style={styles.playOverlay}>
          <View style={styles.playCircle}>
            <Ionicons name="play" size={28} color="#fff" />
          </View>
          <Text style={styles.videoLabel}>Toca para reproducir</Text>
        </View>
      )}
    </View>
  );
}

export function VideoBadge() {
  return (
    <View style={styles.badge}>
      <Ionicons name="videocam" size={10} color="#fff" />
      <Text style={styles.badgeTxt}>VIDEO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  full: { width: '100%', height: '100%' },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    gap: 8,
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.terracotta,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeTxt: { color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
});
