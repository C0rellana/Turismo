import { Ionicons } from '@expo/vector-icons';
import { Linking, Platform, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '@/constants/theme';

type Props = {
  titulo: string;
  descripcion?: string;
  url: string;
  imagen?: string;
};

/** Share a WhatsApp / Twitter / Facebook / Telegram / nativo / copy */
export function ShareButtons({ titulo, descripcion, url, imagen }: Props) {
  const texto = `${titulo}${descripcion ? ` — ${descripcion}` : ''}\n${url}`;

  const compartirWhatsApp = () => {
    const u = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    void Linking.openURL(u);
  };

  const compartirTwitter = () => {
    const u = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${titulo}${descripcion ? ` — ${descripcion}` : ''}`,
    )}&url=${encodeURIComponent(url)}`;
    void Linking.openURL(u);
  };

  const compartirFacebook = () => {
    const u = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(titulo)}`;
    void Linking.openURL(u);
  };

  const compartirTelegram = () => {
    const u = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(titulo)}`;
    void Linking.openURL(u);
  };

  const compartirInstagram = () => {
    // Instagram no acepta share URL directo en web. En mobile abre app si instalada.
    if (Platform.OS === 'web') {
      // Fallback: abrir Instagram web
      void Linking.openURL('https://www.instagram.com/');
    } else {
      // Deep link stories (sólo iOS con UUID, complejo). Fallback: sistema nativo.
      void Share.share({ message: texto, url });
    }
  };

  const compartirNativo = () => {
    void Share.share({ message: texto, url });
  };

  const copiarLink = async () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    } else {
      const Clipboard = await import('@react-native-async-storage/async-storage').catch(
        () => null,
      );
      // Fallback nativo: Share
      void Share.share({ message: url });
    }
  };

  const botones = [
    {
      id: 'whatsapp',
      icon: 'logo-whatsapp' as const,
      color: '#25D366',
      onPress: compartirWhatsApp,
    },
    { id: 'twitter', icon: 'logo-twitter' as const, color: '#1DA1F2', onPress: compartirTwitter },
    {
      id: 'facebook',
      icon: 'logo-facebook' as const,
      color: '#1877F2',
      onPress: compartirFacebook,
    },
    {
      id: 'instagram',
      icon: 'logo-instagram' as const,
      color: '#E4405F',
      onPress: compartirInstagram,
    },
    {
      id: 'telegram',
      icon: 'paper-plane' as const,
      color: '#0088CC',
      onPress: compartirTelegram,
    },
    { id: 'copy', icon: 'link' as const, color: colors.textMuted, onPress: copiarLink },
    { id: 'share', icon: 'share-outline' as const, color: colors.text, onPress: compartirNativo },
  ];

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Compartir</Text>
      <View style={styles.row}>
        {botones.map((b) => (
          <Pressable key={b.id} style={styles.btn} onPress={b.onPress}>
            <View style={[styles.iconBox, { backgroundColor: b.color + '18' }]}>
              <Ionicons name={b.icon} size={22} color={b.color} />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  btn: {},
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
