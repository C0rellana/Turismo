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
import { CATEGORIAS } from '@/constants/categories';
import { supabase } from '@/lib/supabase';
import type { CategoriaId } from '@/lib/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLocationStore } from '@/stores/useLocationStore';

const PRECIOS = [
  { nivel: 0 as const, label: 'Gratis' },
  { nivel: 1 as const, label: '$' },
  { nivel: 2 as const, label: '$$' },
  { nivel: 3 as const, label: '$$$' },
];

export default function CrearPanorama() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const ubicacion = useLocationStore((s) => s.ubicacion);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [categoria, setCategoria] = useState<CategoriaId>('gastronomia');
  const [precio, setPrecio] = useState<0 | 1 | 2 | 3>(1);
  const [imagenLocal, setImagenLocal] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace({ pathname: '/auth/login' as any, params: { redirect: '/crear-panorama' } });
    }
  }, [user, router]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]) {
      setImagenLocal(result.assets[0].uri);
    }
  };

  const subirImagen = async (uri: string, userId: string): Promise<string | null> => {
    try {
      const ext = uri.split('.').pop() ?? 'jpg';
      const fileName = `${userId}/${Date.now()}.${ext}`;
      const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

      let body: Blob | ArrayBuffer;
      if (Platform.OS === 'web') {
        const resp = await fetch(uri);
        body = await resp.blob();
      } else {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64',
        });
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
      Alert.alert('Falta el nombre', 'Poné un nombre para tu panorama.');
      return;
    }
    if (!ubicacion) {
      Alert.alert('Sin ubicación', 'No tenemos tu ubicación actual.');
      return;
    }

    setEnviando(true);
    try {
      let imagen_url: string | null = null;
      if (imagenLocal) {
        imagen_url = await subirImagen(imagenLocal, user.id);
      }

      const { error } = await supabase.from('panoramas').insert({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        direccion: direccion.trim() || null,
        categoria,
        precio_nivel: precio,
        imagen_url,
        creado_por: user.id,
        moderado: false,
        location: `SRID=4326;POINT(${ubicacion.lng} ${ubicacion.lat})`,
      });

      if (error) throw error;

      Alert.alert(
        '¡Gracias!',
        'Tu panorama fue enviado a revisión. Aparecerá publicado cuando lo aprobemos.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No pudimos guardar tu panorama.');
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
          <Pressable style={styles.imagenBox} onPress={pickImage}>
            {imagenLocal ? (
              <Image source={{ uri: imagenLocal }} style={styles.imagenPreview} />
            ) : (
              <View style={styles.imagenPlaceholder}>
                <Ionicons name="camera" size={32} color="#999" />
                <Text style={styles.imagenPlaceholderTxt}>Agregar foto</Text>
              </View>
            )}
          </Pressable>

          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Mirador San Cristóbal"
              style={styles.input}
            />
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
            <TextInput
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Calle, barrio, ciudad"
              style={styles.input}
            />
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
                    style={[
                      styles.chip,
                      activo && { borderColor: cat.color, backgroundColor: cat.color + '20' },
                    ]}>
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

          <View style={styles.ubicacionBox}>
            <Ionicons name="location" size={18} color="#666" />
            <Text style={styles.ubicacionTxt}>
              {ubicacion
                ? `Tu ubicación actual (${ubicacion.lat.toFixed(4)}, ${ubicacion.lng.toFixed(4)})`
                : 'Sin ubicación'}
            </Text>
          </View>
          <Text style={styles.fineprint}>
            Se usará tu ubicación actual como ubicación del panorama. Podrás editarla en el mapa más adelante.
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.btnSubmit, enviando && styles.btnDisabled]}
            onPress={enviar}
            disabled={enviando}>
            {enviando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="send" size={18} color="#fff" />
                <Text style={styles.btnSubmitTxt}>Publicar panorama</Text>
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
  imagenBox: {
    height: 200,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  imagenPreview: { width: '100%', height: '100%' },
  imagenPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 6 },
  imagenPlaceholderTxt: { color: '#999', fontSize: 14 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#444' },
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
  ubicacionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  ubicacionTxt: { fontSize: 13, color: '#555', flex: 1 },
  fineprint: { fontSize: 12, color: '#888', lineHeight: 18 },
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
