import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserStore } from '../../store/user.store';
import { Button } from '../../components/ui/Button';
import { colors, font, radius, spacing } from '../../theme';
import api from '../../services/api';

type Props = { navigation: NativeStackNavigationProp<any> };

interface Profession { id: string; slug: string; nameEs: string; category: string; }

const CATEGORY_ICONS: Record<string, string> = {
  salud: '🏥', educacion: '📚', tecnologia: '💻', legal: '⚖️',
  economia: '📊', cultura: '🎨', ciencia: '🔬', gobierno: '🏛️',
  negocios: '💼', otro: '✨',
};

export function ProfessionScreen({ navigation }: Props) {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { updateProfession } = useUserStore();

  useEffect(() => {
    api.get('/professions').then(r => setProfessions(r.data)).finally(() => setLoading(false));
  }, []);

  const handleContinue = async () => {
    if (!selected) return;
    setSaving(true);
    await updateProfession(selected);
    setSaving(false);
    navigation.navigate('Avatar');
  };

  if (loading) return (
    <SafeAreaView style={styles.safe}>
      <ActivityIndicator color={colors.accent} style={{ flex: 1 }} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.step}>PASO 1 DE 2</Text>
          <Text style={styles.title}>¿Cuál es tu{'\n'}profesión?</Text>
          <Text style={styles.sub}>Esta información segmenta los resultados. No identifica tu voto.</Text>
        </View>

        <FlatList
          data={professions}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelected(item.id)}
              activeOpacity={0.75}
              style={[styles.option, selected === item.id && styles.optionSelected]}
            >
              <Text style={styles.icon}>{CATEGORY_ICONS[item.category] ?? '✨'}</Text>
              <Text style={[styles.optionText, selected === item.id && styles.optionTextSelected]}>
                {item.nameEs}
              </Text>
              {selected === item.id && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          )}
        />

        <Button label="Continuar →" onPress={handleContinue} loading={saving} disabled={!selected} style={styles.btn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { paddingTop: 20, paddingBottom: 16, gap: 6 },
  step: { fontFamily: font.semibold, fontSize: 10, letterSpacing: 2, color: colors.textTertiary },
  title: { fontFamily: font.serif, fontSize: 28, color: colors.text, lineHeight: 34 },
  sub: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
  list: { gap: 8, paddingBottom: 16 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  optionSelected: { borderColor: colors.accent, backgroundColor: colors.bgAccentLight },
  icon: { fontSize: 18 },
  optionText: { flex: 1, fontFamily: font.medium, fontSize: 14, color: colors.textSecondary },
  optionTextSelected: { color: colors.text },
  check: { fontSize: 14, color: colors.accent },
  btn: { marginBottom: 16 },
});
