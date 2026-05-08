import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export function LoadingSpinner({ full = false }: { full?: boolean }) {
  return (
    <View style={[styles.container, full && styles.full]}>
      <ActivityIndicator color={colors.accent} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  full: { flex: 1 },
});
