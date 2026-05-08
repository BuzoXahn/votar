import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, radius, font, spacing } from '../../theme';
import { Tag } from '../ui/Tag';
import { formatTimeLeft, formatNumber } from '../../utils/format';

interface Poll {
  id: string; title: string; category: string;
  endsAt: string; totalVotes: number; status: string;
}

export function PollCard({ poll, onPress }: { poll: Poll; onPress: () => void }) {
  const isActive = poll.status === 'ACTIVE';
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.card}>
      <View style={styles.top}>
        <Tag label={poll.category} />
        {isActive && <View style={styles.activeDot} />}
      </View>
      <Text style={styles.title}>{poll.title}</Text>
      <View style={styles.meta}>
        <Text style={styles.time}>{formatTimeLeft(poll.endsAt)}</Text>
        <Text style={styles.votes}>{formatNumber(poll.totalVotes)} votos</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: 8,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  title: { fontFamily: font.medium, fontSize: 14, color: colors.text, lineHeight: 20 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  time: { fontFamily: font.regular, fontSize: 11, color: colors.textTertiary },
  votes: { fontFamily: font.semibold, fontSize: 11, color: colors.accent },
});
