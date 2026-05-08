import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/auth.store';
import { useUserStore } from '../../store/user.store';
import { AvatarDisplay } from '../../components/avatar/AvatarDisplay';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { colors, font, radius } from '../../theme';

export function ProfileScreen() {
  const { logout } = useAuthStore();
  const { profile, loading, fetchProfile } = useUserStore();

  useEffect(() => { fetchProfile(); }, []);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  if (loading && !profile) return <LoadingSpinner full />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Mi perfil</Text>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          {profile?.avatar ? (
            <AvatarDisplay animalSlug={profile.avatar.animalSlug} colorHex={profile.avatar.colorHex} size={80} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>?</Text>
            </View>
          )}
          <Text style={styles.nickname}>{profile?.avatar?.nickname ?? 'Sin apodo'}</Text>
          <Text style={styles.profLabel}>{profile?.professionId ? 'Profesión configurada ✓' : 'Sin profesión'}</Text>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Estado del perfil</Text>
            <Text style={[styles.infoVal, profile?.setupComplete ? styles.green : styles.muted]}>
              {profile?.setupComplete ? 'Completo' : 'Incompleto'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Tipo de cuenta</Text>
            <Text style={styles.infoVal}>Ciudadano anónimo</Text>
          </View>
        </View>

        {/* Privacidad */}
        <View style={styles.privacyBox}>
          <Text style={styles.privacyTitle}>🔒 Tu privacidad</Text>
          <Text style={styles.privacyText}>
            VotAR nunca vincula tu identidad con tus votos. Tu correo solo se usa para verificar que eres una persona real. Los votos se registran sin ninguna referencia a tu cuenta.
          </Text>
        </View>

        <Button label="Cerrar sesión" variant="danger" onPress={handleLogout} style={styles.logoutBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  title: { fontFamily: font.serif, fontSize: 28, color: colors.text, lineHeight: 34, paddingTop: 16 },
  avatarSection: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  avatarPlaceholderText: { fontFamily: font.serif, fontSize: 32, color: colors.textTertiary },
  nickname: { fontFamily: font.semibold, fontSize: 18, color: colors.text },
  profLabel: { fontFamily: font.regular, fontSize: 12, color: colors.textTertiary },
  infoBox: { backgroundColor: colors.bgCard, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  divider: { height: 1, backgroundColor: colors.border },
  infoKey: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary },
  infoVal: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  green: { color: colors.success },
  muted: { color: colors.textTertiary },
  privacyBox: { backgroundColor: colors.bgAccentLight, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.borderAccent, padding: 16, gap: 8 },
  privacyTitle: { fontFamily: font.semibold, fontSize: 13, color: colors.text },
  privacyText: { fontFamily: font.regular, fontSize: 12, color: '#8b9a5a', lineHeight: 18 },
  logoutBtn: { marginTop: 8 },
});
