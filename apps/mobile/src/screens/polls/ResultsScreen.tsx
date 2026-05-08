import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ResultBar } from '../../components/charts/ResultBar';
import { colors, font, radius } from '../../theme';
import { formatNumber } from '../../utils/format';
import api from '../../services/api';

type Props = { navigation: NativeStackNavigationProp<any>; route: any };

export function ResultsScreen({ navigation, route }: Props) {
  const { pollId } = route.params;
  const [tab, setTab] = useState<'general' | 'profession'>('general');

  const { data, isLoading } = useQuery({
    queryKey: ['results', pollId],
    queryFn: () => api.get(`/polls/${pollId}/results`).then(r => r.data),
    refetchInterval: 15000, // Actualiza cada 15s
  });

  if (isLoading) return <LoadingSpinner full />;
  if (!data) return null;

  const topOption = data.options.reduce((a: any, b: any) => a.count > b.count ? a : b, data.options[0]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Detalle</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{data.pollTitle}</Text>

        {/* Totales */}
        <View style={styles.totalBox}>
          <Text style={styles.totalNum}>{formatNumber(data.total)}</Text>
          <Text style={styles.totalLabel}>votos totales</Text>
          {data.total > 0 && (
            <View style={styles.leadingBadge}>
              <Text style={styles.leadingText}>Va ganando: {topOption.text}</Text>
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'general' && styles.tabActive]}
            onPress={() => setTab('general')}
          >
            <Text style={[styles.tabText, tab === 'general' && styles.tabTextActive]}>General</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'profession' && styles.tabActive]}
            onPress={() => setTab('profession')}
          >
            <Text style={[styles.tabText, tab === 'profession' && styles.tabTextActive]}>Por profesión</Text>
          </TouchableOpacity>
        </View>

        {/* General */}
        {tab === 'general' && (
          <View style={styles.section}>
            {data.options.map((opt: any, i: number) => (
              <ResultBar
                key={opt.optionId}
                label={opt.text}
                count={opt.count}
                total={data.total}
                highlight={i === 0 && opt.count === topOption.count}
              />
            ))}
          </View>
        )}

        {/* Por profesión */}
        {tab === 'profession' && (
          <View style={styles.section}>
            {data.byProfession.length === 0 ? (
              <Text style={styles.emptyProf}>Aún no hay suficientes datos por profesión.</Text>
            ) : data.byProfession.map((prof: any) => (
              <View key={prof.professionId} style={styles.profBlock}>
                <Text style={styles.profName}>{prof.professionName}</Text>
                <Text style={styles.profTotal}>{formatNumber(prof.total)} votos</Text>
                {prof.options.map((opt: any) => (
                  <ResultBar
                    key={opt.optionId}
                    label={opt.text}
                    count={opt.count}
                    total={prof.total}
                    highlight={opt.count === Math.max(...prof.options.map((o: any) => o.count))}
                  />
                ))}
              </View>
            ))}
          </View>
        )}

        <Text style={styles.disclaimer}>
          Resultados simbólicos · No vinculantes · Actualización cada 15 seg
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  back: { paddingTop: 12 },
  backText: { fontFamily: font.regular, fontSize: 13, color: colors.textTertiary },
  title: { fontFamily: font.serif, fontSize: 22, color: colors.text, lineHeight: 28 },
  totalBox: { backgroundColor: colors.bgCard, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 20, alignItems: 'center', gap: 4 },
  totalNum: { fontFamily: font.serif, fontSize: 44, color: colors.accent, lineHeight: 52 },
  totalLabel: { fontFamily: font.regular, fontSize: 12, color: colors.textTertiary },
  leadingBadge: { backgroundColor: colors.bgAccentLight, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 4, marginTop: 6 },
  leadingText: { fontFamily: font.medium, fontSize: 11, color: colors.accent },
  tabs: { flexDirection: 'row', backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radius.sm - 2 },
  tabActive: { backgroundColor: colors.bgAccentLight },
  tabText: { fontFamily: font.medium, fontSize: 13, color: colors.textTertiary },
  tabTextActive: { color: colors.accent },
  section: { gap: 4 },
  profBlock: { backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 8, gap: 4 },
  profName: { fontFamily: font.semibold, fontSize: 13, color: colors.text, marginBottom: 2 },
  profTotal: { fontFamily: font.regular, fontSize: 10, color: colors.textTertiary, marginBottom: 8 },
  emptyProf: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, textAlign: 'center', paddingVertical: 24 },
  disclaimer: { fontFamily: font.regular, fontSize: 10, color: colors.textTertiary, textAlign: 'center' },
});
