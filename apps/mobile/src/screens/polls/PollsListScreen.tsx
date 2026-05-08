import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PollCard } from '../../components/polls/PollCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { colors, font, spacing } from '../../theme';
import api from '../../services/api';

type Props = { navigation: NativeStackNavigationProp<any> };

export function PollsListScreen({ navigation }: Props) {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['polls', 'ACTIVE'],
    queryFn: () => api.get('/polls?status=ACTIVE').then(r => r.data.data),
  });

  const renderItem = useCallback(({ item }: any) => (
    <PollCard poll={item} onPress={() => navigation.navigate('PollDetail', { pollId: item.id })} />
  ), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Votaciones{'\n'}activas</Text>
      </View>
      {isLoading ? (
        <LoadingSpinner full />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
          ListEmptyComponent={<EmptyState icon="🗳" title="No hay votaciones activas" subtitle="Vuelve más tarde para participar" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontFamily: font.serif, fontSize: 28, color: colors.text, lineHeight: 34 },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
});
