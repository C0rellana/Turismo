import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '@/constants/theme';
import { getRegionByLatLng } from '@/lib/regiones-info';
import { useLocationStore } from '@/stores/useLocationStore';
import { FlagChile } from './FlagChile';
import { ZonaPicker } from './ZonaPicker';

/** Badge flotante con región activa. Tap abre ZonaPicker. */
export function RegionBadge({ compacto = false }: { compacto?: boolean }) {
  const ubicacion = useLocationStore((s) => s.ubicacion);
  const custom = useLocationStore((s) => s.custom);
  const [open, setOpen] = useState(false);

  const region = useMemo(() => {
    const lat = ubicacion?.lat ?? -35.4264;
    const lng = ubicacion?.lng ?? -71.6554;
    return getRegionByLatLng(lat, lng);
  }, [ubicacion?.lat, ubicacion?.lng]);

  const label = custom?.label ?? region.nombre.replace('Región de ', '').replace('Región del ', '');

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={[styles.badge, compacto && styles.compacto]}>
        <FlagChile size={16} />
        <View style={{ flex: 1 }}>
          {!compacto && <Text style={styles.label}>Estás en</Text>}
          <Text style={styles.region}>{label}</Text>
        </View>
        <Ionicons name="chevron-down" size={14} color={colors.primary} />
      </Pressable>
      <ZonaPicker visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  compacto: { paddingVertical: 6 },
  label: { fontSize: 10, color: colors.primaryDark, fontFamily: fonts.bodyMedium, opacity: 0.7 },
  region: { fontSize: 13, color: colors.primaryDark, fontFamily: fonts.bodyBold },
});
