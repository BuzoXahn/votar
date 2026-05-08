import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, font } from '../../theme';

export function Tag({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: { alignSelf: 'flex-start', backgroundColor: colors.bgAccentLight, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  text: { fontFamily: font.semibold, fontSize: 9, letterSpacing: 1.5, color: colors.accent },
});