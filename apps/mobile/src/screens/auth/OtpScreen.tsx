import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../../components/ui/Button';
import { colors, font, radius } from '../../theme';

type Props = { navigation: NativeStackNavigationProp<any>; route: any };

export function OtpScreen({ navigation, route }: Props) {
  const { contact } = route.params as { contact: string };
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputs = useRef<TextInput[]>([]);
  const { verifyOtp, requestOtp, loading, error, clearError, isAuthenticated, isNewUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({ index: 0, routes: [{ name: isNewUser ? 'Setup' : 'Main' }] });
    }
  }, [isAuthenticated]);

  const handleDigit = (text: string, index: number) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) inputs.current[index + 1]?.focus();
    if (index === 5 && digit) {
      const otp = next.join('');
      if (otp.length === 6) handleVerify(otp);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otp?: string) => {
    clearError();
    const code = otp ?? digits.join('');
    await verifyOtp(contact, code);
  };

  const handleResend = async () => {
    setDigits(['', '', '', '', '', '']);
    clearError();
    await requestOtp(contact);
  };

  const filled = digits.filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Atrás</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Ingresa tu{'\n'}código</Text>
          <Text style={styles.sub}>
            Enviamos un código a{'\n'}
            <Text style={styles.email}>{contact}</Text>
          </Text>

          <View style={styles.boxes}>
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={r => { if (r) inputs.current[i] = r; }}
                style={[styles.box, d ? styles.boxFilled : null, error ? styles.boxError : null]}
                value={d}
                onChangeText={t => handleDigit(t, i)}
                onKeyPress={e => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                selectionColor={colors.accent}
                textAlign="center"
              />
            ))}
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resend}>¿No llegó el código? <Text style={styles.resendLink}>Reenviar</Text></Text>
          </TouchableOpacity>
        </View>

        <Button
          label="Verificar"
          onPress={() => handleVerify()}
          loading={loading}
          disabled={filled < 6}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, paddingHorizontal: 24, paddingBottom: 24 },
  back: { paddingTop: 12, paddingBottom: 24 },
  backText: { fontFamily: font.regular, fontSize: 13, color: colors.textTertiary },
  content: { flex: 1, gap: 16 },
  title: { fontFamily: font.serif, fontSize: 32, color: colors.text, lineHeight: 38 },
  sub: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  email: { fontFamily: font.semibold, color: colors.text },
  boxes: { flexDirection: 'row', gap: 8, marginTop: 8 },
  box: {
    flex: 1, height: 56, borderRadius: radius.md,
    backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.borderInput,
    fontSize: 20, fontFamily: font.semibold, color: colors.text,
  },
  boxFilled: { borderColor: colors.accent, color: colors.accent },
  boxError: { borderColor: colors.danger },
  error: { fontFamily: font.regular, fontSize: 12, color: colors.danger },
  resend: { fontFamily: font.regular, fontSize: 12, color: colors.textTertiary },
  resendLink: { color: colors.accent },
});
