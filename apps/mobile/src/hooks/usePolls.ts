import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '../services/api';

export function usePolls(status = 'ACTIVE') {
  return useQuery({
    queryKey: ['polls', status],
    queryFn: () => api.get(`/polls?status=${status}`).then(r => r.data.data),
    staleTime: 30_000,
  });
}

export function usePoll(id: string) {
  return useQuery({
    queryKey: ['poll', id],
    queryFn: () => api.get(`/polls/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function usePollResults(id: string) {
  return useQuery({
    queryKey: ['results', id],
    queryFn: () => api.get(`/polls/${id}/results`).then(r => r.data),
    enabled: !!id,
    refetchInterval: 15_000,
  });
}
