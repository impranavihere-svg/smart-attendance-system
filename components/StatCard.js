import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cardShadow, colors, radii } from '../utils/theme';

const VARIANTS = {
  primary: { accent: colors.primary, bg: '#E3F2FD' },
  secondary: { accent: colors.secondary, bg: '#E1F5FE' },
  success: { accent: colors.success, bg: '#E8F5E9' },
  warning: { accent: colors.warning, bg: '#FFF8E1' },
  danger: { accent: colors.danger, bg: '#FFEBEE' },
  teal: { accent: '#00838F', bg: '#E0F7FA' },
  purple: { accent: '#6A1B9A', bg: '#F3E5F5' },
};

export default function StatCard({
  title,
  value,
  icon,
  emoji,
  accent,
  variant = 'primary',
  large = false,
}) {
  const theme = VARIANTS[variant] || VARIANTS.primary;
  const tone = accent ? { accent, bg: `${accent}18` } : theme;

  return (
    <View style={[styles.card, cardShadow(tone.accent)]}>
      <View style={[styles.iconWrap, { backgroundColor: tone.bg }]}>
        {emoji ? (
          <Text style={styles.emoji}>{emoji}</Text>
        ) : (
          <Ionicons name={icon} size={22} color={tone.accent} />
        )}
      </View>
      <Text style={[styles.value, large && styles.valueLarge, { color: tone.accent }]}>
        {value}
      </Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: 16,
    margin: 6,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 22,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
  },
  valueLarge: {
    fontSize: 28,
  },
  title: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    lineHeight: 16,
  },
});
