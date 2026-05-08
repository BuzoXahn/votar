import * as SecureStore from 'expo-secure-store';

const KEYS = { ACCESS: 'votar_access', REFRESH: 'votar_refresh' } as const;

export async function saveTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync(KEYS.ACCESS, accessToken);
  await SecureStore.setItemAsync(KEYS.REFRESH, refreshToken);
}

export async function getTokens() {
  const accessToken = await SecureStore.getItemAsync(KEYS.ACCESS);
  const refreshToken = await SecureStore.getItemAsync(KEYS.REFRESH);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(KEYS.ACCESS);
  await SecureStore.deleteItemAsync(KEYS.REFRESH);
}
