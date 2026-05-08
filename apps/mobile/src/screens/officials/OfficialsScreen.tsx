import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { colors, font, radius } from '../../theme';
import api from '../../services/api';

type Props = { navigation: NativeStackNavigationProp<any> };

const LEVEL_LABEL: Record<string, string> = {
  federal: 'Federal', estatal: 'Estatal', municipal: 'Municipal',
};

export function OfficialsScreen({ navigation }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['officials'],
    queryFn: () => api.get('/officials').then(r => r.data),
  });

  if (isLoading) return <LoadingSpinner full />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Funcionarios{'\n'}públicos</Text>
      </View>
      <FlatList
        data={data ?? []}
        keyExtractor={(i: any) => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="🏛️" title="Sin funcionarios" subtitle="Próximamente se agregarán más perfiles" />}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OfficialDetail', { officialId: item.id })}
            activeOpacity={0.75}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.fullName?.charAt(0) ?? '?'}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.pos}>{item.position}</Text>
              <Text style={styles.inst}>{item.institution}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{LEVEL_LABEL[item.level] ?? item.level}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontFamily: font.serif, fontSize: 28, color: colors.text, lineHeight: 34 },
  list: { paddingHorizontal: 20, paddingBottom: 32, gap: 8 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 14 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.bgAccentLight, borderWidth: 1, borderColor: colors.borderAccent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: font.serif, fontSize: 18, color: colors.accent },
  info: { flex: 1, gap: 2 },
  name: { fontFamily: font.semibold, fontSize: 14, color: colors.text },
  pos: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary },
  inst: { fontFamily: font.regular, fontSize: 11, color: colors.textTertiary },
  levelBadge: { backgroundColor: colors.bgInput, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  levelText: { fontFamily: font.medium, fontSize: 10, color: colors.textSecondary },
});
