import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';

type Props = {
  targetTipo: 'lugar' | 'review' | 'usuario';
  targetId: string;
  size?: 'sm' | 'md';
};

const MOTIVOS = [
  { id: 'contenido_inapropiado', label: 'Contenido inapropiado', icon: 'warning' },
  { id: 'info_incorrecta', label: 'Información incorrecta', icon: 'alert-circle' },
  { id: 'spam', label: 'Spam o publicidad', icon: 'mail-unread' },
  { id: 'duplicado', label: 'Publicación duplicada', icon: 'copy' },
  { id: 'lugar_cerrado', label: 'Lugar ya no existe', icon: 'close-circle' },
  { id: 'violencia_odio', label: 'Violencia u odio', icon: 'shield' },
  { id: 'otro', label: 'Otro motivo', icon: 'help-circle' },
];

export function DenunciarBtn({ targetTipo, targetId, size = 'md' }: Props) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);

  const abrir = () => {
    // Permite abrir modal sin login; al enviar pedimos login
    setOpen(true);
  };

  const irLogin = () => {
    setOpen(false);
    router.push('/auth/login' as any);
  };

  const enviar = async () => {
    if (!user) {
      Alert.alert('Inicia sesión', 'Debes tener cuenta para enviar denuncias.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Iniciar sesión', onPress: irLogin },
      ]);
      return;
    }
    if (!motivo) {
      Alert.alert('Elige un motivo', 'Selecciona por qué denuncias esta publicación.');
      return;
    }
    setEnviando(true);
    const { error } = await supabase.from('reportes').insert({
      user_id: user.id,
      target_tipo: targetTipo,
      target_id: targetId,
      motivo,
      descripcion: descripcion.trim() || null,
    });
    setEnviando(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    // Cerrar modal primero para que Alert sea visible
    setOpen(false);
    setMotivo(null);
    setDescripcion('');
    const msg = 'Un moderador revisará esta publicación. Gracias por cuidar la comunidad.';
    setTimeout(() => {
      if (Platform.OS === 'web') {
        // eslint-disable-next-line no-alert
        window.alert(`✓ Denuncia enviada\n\n${msg}`);
      } else {
        Alert.alert('✓ Denuncia enviada', msg);
      }
    }, 250);
  };

  return (
    <>
      <Pressable style={[styles.btn, size === 'sm' && styles.btnSm]} onPress={abrir}>
        <Ionicons name="flag-outline" size={size === 'sm' ? 14 : 16} color={colors.textMuted} />
        <Text style={[styles.btnTxt, size === 'sm' && { fontSize: 11 }]}>Reportar</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.header}>
            <Pressable onPress={() => setOpen(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.titulo}>Reportar publicación</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
            <Text style={styles.descripcion}>
              Tu reporte es anónimo para el autor. Un moderador revisará el contenido.
            </Text>

            <View>
              <Text style={styles.seccionLabel}>Motivo</Text>
              <View style={styles.motivosList}>
                {MOTIVOS.map((m) => {
                  const activo = motivo === m.id;
                  return (
                    <Pressable
                      key={m.id}
                      style={[styles.motivoCard, activo && styles.motivoCardActivo]}
                      onPress={() => setMotivo(m.id)}>
                      <Ionicons
                        name={m.icon as any}
                        size={18}
                        color={activo ? colors.terracotta : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.motivoLabel,
                          activo && { color: colors.terracotta, fontFamily: fonts.bodyBold },
                        ]}>
                        {m.label}
                      </Text>
                      {activo && (
                        <Ionicons name="checkmark-circle" size={18} color={colors.terracotta} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View>
              <Text style={styles.seccionLabel}>Descripción (opcional)</Text>
              <TextInput
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Agrega contexto si quieres..."
                placeholderTextColor={colors.textSoft}
                style={styles.input}
                multiline
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={[styles.btnEnviar, enviando && { opacity: 0.5 }]}
              onPress={enviar}
              disabled={enviando}>
              {enviando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="flag" size={16} color="#fff" />
                  <Text style={styles.btnEnviarTxt}>Enviar denuncia</Text>
                </>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  btnSm: { paddingHorizontal: 10, paddingVertical: 6 },
  btnTxt: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.bodyMedium },
  modal: { flex: 1, backgroundColor: colors.bgSoft },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  titulo: { fontSize: 17, color: colors.text, fontFamily: fonts.bodyBold },
  descripcion: { fontSize: 13, color: colors.textMuted, lineHeight: 19, fontFamily: fonts.body },
  seccionLabel: {
    fontSize: 12,
    color: colors.text,
    fontFamily: fonts.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  motivosList: { gap: 8 },
  motivoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
  },
  motivoCardActivo: {
    borderColor: colors.terracotta,
    backgroundColor: colors.terracottaSoft,
  },
  motivoLabel: { flex: 1, fontSize: 14, color: colors.text, fontFamily: fonts.body },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
    minHeight: 80,
    textAlignVertical: 'top',
    fontFamily: fonts.body,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  btnEnviar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.terracotta,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  btnEnviarTxt: { color: '#fff', fontSize: 15, fontFamily: fonts.bodyBold },
});
