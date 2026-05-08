import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function usePollEligibility(pollId: string) {
  return useQuery({
    queryKey: ['eligibility', pollId],
    queryFn: () => api.get(`/polls/${pollId}/eligibility`).then(r => r.data),
    staleTime: 0, // Siempre fresco
    retry: false,
  });
}
