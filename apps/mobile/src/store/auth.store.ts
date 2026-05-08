import { create } from 'zustand';
import { saveTokens, clearTokens } from '../utils/storage';
import api from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  isNewUser: boolean;
  loading: boolean;
  error: string | null;
  requestOtp: (contact: string) => Promise<void>;
  verifyOtp: (contact: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isNewUser: false,
  loading: false,
  error: null,

  requestOtp: async (contact) => {
    set({ loading: true, error: null });
    try {
      await api.post('/auth/request-otp', { contact: contact.trim(), contactType: 'EMAIL' });
    } catch (e: any) {
      set({ error: e.response?.data?.message ?? 'Error al enviar el código' });
    } finally {
      set({ loading: false });
    }
  },

  verifyOtp: async (contact, otp) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/verify-otp', { contact: contact.trim(), otp });
      await saveTokens(data.accessToken, data.refreshToken);
      set({ isAuthenticated: true, isNewUser: data.isNewUser });
    } catch (e: any) {
      set({ error: e.response?.data?.message ?? 'Código incorrecto' });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await clearTokens();
    set({ isAuthenticated: false, isNewUser: false });
  },

  clearError: () => set({ error: null }),
}));
