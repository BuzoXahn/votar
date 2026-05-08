import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserStore } from '../../store/user.store';
import { Button } from '../../components/ui/Button';
import { colors, font, radius, spacing } from '../../theme';
import { ANIMALS } from '../../utils/format';
import { useAuthStore } from '../../store/auth.store';

type Props = { navigation: NativeStackNavigationProp<any> };

const PALETTE = ['#151a05','#051a15','#05101a','#1a0505','#150a1a','#1a1205'];
const ANIMAL_LIST = Object.keys(ANIMALS);

export function AvatarScreen({ navigation }: Props) {
  const [animal, setAnimal] = useState('fox');
  const [color, setColor] = useState(PALETTE[0]);
  const [nickname, setNickname] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { updateAvatar } = useUserStore();

  const handleFinish = async () => {
    if (!nickname.trim() || nickname.length < 3) { setError('El apodo debe tener al menos 3 caracteres'); return; }
    setSaving(true);
    setError('');
    try {
      await updateAvatar({ animalSlug: animal, colorHex: color, nickname: nickname.trim() });
     useAuthStore.setState({ isNewUser: false });
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Error al guardar el avatar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.step}>PASO 2 DE 2</Text>
        <Text style={styles.title}>Crea tu{'\n'}avatar</Text>
        <Text style={styles.sub}>Este es tu perfil público. No revela tu identidad real.</Text>

        {/* Preview */}
        <View style={styles.preview}>
          <View style={[styles.avatarBig, { backgroundColor: color }]}>
            <Text style={styles.avatarEmoji}>{ANIMALS[animal]}</Text>
          </View>
          <Text style={styles.previewName}>{nickname || 'tu_apodo'}</Text>
        </View>

        {/* Animal */}
        <Text style={styles.sectionLabel}>ANIMAL</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
          <View style={styles.hRow}>
            {ANIMAL_LIST.map(a => (
              <TouchableOpacity
                key={a} onPress={() => setAnimal(a)}
                style={[styles.animalBtn, animal === a && styles.animalSelected]}
              >
                <Text style={styles.animalEmoji}>{ANIMALS[a]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Color */}
        <Text style={styles.sectionLabel}>COLOR</Text>
        <View style={styles.palette}>
          {PALETTE.map(c => (
            <TouchableOpacity
              key={c} onPress={() => setColor(c)}
              style={[styles.colorBtn, { backgroundColor: c }, color === c && styles.colorSelected]}
            />
          ))}
        </View>

        {/* Nickname */}
        <Text style={styles.sectionLabel}>APODO</Text>
        <TextInput
          value={nickname}
          onChangeText={t => { setNickname(t.toLowerCase().replace(/\s/g, '_')); setError(''); }}
          placeholder="ciudadano_mx_42"
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, error ? styles.inputError : null]}
          autoCapitalize="none"
          maxLength={24}
          selectionColor={colors.accent}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.hint}>Solo letras, números y guión bajo. Sin nombre real.</Text>

        <Button label="Entrar a VotAR →" onPress={handleFinish} loading={saving} style={styles.btn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { paddingHorizontal: 20, paddingBottom: 32, gap: 0 },
  step: { fontFamily: font.semibold, fontSize: 10, letterSpacing: 2, color: colors.textTertiary, marginTop: 20 },
  title: { fontFamily: font.serif, fontSize: 28, color: colors.text, lineHeight: 34, marginTop: 6 },
  sub: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, lineHeight: 18, marginTop: 6, marginBottom: 24 },
  preview: { alignItems: 'center', marginBottom: 28, gap: 8 },
  avatarBig: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.accent + '40' },
  avatarEmoji: { fontSize: 40 },
  previewName: { fontFamily: font.semibold, fontSize: 14, color: colors.textSecondary },
  sectionLabel: { fontFamily: font.semibold, fontSize: 10, letterSpacing: 2, color: colors.textTertiary, marginBottom: 10, marginTop: 4 },
  hScroll: { marginBottom: 20 },
  hRow: { flexDirection: 'row', gap: 8 },
  animalBtn: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  animalSelected: { borderColor: colors.accent, backgroundColor: colors.bgAccentLight },
  animalEmoji: { fontSize: 24 },
  palette: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  colorBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'transparent' },
  colorSelected: { borderColor: colors.accent },
  input: { backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.borderInput, borderRadius: radius.md, padding: 14, fontSize: 14, fontFamily: font.regular, color: colors.text, marginBottom: 6 },
  inputError: { borderColor: colors.danger },
  error: { fontFamily: font.regular, fontSize: 11, color: colors.danger, marginBottom: 4 },
  hint: { fontFamily: font.regular, fontSize: 11, color: colors.textTertiary, marginBottom: 24 },
  btn: { marginTop: 8 },
});
