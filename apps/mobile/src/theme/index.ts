export const colors = {
  bg: '#0f0f0d',
  bgCard: '#1a1a17',
  bgInput: '#1f1f1c',
  bgAccentLight: '#151a05',
  border: '#2a2a24',
  borderInput: '#2e2e28',
  borderAccent: '#2a3510',
  text: '#f0ede6',
  textSecondary: '#8b8a82',
  textTertiary: '#6b6a62',
  accent: '#c8f135',
  accentDark: '#0f0f0d',
  danger: '#e05252',
  success: '#4caf76',
  warning: '#e0a052',
} as const;

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
} as const;

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 999,
} as const;

export const font = {
  serif: 'DMSerifDisplay_400Regular',
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semibold: 'DMSans_700Bold',
} as const;