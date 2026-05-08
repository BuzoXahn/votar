import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font } from '../../theme';

interface Props { label: string; count: number; total: number; highlight?: boolean; }

export function ResultBar({ label, count, total, highlight = false }: Props) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.pct, highlight && styles.pctHighlight]}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, highlight && styles.fillHighlight, { width: `${pct}%` as any }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 5, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontFamily: font.regular, fontSize: 12, color: colors.text },
  pct: { fontFamily: font.semibold, fontSize: 12, color: colors.textSecondary },
  pctHighlight: { color: colors.accent },
  track: { height: 6, backgroundColor: colors.bgInput, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.borderInput, borderRadius: 3 },
  fillHighlight: { backgroundColor: colors.accent },
});
