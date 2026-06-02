import React from 'react';
import { StyleSheet, View } from 'react-native';
import { cardShadow, colors, radii, spacing } from '../utils/theme';

export default function PremiumCard({ children, style, shadowAccent = colors.primary }) {
  return <View style={[styles.card, cardShadow(shadowAccent), style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
});
