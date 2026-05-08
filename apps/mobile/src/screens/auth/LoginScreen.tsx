import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../store/auth.store';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { colors, font, spacing } from '../../theme';

type Props = { navigation: NativeStackNavigationProp<any> };

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const { requestOtp, loading, error, clearError } = useAuthStore();

  const handleContinue = async () => {
    if (!email.trim()) return;
    clearError();
    await requestOtp(email);
    if (!useAuthStore.getState().error) {
      navigation.navigate('Otp', { contact: email.trim() });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Atrás</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Ingresa tu{'\n'}correo</Text>
          <Text style={styles.sub}>
            Te enviaremos un código de verificación de 6 dígitos.{'\n'}
            No compartimos tu correo con nadie.
          </Text>

          <Input
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={error ?? undefined}
            style={styles.input}
          />
        </View>

        <Button
          label="Enviar código →"
          onPress={handleContinue}
          loading={loading}
          disabled={!email.trim()}
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
  content: { flex: 1, gap: 12 },
  title: { fontFamily: font.serif, fontSize: 32, color: colors.text, lineHeight: 38 },
  sub: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  input: { marginTop: 8 },
});
