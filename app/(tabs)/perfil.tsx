import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIAS } from '@/constants/categories';
import type { CategoriaId } from '@/lib/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { type Compania, useOnboardingStore } from '@/stores/useOnboardingStore';

const RADIOS = [5, 10, 25, 50];
const COMPANIAS: { id: Compania; label: string; icon: any }[] = [
  { id: 'solo', label: 'Solo/a', icon: 'person' },
  { id: 'pareja', label: 'Pareja', icon: 'heart' },
  { id: 'familia', label: 'Familia', icon: 'people' },
  { id: 'amigos', label: 'Amigos', icon: 'happy' },
];

export default function Perfil() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const favoritosCount = useFavoritesStore((s) => Object.keys(s.favoritos).length);
  const {
    intereses,
    radioKm,
    compania,
    toggleInteres,
    setRadio,
    setCompania,
  } = useOnboardingStore();

  const [prefsOpen, setPrefsOpen] = useState(false);

  const onLogin = () => router.push('/auth/login' as any);
  const onPublicar = () => {
    if (!user) {
      router.push({ pathname: '/auth/login' as any, params: { redirect: '/crear-lugar' } });
    } else {
      router.push('/crear-lugar' as any);
    }
  };

  const confirmarSalir = () =>
    Alert.alert('Cerrar sesión', '¿Seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => signOut() },
    ]);

  const displayName = user
    ? ((user.user_metadata?.full_name as string) ??
      (user.user_metadata?.name as string) ??
      user.email ??
      'Usuario')
    : null;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {user ? (
          <View style={styles.userHeader}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Ionicons name="person" size={32} color="#fff" />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.guestBox}>
            <View style={styles.guestIcon}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <Text style={styles.guestTitle}>Inicia sesión</Text>
            <Text style={styles.guestDesc}>
              Personaliza tu experiencia y publica tus lugares favoritos.
            </Text>
            <Pressable style={styles.btnPrimario} onPress={onLogin}>
              <Ionicons name="logo-google" size={18} color="#fff" />
              <Text style={styles.btnPrimarioTxt}>Continuar con Google</Text>
            </Pressable>
          </View>
        )}

        {/* Menú */}
        <View style={styles.menu}>
          <Pressable style={styles.menuItem} onPress={onPublicar}>
            <Ionicons name="add-circle" size={22} color="#E94F37" />
            <Text style={styles.menuLabel}>Publicar lugar o panorama</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/seccion/favoritos' as any)}>
            <Ionicons name="heart" size={22} color="#E94F37" />
            <Text style={styles.menuLabel}>Mis favoritos</Text>
            {favoritosCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeTxt}>{favoritosCount}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => setPrefsOpen(true)}>
            <Ionicons name="options" size={22} color="#3A86FF" />
            <Text style={styles.menuLabel}>Preferencias</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </Pressable>

          {user && (
            <Pressable style={styles.menuItem} onPress={confirmarSalir}>
              <Ionicons name="log-out" size={22} color="#666" />
              <Text style={styles.menuLabel}>Cerrar sesión</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </Pressable>
          )}
        </View>

        <Text style={styles.version}>magical-planet v1.0 · Plataforma turismo</Text>
      </ScrollView>

      {/* A.1 — Modal editar preferencias */}
      <Modal visible={prefsOpen} animationType="slide" onRequestClose={() => setPrefsOpen(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setPrefsOpen(false)}>
              <Ionicons name="close" size={24} color="#111" />
            </Pressable>
            <Text style={styles.modalTitle}>Preferencias</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
            <View>
              <Text style={styles.prefLabel}>Intereses</Text>
              <View style={styles.chipsWrap}>
                {CATEGORIAS.map((cat) => {
                  const activo = intereses.includes(cat.id);
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => toggleInteres(cat.id as CategoriaId)}
                      style={[
                        styles.chip,
                        activo && { borderColor: cat.color, backgroundColor: cat.color + '20' },
                      ]}>
                      <Ionicons name={cat.icono as any} size={14} color={activo ? cat.color : '#666'} />
                      <Text
                        style={[
                          styles.chipTxt,
                          activo && { color: cat.color, fontWeight: '700' },
                        ]}>
                        {cat.nombre}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View>
              <Text style={styles.prefLabel}>Radio de búsqueda</Text>
              <View style={styles.chipsWrap}>
                {RADIOS.map((km) => {
                  const activo = radioKm === km;
                  return (
                    <Pressable
                      key={km}
                      onPress={() => setRadio(km)}
                      style={[
                        styles.chip,
                        activo && { borderColor: '#E94F37', backgroundColor: '#FFF5F3' },
                      ]}>
                      <Text
                        style={[
                          styles.chipTxt,
                          activo && { color: '#E94F37', fontWeight: '700' },
                        ]}>
                        {km} km
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View>
              <Text style={styles.prefLabel}>Con quién salís</Text>
              <View style={styles.chipsWrap}>
                {COMPANIAS.map((c) => {
                  const activo = compania === c.id;
                  return (
                    <Pressable
                      key={c.id}
                      onPress={() => setCompania(c.id)}
                      style={[
                        styles.chip,
                        activo && { borderColor: '#E94F37', backgroundColor: '#FFF5F3' },
                      ]}>
                      <Ionicons name={c.icon} size={14} color={activo ? '#E94F37' : '#666'} />
                      <Text
                        style={[
                          styles.chipTxt,
                          activo && { color: '#E94F37', fontWeight: '700' },
                        ]}>
                        {c.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>
          <View style={styles.modalFooter}>
            <Pressable style={styles.btnCerrar} onPress={() => setPrefsOpen(false)}>
              <Text style={styles.btnCerrarTxt}>Guardar y cerrar</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, gap: 16 },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 16,
  },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarFallback: {
    backgroundColor: '#E94F37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: { fontSize: 18, fontWeight: '800', color: '#111' },
  userEmail: { fontSize: 13, color: '#666', marginTop: 2 },
  guestBox: { alignItems: 'center', padding: 24, gap: 10 },
  guestIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E94F37',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  guestTitle: { fontSize: 22, fontWeight: '800', color: '#111' },
  guestDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  btnPrimario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  btnPrimarioTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  menu: { gap: 8, marginTop: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  menuLabel: { flex: 1, fontSize: 15, color: '#222', fontWeight: '500' },
  badge: {
    backgroundColor: '#E94F37',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  version: { fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 16 },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#111' },
  prefLabel: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  chipTxt: { fontSize: 13, color: '#444' },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  btnCerrar: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnCerrarTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
