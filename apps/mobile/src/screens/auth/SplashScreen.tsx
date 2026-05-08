import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, font, radius, spacing } from '../../theme';

type Props = { navigation: NativeStackNavigationProp<any> };

export function SplashScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>V</Text>
          </View>
          <Text style={styles.title}>VotAR</Text>
          <Text style={styles.subtitle}>Tu voz, tu anonimato</Text>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Comenzar →</Text>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            Plataforma de participación ciudadana simbólica.{'\n'}
            Tus datos personales nunca se vinculan a tu voto.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, paddingHorizontal: 32, justifyContent: 'space-between', paddingTop: 60, paddingBottom: 32 },
  logoWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  logo: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: { fontFamily: font.serif, fontSize: 36, color: colors.accentDark },
  title: { fontFamily: font.serif, fontSize: 48, color: colors.text, letterSpacing: -1 },
  subtitle: { fontFamily: font.regular, fontSize: 14, color: colors.textSecondary },
  bottom: { gap: 16 },
  primaryBtn: {
    backgroundColor: colors.accent, borderRadius: radius.lg,
    padding: 16, alignItems: 'center',
  },
  primaryBtnText: { fontFamily: font.semibold, fontSize: 15, color: colors.accentDark },
  disclaimer: { fontFamily: font.regular, fontSize: 11, color: colors.textTertiary, textAlign: 'center', lineHeight: 16 },
});
