import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CoachMark } from '@/components/CoachMark';
import { FlagChile } from '@/components/FlagChile';
import { WelcomeCTA } from '@/components/WelcomeCTA';
import { ZonaPicker } from '@/components/ZonaPicker';
import { colors, fonts, radius, shadows, spacing } from '@/constants/theme';
import { getRegionByLatLng } from '@/lib/regiones-info';
import { TIPS_AMBIENTALES } from '@/lib/tips-ambientales';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLocationStore } from '@/stores/useLocationStore';

export default function Inicio() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width > 700;
  const user = useAuthStore((s) => s.user);
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const custom = useLocationStore((s) => s.custom);
  const setCustom = useLocationStore((s) => s.setCustom);
  const [zonaOpen, setZonaOpen] = useState(false);

  const region = useMemo(() => {
    const lat = ubicacion?.lat ?? -35.4264;
    const lng = ubicacion?.lng ?? -71.6554;
    return getRegionByLatLng(lat, lng);
  }, [ubicacion?.lat, ubicacion?.lng]);

  const saludo = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  })();

  const nombre =
    (user?.user_metadata?.full_name as string)?.split(' ')[0] ??
    (user?.user_metadata?.name as string)?.split(' ')[0] ??
    'viajero';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CoachMark
        id="inicio-welcome-v3"
        titulo="Bienvenido a Chile"
        mensaje="Descubre ciudades, imperdibles y tips de cada región. Cambiá la zona tocando la bandera."
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header app brand */}
        <View style={styles.brandRow}>
          <View style={styles.brandLeft}>
            <FlagChile size={20} />
            <Text style={styles.brandTxt}>
              Descubre <Text style={{ fontFamily: fonts.display }}>Chile</Text>
            </Text>
          </View>
          <Pressable onPress={() => setZonaOpen(true)} style={styles.zonaBtn}>
            <Ionicons name="location" size={13} color={colors.primaryDark} />
            <Text style={styles.zonaBtnTxt}>
              {custom?.label ??
                region.nombre.replace('Región de ', '').replace('Región del ', '')}
            </Text>
            <Ionicons name="chevron-down" size={13} color={colors.primaryDark} />
          </Pressable>
        </View>

        {/* Saludo */}
        <View style={styles.saludoBox}>
          <Text style={styles.saludoTxt}>
            {saludo}, <Text style={{ fontFamily: fonts.display }}>{nombre}</Text>
          </Text>
          <Text style={styles.saludoSub}>¿Listo para explorar?</Text>
        </View>

        {/* HERO región con imagen */}
        <View style={styles.heroRegion}>
          <Image source={{ uri: region.imagen_hero }} style={styles.heroImg} contentFit="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroKickerRow}>
              <FlagChile size={14} />
              <Text style={styles.heroKicker}>Estás explorando</Text>
            </View>
            <Text style={styles.heroTitulo}>{region.nombre}</Text>
            <Text style={styles.heroSub}>{region.subtitulo}</Text>
          </View>
        </View>

        {/* Descripción editorial */}
        <View style={styles.descBox}>
          <Text style={styles.descTxt}>{region.descripcion}</Text>
          <View style={styles.descCtas}>
            <Pressable
              style={styles.exploreMapBtn}
              onPress={() => router.push('/(tabs)/mapa' as any)}>
              <Ionicons name="map" size={14} color={colors.primary} />
              <Text style={styles.exploreMapTxt}>Ver mapa</Text>
            </Pressable>
            <Pressable style={styles.exploreMapBtn} onPress={() => setZonaOpen(true)}>
              <Ionicons name="earth" size={14} color={colors.primary} />
              <Text style={styles.exploreMapTxt}>Cambiar región</Text>
            </Pressable>
          </View>
        </View>

        {/* WelcomeCTA guest */}
        {!user && <WelcomeCTA />}

        {/* Ciudades destacadas */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Ciudades para visitar</Text>
          <Text style={styles.seccionSub}>Los puntos más reconocidos de la zona</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}>
          {region.ciudades.map((c) => (
            <Pressable
              key={c.nombre}
              style={styles.ciudadCard}
              onPress={() => {
                setCustom(c.lat, c.lng, c.nombre);
                router.push('/(tabs)/explorar' as any);
              }}>
              <Image source={{ uri: c.imagen_url }} style={styles.ciudadImg} contentFit="cover" />
              <View style={styles.ciudadOverlay} />
              <View style={styles.ciudadText}>
                <Text style={styles.ciudadNombre}>{c.nombre}</Text>
                <Text style={styles.ciudadDesc} numberOfLines={2}>
                  {c.descripcion}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Imperdibles */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Imperdibles de la región</Text>
          <Text style={styles.seccionSub}>Lo que no puedes dejar de ver</Text>
        </View>
        <View style={styles.imperdiblesList}>
          {region.imperdibles.map((imp, i) => (
            <View
              key={imp.titulo}
              style={[
                styles.imperdibleCard,
                { flexDirection: isWide ? 'row' : 'column' },
              ]}>
              <Image
                source={{ uri: imp.imagen_url }}
                style={[
                  styles.imperdibleImg,
                  {
                    width: (isWide ? 220 : '100%') as any,
                    height: isWide ? 170 : 180,
                  },
                ]}
                contentFit="cover"
              />
              <View style={styles.imperdibleBody}>
                <View style={styles.imperdibleRow}>
                  <View style={styles.numberPill}>
                    <Text style={styles.numberTxt}>{i + 1}</Text>
                  </View>
                  {imp.tag && (
                    <View style={styles.imperdibleTag}>
                      <Text style={styles.imperdibleTagTxt}>{imp.tag}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.imperdibleTitulo}>{imp.titulo}</Text>
                <Text style={styles.imperdibleDesc}>{imp.descripcion}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tips del viajero específicos región */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Tips locales</Text>
          <Text style={styles.seccionSub}>Consejos de la región</Text>
        </View>
        <View style={styles.tipsList}>
          {region.tips.map((tip) => (
            <View key={tip.titulo} style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Ionicons name={tip.icono as any} size={18} color={colors.accentDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitulo}>{tip.titulo}</Text>
                <Text style={styles.tipDesc}>{tip.descripcion}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Conciencia ambiental */}
        <View style={styles.ambientalSection}>
          <View style={styles.ambientalHeader}>
            <View style={styles.ambientalBadge}>
              <Ionicons name="leaf" size={14} color="#fff" />
              <Text style={styles.ambientalBadgeTxt}>Viaja con conciencia</Text>
            </View>
            <Text style={styles.ambientalTitulo}>Cuidemos nuestro Chile</Text>
            <Text style={styles.ambientalSub}>
              Pequeños gestos protegen nuestros paisajes para las próximas generaciones.
            </Text>
          </View>
          <View style={styles.ambientalGrid}>
            {TIPS_AMBIENTALES.map((t) => (
              <View key={t.titulo} style={styles.ambientalCard}>
                <View style={styles.ambientalIcon}>
                  <Ionicons name={t.icono as any} size={18} color={colors.primary} />
                </View>
                <Text style={styles.ambientalCardTit}>{t.titulo}</Text>
                <Text style={styles.ambientalCardDesc}>{t.descripcion}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTAs explorar */}
        <View style={styles.ctasFinales}>
          <Pressable
            style={[styles.ctaBtn, styles.ctaPrimary]}
            onPress={() => router.push('/(tabs)/explorar' as any)}>
            <Ionicons name="compass" size={22} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={styles.ctaTitulo}>Explorar lugares</Text>
              <Text style={styles.ctaSub}>Museos, parques, gastronomía</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </Pressable>
          <Pressable
            style={[styles.ctaBtn, styles.ctaSecondary]}
            onPress={() => router.push('/(tabs)/panoramas' as any)}>
            <Ionicons name="sparkles" size={22} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={styles.ctaTitulo}>Panoramas esta semana</Text>
              <Text style={styles.ctaSub}>Eventos y actividades con fecha</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </Pressable>
        </View>

        <Text style={styles.footerNote}>
          Hecho con <Text style={{ color: colors.terracotta }}>♥</Text> para descubrir Chile.
        </Text>
      </ScrollView>

      <ZonaPicker visible={zonaOpen} onClose={() => setZonaOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSoft },

  // Brand
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  brandLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandTxt: { fontSize: 18, color: colors.text, fontFamily: fonts.bodyBold },
  zonaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  zonaBtnTxt: { color: colors.primaryDark, fontSize: 12, fontFamily: fonts.bodyBold },

  // Saludo
  saludoBox: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: 4 },
  saludoTxt: { fontSize: 26, color: colors.text, fontFamily: fonts.bodySemi, lineHeight: 30 },
  saludoSub: { fontSize: 14, color: colors.textMuted, fontFamily: fonts.body, marginTop: 2 },

  // Hero región
  heroRegion: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
    height: 240,
    ...shadows.md,
  },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27,45,32,0.45)',
  },
  heroContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
  },
  heroKickerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroKicker: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontFamily: fonts.bodyMedium,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroTitulo: {
    color: '#fff',
    fontSize: 30,
    fontFamily: fonts.display,
    lineHeight: 34,
    marginTop: 6,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    fontFamily: fonts.bodyMedium,
    marginTop: 4,
  },

  // Descripción
  descBox: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.md },
  descTxt: { fontSize: 15, lineHeight: 24, color: colors.text, fontFamily: fonts.body },
  descCtas: { flexDirection: 'row', gap: 16 },
  exploreMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
  },
  exploreMapTxt: { color: colors.primary, fontSize: 13, fontFamily: fonts.bodyBold },

  // Secciones
  seccion: { paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.sm },
  seccionTitulo: { fontSize: 22, color: colors.text, fontFamily: fonts.display, lineHeight: 26 },
  seccionSub: { fontSize: 13, color: colors.textMuted, fontFamily: fonts.body, marginTop: 2 },
  hScroll: { paddingHorizontal: spacing.lg, gap: 12, paddingBottom: 4 },

  // Ciudades
  ciudadCard: {
    width: 200,
    height: 240,
    marginRight: 12,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
    ...shadows.sm,
  },
  ciudadImg: { width: '100%', height: '100%' },
  ciudadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27,73,101,0.4)',
  },
  ciudadText: { position: 'absolute', left: 12, right: 12, bottom: 12, gap: 4 },
  ciudadNombre: { color: '#fff', fontSize: 19, fontFamily: fonts.display },
  ciudadDesc: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 12,
    fontFamily: fonts.body,
    lineHeight: 16,
  },

  // Imperdibles
  imperdiblesList: { paddingHorizontal: spacing.lg, gap: 14 },
  imperdibleCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  imperdibleImg: {
    backgroundColor: colors.bgCard,
  },
  imperdibleBody: { flex: 1, padding: spacing.lg, gap: 6 },
  imperdibleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  numberPill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  numberTxt: { color: '#fff', fontSize: 12, fontFamily: fonts.bodyBold },
  imperdibleTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: colors.goldSoft,
  },
  imperdibleTagTxt: {
    fontSize: 10,
    color: colors.goldDark,
    fontFamily: fonts.bodyBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  imperdibleTitulo: {
    fontSize: 18,
    color: colors.text,
    fontFamily: fonts.display,
    lineHeight: 22,
  },
  imperdibleDesc: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.body,
    lineHeight: 20,
  },

  // Tips región
  tipsList: { paddingHorizontal: spacing.lg, gap: 10 },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
  tipTitulo: { fontSize: 14, color: colors.text, fontFamily: fonts.bodyBold },
  tipDesc: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.body, marginTop: 2 },

  // Conciencia ambiental
  ambientalSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  ambientalHeader: { gap: 8, marginBottom: spacing.lg },
  ambientalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  ambientalBadgeTxt: {
    color: '#fff',
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    letterSpacing: 0.5,
  },
  ambientalTitulo: {
    fontSize: 20,
    color: colors.primaryDark,
    fontFamily: fonts.display,
    lineHeight: 24,
  },
  ambientalSub: {
    fontSize: 13,
    color: colors.primaryDark,
    fontFamily: fonts.body,
    lineHeight: 18,
    opacity: 0.85,
  },
  ambientalGrid: { gap: 10 },
  ambientalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  ambientalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientalCardTit: { fontSize: 13, color: colors.text, fontFamily: fonts.bodyBold },
  ambientalCardDesc: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.body,
    marginTop: 2,
  },

  // CTAs finales
  ctasFinales: { paddingHorizontal: spacing.lg, marginTop: spacing.xl, gap: 10 },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  ctaPrimary: { backgroundColor: colors.primary },
  ctaSecondary: { backgroundColor: colors.secondary },
  ctaTitulo: { color: '#fff', fontSize: 15, fontFamily: fonts.bodyBold },
  ctaSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontFamily: fonts.body, marginTop: 2 },

  footerNote: {
    textAlign: 'center',
    color: colors.textSoft,
    fontSize: 12,
    marginTop: spacing.xxl,
    fontFamily: fonts.body,
  },
});

// ambientalCard needs Column alignment on small screens, adjust if needed
