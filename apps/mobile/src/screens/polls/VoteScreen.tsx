import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { colors, font, radius } from '../../theme';
import api from '../../services/api';

type Props = { navigation: NativeStackNavigationProp<any>; route: any };

export function VoteScreen({ navigation, route }: Props) {
  const { pollId, poll } = route.params;
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [ballotHash, setBallotHash] = useState('');
  const queryClient = useQueryClient();

  const handleVote = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      // Paso 1: Obtener token de elegibilidad
      const { data: eligData } = await api.get(`/polls/${pollId}/eligibility`);

      if (eligData.alreadyVoted) {
        Alert.alert('Ya votaste', 'Ya emitiste tu voto en esta votación.');
        navigation.navigate('Results', { pollId });
        return;
      }
      if (!eligData.eligible) {
        Alert.alert('No elegible', 'Completa tu perfil antes de votar.');
        return;
      }

      // Paso 2: Emitir voto (sin JWT, solo con el token)
      const { data: voteData } = await api.post(`/polls/${pollId}/vote`, {
        token: eligData.token,
        optionId: selected,
      });

      setBallotHash(voteData.ballotHash);
      setVoted(true);
      queryClient.invalidateQueries({ queryKey: ['poll', pollId] });
      queryClient.invalidateQueries({ queryKey: ['results', pollId] });
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message ?? 'No se pudo registrar el voto');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de confirmación
  if (voted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Voto registrado</Text>
          <Text style={styles.successSub}>Tu participación fue registrada de forma anónima.</Text>
          <View style={styles.hashBox}>
            <Text style={styles.hashLabel}>COMPROBANTE</Text>
            <Text style={styles.hash} numberOfLines={2}>{ballotHash}</Text>
            <Text style={styles.hashNote}>Guarda este código para verificar que tu voto existe en el sistema.</Text>
          </View>
          <Button
            label="Ver resultados →"
            onPress={() => navigation.replace('Results', { pollId })}
            style={styles.btn}
          />
          <Button
            label="Ir al inicio"
            variant="ghost"
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Detalle</Text>
        </TouchableOpacity>

        <Tag label={poll.category} />
        <Text style={styles.title}>{poll.title}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>ELIGE UNA OPCIÓN</Text>
        <View style={styles.options}>
          {poll.options.map((opt: any) => (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setSelected(opt.id)}
              activeOpacity={0.75}
              style={[styles.option, selected === opt.id && styles.optionSelected]}
            >
              <View style={[styles.radio, selected === opt.id && styles.radioSelected]} />
              <Text style={[styles.optionText, selected === opt.id && styles.optionTextSelected]}>
                {opt.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.anonBadge}>
          <Text style={styles.anonIcon}>🔒</Text>
          <Text style={styles.anonText}>
            Tu voto es completamente anónimo. Ni el equipo de VotAR puede saber qué elegiste.
          </Text>
        </View>

        <Button
          label="Confirmar voto →"
          onPress={handleVote}
          loading={loading}
          disabled={!selected}
          style={styles.btn}
        />
        <Button
          label="Cancelar"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { paddingHorizontal: 20, paddingBottom: 32, gap: 12 },
  back: { paddingTop: 12 },
  backText: { fontFamily: font.regular, fontSize: 13, color: colors.textTertiary },
  title: { fontFamily: font.serif, fontSize: 22, color: colors.text, lineHeight: 28 },
  divider: { height: 1, backgroundColor: colors.border },
  sectionLabel: { fontFamily: font.semibold, fontSize: 10, letterSpacing: 2, color: colors.textTertiary },
  options: { gap: 8 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 16,
  },
  optionSelected: { borderColor: colors.accent, backgroundColor: colors.bgAccentLight },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.borderInput },
  radioSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  optionText: { flex: 1, fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  optionTextSelected: { color: colors.text },
  anonBadge: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: colors.bgAccentLight, borderWidth: 1, borderColor: colors.borderAccent,
    borderRadius: radius.md, padding: 12,
  },
  anonIcon: { fontSize: 14 },
  anonText: { flex: 1, fontFamily: font.regular, fontSize: 12, color: '#8b9a5a', lineHeight: 18 },
  btn: { marginTop: 4 },
  // Success
  successContainer: { flex: 1, paddingHorizontal: 24, paddingBottom: 32, justifyContent: 'center', gap: 12 },
  successIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.bgAccentLight, borderWidth: 1, borderColor: colors.accent,
    textAlign: 'center', lineHeight: 64, fontSize: 24, color: colors.accent,
    alignSelf: 'center', marginBottom: 8,
  },
  successTitle: { fontFamily: font.serif, fontSize: 28, color: colors.text, textAlign: 'center' },
  successSub: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  hashBox: { backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 6 },
  hashLabel: { fontFamily: font.semibold, fontSize: 9, letterSpacing: 2, color: colors.textTertiary },
  hash: { fontFamily: font.regular, fontSize: 10, color: colors.accent, letterSpacing: 0.5 },
  hashNote: { fontFamily: font.regular, fontSize: 11, color: colors.textTertiary, lineHeight: 16 },
});
