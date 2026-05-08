import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserStore } from '../../store/user.store';
import { PollCard } from '../../components/polls/PollCard';
import { AvatarDisplay } from '../../components/avatar/AvatarDisplay';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { colors, font } from '../../theme';
import api from '../../services/api';

type Props = { navigation: NativeStackNavigationProp<any> };

export function HomeScreen({ navigation }: Props) {
  const { profile, fetchProfile } = useUserStore();

  useEffect(() => { fetchProfile(); }, []);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['polls', 'ACTIVE'],
    queryFn: () => api.get('/polls?status=ACTIVE').then(r => r.data.data),
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={data ?? []}
        keyExtractor={(i: any) => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{greeting()},</Text>
              <Text style={styles.nickname}>
                {profile?.avatar ? `${profile.avatar.nickname}` : 'ciudadano'}
              </Text>
            </View>
            {profile?.avatar && (
              <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
                <AvatarDisplay
                  animalSlug={profile.avatar!.animalSlug}
                  colorHex={profile.avatar!.colorHex}
                  size={40}
                />
              </TouchableOpacity>
            )}
          </View>
        }
        ListEmptyComponent={
          isLoading
            ? <LoadingSpinner />
            : <EmptyState icon="🗳" title="Sin votaciones activas" subtitle="Vuelve pronto para participar" />
        }
        renderItem={({ item }: any) => (
          <PollCard
            poll={item}
            onPress={() => navigation.navigate('PollDetail', { pollId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingBottom: 20 },
  greeting: { fontFamily: font.regular, fontSize: 12, color: colors.textTertiary },
  nickname: { fontFamily: font.serif, fontSize: 22, color: colors.text },
});
