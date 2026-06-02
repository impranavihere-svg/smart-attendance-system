import { Platform } from 'react-native';

export const colors = {
  primary: '#1565C0',
  secondary: '#42A5F5',
  success: '#2E7D32',
  warning: '#F9A825',
  danger: '#C62828',
  background: '#F5F7FB',
  card: '#FFFFFF',
  text: '#1A237E',
  textMuted: '#607D8B',
  textSoft: '#78909C',
  border: '#E3E8F0',
};

export const radii = {
  card: 22,
  button: 16,
  pill: 999,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
};

export function cardShadow(accent = colors.primary) {
  return Platform.select({
    ios: {
      shadowColor: accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
    },
    android: { elevation: 4 },
    default: {},
  });
}

export function getAttendanceRingColor(percentage) {
  if (percentage >= 75) return colors.success;
  if (percentage >= 60) return colors.warning;
  return colors.danger;
}
