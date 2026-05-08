import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Tag } from '../../components/ui/Tag';
import { Button } from '../../components/ui/Button';
import { colors, font, radius, spacing } from '../../theme';
import { formatTimeLeft, formatNumber } from '../../utils/format';
import api from '../../services/api';

type Props = { navigation: NativeStackNavigationProp<any>; route: any };

export function PollDetailScreen({ navigation, route }: Props) {
  const { pollId } = route.params;

  const { data: poll, isLoading } = useQuery({
    queryKey: ['poll', pollId],
    queryFn: () => api.get(`/polls/${pollId}`).then(r => r.data),
  });

  if (isLoading) return <LoadingSpinner full />;
  if (!poll) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Votaciones</Text>
        </TouchableOpacity>

        <Tag label={poll.category} />
        <Text style={styles.title}>{poll.title}</Text>
        <Text style={styles.desc}>{poll.description}</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatNumber(poll.totalVotes)}</Text>
            <Text style={styles.statLabel}>votos</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatTimeLeft(poll.endsAt)}</Text>
            <Text style={styles.statLabel}>tiempo restante</Text>
          </View>
        </View>

        {poll.officialLinks?.length > 0 && (
          <View style={styles.officialsSection}>
            <Text style={styles.sectionLabel}>FUNCIONARIOS RELACIONADOS</Text>
            {poll.officialLinks.map((link: any) => (
              <TouchableOpacity
                key={link.official.id}
                style={styles.officialRow}
                onPress={() => navigation.navigate('OfficialDetail', { officialId: link.official.id })}
              >
                <View>
                  <Text style={styles.officialName}>{link.official.fullName}</Text>
                  <Text style={styles.officialPos}>{link.official.position}</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Button
            label="Ver resultados"
            variant="ghost"
            onPress={() => navigation.navigate('Results', { pollId })}
          />
          <Button
            label="Votar →"
            onPress={() => navigation.navigate('Vote', { pollId, poll })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { paddingHorizontal: 20, paddingBottom: 32, gap: 12 },
  back: { paddingTop: 12 },
  backText: { fontFamily: font.regular, fontSize: 13, color: colors.textTertiary },
  title: { fontFamily: font.serif, fontSize: 26, color: colors.text, lineHeight: 32 },
  desc: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  stats: { flexDirection: 'row', backgroundColor: colors.bgCard, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16, alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontFamily: font.semibold, fontSize: 14, color: colors.text },
  statLabel: { fontFamily: font.regular, fontSize: 10, color: colors.textTertiary },
  divider: { width: 1, height: 28, backgroundColor: colors.border },
  officialsSection: { gap: 8 },
  sectionLabel: { fontFamily: font.semibold, fontSize: 10, letterSpacing: 2, color: colors.textTertiary },
  officialRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 12 },
  officialName: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  officialPos: { fontFamily: font.regular, fontSize: 11, color: colors.textSecondary },
  arrow: { color: colors.textTertiary },
  actions: { gap: 8, marginTop: 8 },
});
