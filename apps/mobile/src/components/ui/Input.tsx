import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius, font } from '../../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        style={[styles.input, focused && styles.focused, error && styles.error, style]}
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.accent}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontFamily: font.medium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.3 },
  input: {
    backgroundColor: colors.bgInput,
    borderWidth: 1, borderColor: colors.borderInput,
    borderRadius: radius.md,
    padding: 14, fontSize: 14,
    fontFamily: font.regular, color: colors.text,
  },
  focused: { borderColor: colors.accent },
  error: { borderColor: colors.danger },
  errorText: { fontFamily: font.regular, fontSize: 11, color: colors.danger },
});
