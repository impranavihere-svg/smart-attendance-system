import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cardShadow, colors, radii, spacing } from '../utils/theme';

export default function WelcomeHeader({
  title,
  subtitle,
  meta,
  icon = 'sparkles',
  accent = colors.primary,
}) {
  return (
    <View style={[styles.card, cardShadow(accent)]}>
      <View style={[styles.iconWrap, { backgroundColor: `${accent}18` }]}>
        <Ionicons name={icon} size={26} color={accent} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 28,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSoft,
  },
});
