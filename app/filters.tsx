import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CategoryChip } from '@/components/CategoryChip';
import { RatingStars } from '@/components/RatingStars';
import { CATEGORIAS } from '@/constants/categories';
import { TAGS } from '@/constants/tags';
import { formatPrecio } from '@/lib/distance';
import { useFiltersStore } from '@/stores/useFiltersStore';

const RADIOS = [5, 10, 25, 50, 200, 2000, 20000];
const PRECIOS: (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];
const RATINGS: (0 | 1 | 2 | 3 | 4 | 5)[] = [0, 3, 4, 5];

export default function Filters() {
  const router = useRouter();
  const {
    categorias,
    radioKm,
    soloGratis,
    precioMin,
    precioMax,
    minRating,
    tags,
    toggleCategoria,
    setRadio,
    setSoloGratis,
    setPrecioRango,
    setMinRating,
    toggleTag,
    reset,
  } = useFiltersStore();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.seccion}>Categorías</Text>
        <View style={styles.chips}>
          {CATEGORIAS.map((c) => (
            <CategoryChip
              key={c.id}
              categoria={c}
              activa={categorias.includes(c.id)}
              onPress={() => toggleCategoria(c.id)}
            />
          ))}
        </View>

        <Text style={styles.seccion}>Radio de búsqueda</Text>
        <View style={styles.chips}>
          {RADIOS.map((km) => (
            <Pressable
              key={km}
              onPress={() => setRadio(km)}
              style={[styles.radioChip, radioKm === km && styles.radioChipActivo]}>
              <Text style={[styles.radioTxt, radioKm === km && styles.radioTxtActivo]}>
                {km >= 20000 ? 'Sin límite' : km >= 2000 ? 'Todo Chile' : `${km} km`}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.seccion}>Precio</Text>
        <View style={styles.tabsRow}>
          <Pressable
            onPress={() => setSoloGratis(true)}
            style={[styles.tabBtn, soloGratis && styles.tabBtnActivo]}>
            <Ionicons name="gift" size={16} color={soloGratis ? '#fff' : '#444'} />
            <Text style={[styles.tabTxt, soloGratis && styles.tabTxtActivo]}>
              Solo gratis
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSoloGratis(false)}
            style={[styles.tabBtn, !soloGratis && styles.tabBtnActivo]}>
            <Ionicons name="cash" size={16} color={!soloGratis ? '#fff' : '#444'} />
            <Text style={[styles.tabTxt, !soloGratis && styles.tabTxtActivo]}>
              Definir rango
            </Text>
          </Pressable>
        </View>

        {!soloGratis && (
          <View style={styles.rangoBox}>
            <View style={styles.rangoLado}>
              <Text style={styles.rangoLabel}>Mínimo</Text>
              <View style={styles.chips}>
                {PRECIOS.map((p) => (
                  <Pressable
                    key={`min-${p}`}
                    onPress={() => setPrecioRango(p, p > precioMax ? p : precioMax)}
                    style={[styles.precioChip, precioMin === p && styles.precioChipActivo]}>
                    <Text
                      style={[styles.precioTxt, precioMin === p && styles.precioTxtActivo]}>
                      {formatPrecio(p)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.rangoLado}>
              <Text style={styles.rangoLabel}>Máximo</Text>
              <View style={styles.chips}>
                {PRECIOS.map((p) => (
                  <Pressable
                    key={`max-${p}`}
                    onPress={() => setPrecioRango(p < precioMin ? p : precioMin, p)}
                    style={[styles.precioChip, precioMax === p && styles.precioChipActivo]}>
                    <Text
                      style={[styles.precioTxt, precioMax === p && styles.precioTxtActivo]}>
                      {formatPrecio(p)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        <Text style={styles.seccion}>Calificación mínima</Text>
        <View style={styles.chips}>
          {RATINGS.map((r) => (
            <Pressable
              key={r}
              onPress={() => setMinRating(r)}
              style={[styles.radioChip, minRating === r && styles.radioChipActivo]}>
              {r === 0 ? (
                <Text style={[styles.radioTxt, minRating === r && styles.radioTxtActivo]}>
                  Cualquiera
                </Text>
              ) : (
                <View style={styles.ratingOpt}>
                  <RatingStars rating={r} size={12} />
                  <Text style={[styles.radioTxt, minRating === r && styles.radioTxtActivo]}>
                    {r === 5 ? '5 · solo excelente' : `${r}+`}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <Text style={styles.seccion}>Características</Text>
        <View style={styles.chips}>
          {TAGS.map((t) => {
            const activo = tags.includes(t.id);
            return (
              <Pressable
                key={t.id}
                onPress={() => toggleTag(t.id)}
                style={[
                  styles.radioChip,
                  activo && { borderColor: t.color, backgroundColor: t.color + '20' },
                ]}>
                <View style={styles.ratingOpt}>
                  <Ionicons name={t.icon} size={12} color={activo ? t.color : '#666'} />
                  <Text
                    style={[styles.radioTxt, activo && { color: t.color, fontWeight: '700' }]}>
                    {t.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={reset} style={styles.btnReset}>
          <Ionicons name="refresh" size={16} color="#666" />
          <Text style={styles.btnResetTxt}>Reiniciar</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.btnAplicar}>
          <Text style={styles.btnAplicarTxt}>Aplicar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  scroll: { padding: 16, gap: 8 },
  seccion: { fontSize: 14, fontWeight: '700', color: '#333', marginTop: 16, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  radioChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  radioChipActivo: { backgroundColor: '#111', borderColor: '#111' },
  radioTxt: { fontSize: 13, color: '#333', fontWeight: '500' },
  radioTxtActivo: { color: '#fff' },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tabBtnActivo: { backgroundColor: '#111', borderColor: '#111' },
  tabTxt: { fontSize: 13, fontWeight: '600', color: '#444' },
  tabTxtActivo: { color: '#fff' },
  rangoBox: { gap: 14, marginTop: 12 },
  rangoLado: { gap: 6 },
  rangoLabel: { fontSize: 12, fontWeight: '600', color: '#888' },
  precioChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    minWidth: 64,
    alignItems: 'center',
  },
  precioChipActivo: { borderColor: '#E94F37', backgroundColor: '#FFF5F3' },
  precioTxt: { fontSize: 15, fontWeight: '600', color: '#444' },
  precioTxtActivo: { color: '#E94F37' },
  ratingOpt: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  btnReset: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  btnResetTxt: { color: '#666', fontWeight: '600' },
  btnAplicar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  btnAplicarTxt: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
