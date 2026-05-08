import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font } from '../../theme';

interface Props { icon?: string; title: string; subtitle?: string; }

export function EmptyState({ icon = '🗳', title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 8 },
  icon: { fontSize: 40, marginBottom: 8 },
  title: { fontFamily: font.semibold, fontSize: 16, color: colors.text, textAlign: 'center' },
  subtitle: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
