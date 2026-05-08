import axios from 'axios';
import { getTokens, saveTokens, clearTokens } from '../utils/storage';

// Cambia esta URL si tu API corre en otro host/puerto
export const API_URL = 'http://192.168.68.111:3000/v1';

const api = axios.create({ baseURL: API_URL, timeout: 10000 });

// Adjunta el access token a cada request
api.interceptors.request.use(async config => {
  const tokens = await getTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// Si el token expiró (401), intenta renovar con el refresh token
api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const tokens = await getTokens();
        if (!tokens?.refreshToken) throw new Error('No refresh token');
        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: tokens.refreshToken });
        await saveTokens(res.data.accessToken, res.data.refreshToken);
        original.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(original);
      } catch {
        await clearTokens();
        // Navegará al login desde el store
      }
    }
    return Promise.reject(error);
  }
);

export default api;
