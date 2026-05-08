import { create } from 'zustand';
import api from '../services/api';

interface Avatar { animalSlug: string; colorHex: string; nickname: string; }
interface Profile { professionId: string | null; setupComplete: boolean; avatar: Avatar | null; }

interface UserState {
  profile: Profile | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfession: (professionId: string) => Promise<void>;
  updateAvatar: (avatar: Avatar) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  loading: false,

  fetchProfile: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/users/me');
      set({ profile: data });
    } catch {} finally {
      set({ loading: false });
    }
  },

  updateProfession: async (professionId) => {
    await api.put('/users/me/profession', { professionId });
    set(s => ({ profile: s.profile ? { ...s.profile, professionId } : null }));
  },

  updateAvatar: async (avatar) => {
    await api.put('/avatars/me', avatar);
    set(s => ({ profile: s.profile ? { ...s.profile, avatar } : null }));
  },
}));
