import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';
import QuoteOfTheDayCard from './QuoteOfTheDayCard';
import { cardShadow, colors, radii, spacing } from '../utils/theme';

const TIER_STYLES = {
  caution: {
    card: { backgroundColor: '#FFFDF5', borderColor: '#FFE082' },
    icon: colors.warning,
    title: '#F57F17',
    accent: colors.warning,
  },
  warning: {
    card: { backgroundColor: '#FFF8F0', borderColor: '#FFCC80' },
    icon: '#EF6C00',
    title: '#E65100',
    accent: '#EF6C00',
  },
  critical: {
    card: { backgroundColor: '#FFF5F5', borderColor: '#EF9A9A' },
    icon: colors.danger,
    title: colors.danger,
    accent: colors.danger,
  },
};

export default function StudentAttendanceAlertCard({ alert, percentage, onViewPlan }) {
  const theme = TIER_STYLES[alert.tier];

  return (
    <View style={[styles.card, theme.card, cardShadow(theme.accent)]}>
      <View style={styles.header}>
        <Ionicons name="alert-circle" size={24} color={theme.icon} />
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.title }]}>{alert.title}</Text>
          <Text style={[styles.percentage, { color: theme.title }]}>
            Current attendance: {percentage}%
          </Text>
        </View>
      </View>

      <QuoteOfTheDayCard quote={alert.quote} accent={theme.accent} />

      <PrimaryButton
        title="View Improvement Plan"
        icon="trending-up"
        onPress={onViewPlan}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    padding: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
  },
  percentage: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
  },
});
