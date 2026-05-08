import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, font } from '../../theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        isPrimary && styles.primary,
        isDanger && styles.danger,
        variant === 'ghost' && styles.ghost,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={isPrimary ? colors.accentDark : colors.accent} size="small" />
        : <Text style={[styles.label, isPrimary && styles.labelPrimary, isDanger && styles.labelDanger]}>
            {label}
          </Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.lg, padding: 15, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.accent },
  ghost: { borderWidth: 1, borderColor: colors.borderInput },
  danger: { backgroundColor: '#2a0a0a', borderWidth: 1, borderColor: '#4a1a1a' },
  disabled: { opacity: 0.4 },
  label: { fontFamily: font.semibold, fontSize: 14, color: colors.textSecondary },
  labelPrimary: { color: colors.accentDark },
  labelDanger: { color: colors.danger },
});
