import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function useOfficials() {
  return useQuery({
    queryKey: ['officials'],
    queryFn: () => api.get('/officials').then(r => r.data),
    staleTime: 60_000,
  });
}

export function useOfficial(id: string) {
  return useQuery({
    queryKey: ['official', id],
    queryFn: () => api.get(`/officials/${id}`).then(r => r.data),
    enabled: !!id,
  });
}
