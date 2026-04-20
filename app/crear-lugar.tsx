import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MiniMapaPicker from '@/components/MiniMapaPicker';
import { CATEGORIAS } from '@/constants/categories';
import { supabase } from '@/lib/supabase';
import type { CategoriaId, TipoLugar } from '@/lib/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLocationStore } from '@/stores/useLocationStore';

const PRECIOS = [
  { nivel: 0 as const, label: 'Gratis' },
  { nivel: 1 as const, label: '$' },
  { nivel: 2 as const, label: '$$' },
  { nivel: 3 as const, label: '$$$' },
];

export default function CrearLugar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const ubicacion = useLocationStore((s) => s.ubicacion);

  const [tipo, setTipo] = useState<TipoLugar>('turistico');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [categoria, setCategoria] = useState<CategoriaId>('gastronomia');
  const [precio, setPrecio] = useState<0 | 1 | 2 | 3>(1);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace({ pathname: '/auth/login' as any, params: { redirect: '/crear-lugar' } });
    }
  }, [user, router]);

  useEffect(() => {
    if (ubicacion && lat === null) {
      setLat(ubicacion.lat);
      setLng(ubicacion.lng);
    }
  }, [ubicacion, lat]);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.7,
    });
    if (!result.canceled && result.assets) {
      setImagenes((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, 5));
    }
  };

  const removeImage = (idx: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== idx));
  };

  const subirImagen = async (uri: string, userId: string, idx: number): Promise<string | null> => {
    try {
      const ext = uri.split('.').pop()?.split('?')[0] ?? 'jpg';
      const fileName = `${userId}/${Date.now()}_${idx}.${ext}`;
      const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

      let body: Blob | ArrayBuffer;
      if (Platform.OS === 'web') {
        const resp = await fetch(uri);
        body = await resp.blob();
      } else {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        body = bytes.buffer;
      }

      const { error } = await supabase.storage
        .from('panoramas-imagenes')
        .upload(fileName, body, { contentType, upsert: false });
      if (error) throw error;

      const { data } = supabase.storage.from('panoramas-imagenes').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (e: any) {
      console.warn('[upload]', e?.message);
      return null;
    }
  };

  const enviar = async () => {
    if (!user) return;
    if (!nombre.trim()) {
      Alert.alert('Falta el nombre', 'Poné un nombre.');
      return;
    }
    if (lat == null || lng == null) {
      Alert.alert('Sin ubicación', 'Ajustá el pin en el mapa o permití ubicación.');
      return;
    }
    if (tipo === 'panorama' && !fechaInicio) {
      Alert.alert('Falta fecha', 'Un panorama (evento) necesita fecha.');
      return;
    }

    setEnviando(true);
    try {
      // Upload fotos
      const urls: string[] = [];
      for (let i = 0; i < imagenes.length; i++) {
        const url = await subirImagen(imagenes[i], user.id, i);
        if (url) urls.push(url);
      }

      // Insert lugar
      const { data: ins, error } = await supabase
        .from('lugares')
        .insert({
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || null,
          direccion: direccion.trim() || null,
          categoria,
          tipo,
          precio_nivel: precio,
          imagen_url: urls[0] ?? null,
          creado_por: user.id,
          moderado: false,
          location: `SRID=4326;POINT(${lng} ${lat})`,
          fecha_inicio: tipo === 'panorama' && fechaInicio ? new Date(fechaInicio).toISOString() : null,
          fecha_fin: tipo === 'panorama' && fechaFin ? new Date(fechaFin).toISOString() : null,
        })
        .select('id')
        .single();

      if (error) throw error;

      // Insert imagenes múltiples
      if (ins && urls.length > 0) {
        const rows = urls.map((url, orden) => ({
          lugar_id: ins.id,
          url,
          orden,
        }));
        const { error: imgErr } = await supabase.from('lugar_imagenes').insert(rows);
        if (imgErr) console.warn('[imgs]', imgErr.message);
      }

      Alert.alert(
        '¡Gracias!',
        'Tu publicación fue enviada a revisión. Aparecerá cuando la aprobemos.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No pudimos guardar.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Selector tipo */}
          <View style={styles.field}>
            <Text style={styles.label}>¿Qué querés publicar?</Text>
            <View style={styles.tipoRow}>
              <Pressable
                onPress={() => setTipo('turistico')}
                style={[styles.tipoBtn, tipo === 'turistico' && styles.tipoBtnActivo]}>
                <Ionicons name="location" size={20} color={tipo === 'turistico' ? '#fff' : '#444'} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.tipoTitulo, tipo === 'turistico' && styles.tipoActivoTxt]}>
                    Lugar turístico
                  </Text>
                  <Text style={[styles.tipoSub, tipo === 'turistico' && styles.tipoActivoTxt]}>
                    Museo, parque, restaurante, monumento
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => setTipo('panorama')}
                style={[styles.tipoBtn, tipo === 'panorama' && styles.tipoBtnActivo]}>
                <Ionicons name="calendar" size={20} color={tipo === 'panorama' ? '#fff' : '#444'} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.tipoTitulo, tipo === 'panorama' && styles.tipoActivoTxt]}>
                    Panorama / Evento
                  </Text>
                  <Text style={[styles.tipoSub, tipo === 'panorama' && styles.tipoActivoTxt]}>
                    Feria, concierto, encuentro con fecha
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Fotos múltiples D.20 */}
          <View style={styles.field}>
            <Text style={styles.label}>Fotos (hasta 5)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {imagenes.map((uri, i) => (
                <View key={uri + i} style={styles.imgItem}>
                  <Image source={{ uri }} style={styles.imgPreview} />
                  <Pressable onPress={() => removeImage(i)} style={styles.imgDel}>
                    <Ionicons name="close" size={16} color="#fff" />
                  </Pressable>
                </View>
              ))}
              {imagenes.length < 5 && (
                <Pressable onPress={pickImages} style={styles.addImg}>
                  <Ionicons name="camera" size={24} color="#999" />
                  <Text style={styles.addImgTxt}>Agregar</Text>
                </Pressable>
              )}
            </ScrollView>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput value={nombre} onChangeText={setNombre} placeholder="Ej. Mirador San Cristóbal" style={styles.input} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="¿Qué lo hace especial?"
              multiline
              style={[styles.input, styles.inputMultiline]}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Dirección</Text>
            <TextInput value={direccion} onChangeText={setDireccion} placeholder="Calle, barrio, ciudad" style={styles.input} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
              {CATEGORIAS.map((cat) => {
                const activo = categoria === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setCategoria(cat.id)}
                    style={[styles.chip, activo && { borderColor: cat.color, backgroundColor: cat.color + '20' }]}>
                    <Ionicons name={cat.icono as any} size={16} color={activo ? cat.color : '#666'} />
                    <Text style={[styles.chipTxt, activo && { color: cat.color, fontWeight: '700' }]}>
                      {cat.nombre}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Precio</Text>
            <View style={styles.preciosRow}>
              {PRECIOS.map((p) => {
                const activo = precio === p.nivel;
                return (
                  <Pressable
                    key={p.nivel}
                    onPress={() => setPrecio(p.nivel)}
                    style={[styles.precio, activo && styles.precioActivo]}>
                    <Text style={[styles.precioTxt, activo && styles.precioTxtActivo]}>
                      {p.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {tipo === 'panorama' && (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Fecha de inicio</Text>
                {Platform.OS === 'web' ? (
                  <input
                    type="datetime-local"
                    value={fechaInicio}
                    onChange={(e: any) => setFechaInicio(e.target.value)}
                    style={{ padding: 12, borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 15 } as any}
                  />
                ) : (
                  <TextInput
                    value={fechaInicio}
                    onChangeText={setFechaInicio}
                    placeholder="YYYY-MM-DD HH:MM"
                    style={styles.input}
                  />
                )}
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Fecha de fin (opcional)</Text>
                {Platform.OS === 'web' ? (
                  <input
                    type="datetime-local"
                    value={fechaFin}
                    onChange={(e: any) => setFechaFin(e.target.value)}
                    style={{ padding: 12, borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 15 } as any}
                  />
                ) : (
                  <TextInput
                    value={fechaFin}
                    onChangeText={setFechaFin}
                    placeholder="YYYY-MM-DD HH:MM"
                    style={styles.input}
                  />
                )}
              </View>
            </>
          )}

          {/* D.19 — Selector pin manual */}
          <View style={styles.field}>
            <Text style={styles.label}>Ubicación (ajustá el pin)</Text>
            {lat !== null && lng !== null ? (
              <MiniMapaPicker
                lat={lat}
                lng={lng}
                onChange={(la, ln) => {
                  setLat(la);
                  setLng(ln);
                }}
              />
            ) : (
              <Text style={styles.sinUbic}>Cargando ubicación...</Text>
            )}
            {lat !== null && lng !== null && (
              <Text style={styles.coords}>
                {lat.toFixed(5)}, {lng.toFixed(5)}
              </Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={[styles.btnSubmit, enviando && styles.btnDisabled]} onPress={enviar} disabled={enviando}>
            {enviando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="send" size={18} color="#fff" />
                <Text style={styles.btnSubmitTxt}>Publicar</Text>
              </>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, gap: 16 },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#444' },
  tipoRow: { gap: 8 },
  tipoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tipoBtnActivo: { backgroundColor: '#111', borderColor: '#111' },
  tipoTitulo: { fontSize: 14, fontWeight: '700', color: '#111' },
  tipoSub: { fontSize: 12, color: '#666', marginTop: 2 },
  tipoActivoTxt: { color: '#fff' },
  imgItem: { position: 'relative', marginRight: 8 },
  imgPreview: { width: 100, height: 100, borderRadius: 10, backgroundColor: '#eee' },
  imgDel: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImg: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#fafafa',
  },
  addImgTxt: { fontSize: 11, color: '#999' },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#fafafa',
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  chipsRow: { flexDirection: 'row' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipTxt: { fontSize: 13, color: '#666' },
  preciosRow: { flexDirection: 'row', gap: 8 },
  precio: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  precioActivo: { borderColor: '#E94F37', backgroundColor: '#FFF5F3' },
  precioTxt: { fontSize: 15, fontWeight: '600', color: '#666' },
  precioTxtActivo: { color: '#E94F37' },
  sinUbic: { fontSize: 13, color: '#888', fontStyle: 'italic' },
  coords: { fontSize: 11, color: '#888', textAlign: 'center' },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  btnSubmit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 12,
  },
  btnDisabled: { opacity: 0.5 },
  btnSubmitTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
