import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ANIMALS } from '../../utils/format';

interface Props { animalSlug: string; colorHex?: string; size?: number; }

export function AvatarDisplay({ animalSlug, colorHex = '#151a05', size = 44 }: Props) {
  const emoji = ANIMALS[animalSlug] ?? '🦊';
  const fontSize = size * 0.45;
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: colorHex }]}>
      <Text style={{ fontSize }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#c8f13530' },
});
