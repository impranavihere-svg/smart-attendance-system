import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cardShadow, colors, radii, spacing } from '../utils/theme';

export default function QuoteOfTheDayCard({ quote, accent = colors.secondary, footer = 'Attendance Coach' }) {
  return (
    <View style={[styles.card, cardShadow(accent)]}>
      <Text style={styles.emoji}>💡</Text>
      <Text style={[styles.label, { color: accent }]}>Quote of the Day</Text>
      <Text style={styles.quote}>&ldquo;{quote}&rdquo;</Text>
      {footer ? <Text style={styles.footer}>— {footer}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0F7FF',
    borderRadius: radii.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#D6E8FF',
    marginVertical: spacing.sm,
  },
  emoji: {
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: spacing.sm,
  },
  quote: {
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#37474F',
    lineHeight: 24,
  },
  footer: {
    marginTop: spacing.sm,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSoft,
  },
});
