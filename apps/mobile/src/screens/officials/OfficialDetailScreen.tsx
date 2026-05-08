import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { PollCard } from '../../components/polls/PollCard';
import { colors, font, radius } from '../../theme';
import api from '../../services/api';

type Props = { navigation: NativeStackNavigationProp<any>; route: any };

export function OfficialDetailScreen({ navigation, route }: Props) {
  const { officialId } = route.params;
  const { data: official, isLoading } = useQuery({
    queryKey: ['official', officialId],
    queryFn: () => api.get(`/officials/${officialId}`).then(r => r.data),
  });

  if (isLoading) return <LoadingSpinner full />;
  if (!official) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Funcionarios</Text>
        </TouchableOpacity>

        <View style={styles.profileBox}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{official.fullName?.charAt(0) ?? '?'}</Text>
          </View>
          <Text style={styles.name}>{official.fullName}</Text>
          <Text style={styles.position}>{official.position}</Text>
          <Text style={styles.institution}>{official.institution}</Text>
        </View>

        {official.bioSummary && (
          <View style={styles.bioBox}>
            <Text style={styles.sectionLabel}>BIOGRAFÍA</Text>
            <Text style={styles.bio}>{official.bioSummary}</Text>
          </View>
        )}

        {official.relatedPolls?.length > 0 && (
          <View style={styles.pollsSection}>
            <Text style={styles.sectionLabel}>VOTACIONES RELACIONADAS</Text>
            {official.relatedPolls.map((poll: any) => (
              <PollCard
                key={poll.id}
                poll={{ ...poll, totalVotes: 0, endsAt: poll.endsAt ?? new Date().toISOString(), status: poll.status ?? 'ACTIVE' }}
                onPress={() => navigation.navigate('PollDetail', { pollId: poll.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  back: { paddingTop: 12 },
  backText: { fontFamily: font.regular, fontSize: 13, color: colors.textTertiary },
  profileBox: { alignItems: 'center', gap: 6, paddingVertical: 8 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.bgAccentLight, borderWidth: 2, borderColor: colors.accent + '40', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: font.serif, fontSize: 32, color: colors.accent },
  name: { fontFamily: font.serif, fontSize: 22, color: colors.text, textAlign: 'center' },
  position: { fontFamily: font.medium, fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  institution: { fontFamily: font.regular, fontSize: 12, color: colors.textTertiary, textAlign: 'center' },
  bioBox: { backgroundColor: colors.bgCard, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 8 },
  sectionLabel: { fontFamily: font.semibold, fontSize: 10, letterSpacing: 2, color: colors.textTertiary },
  bio: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  pollsSection: { gap: 8 },
});
