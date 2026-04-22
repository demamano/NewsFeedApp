export const colors = {
  bg: '#0B0F14',
  surface: '#121820',
  surfaceAlt: '#1B2430',
  border: '#24303E',
  text: '#E6EDF3',
  textMuted: '#8A97A8',
  accent: '#FF6600',
  accentDim: '#B34A00',
  danger: '#E5484D',
  success: '#30A46C',
  skeleton: '#1E2731',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 20 },
  meta: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  heading: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
};
