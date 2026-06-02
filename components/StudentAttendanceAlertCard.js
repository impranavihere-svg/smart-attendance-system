import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';

const TIER_STYLES = {
  caution: {
    card: { backgroundColor: '#FFF8E1', borderColor: '#FFE082' },
    icon: '#F9A825',
    title: '#F57F17',
    quote: '#5D4037',
    percentage: '#E65100',
  },
  warning: {
    card: { backgroundColor: '#FFF3E0', borderColor: '#FFCC80' },
    icon: '#EF6C00',
    title: '#E65100',
    quote: '#4E342E',
    percentage: '#BF360C',
  },
  critical: {
    card: { backgroundColor: '#FFEBEE', borderColor: '#EF9A9A' },
    icon: '#C62828',
    title: '#C62828',
    quote: '#4E342E',
    percentage: '#B71C1C',
  },
};

export default function StudentAttendanceAlertCard({ alert, percentage, onViewPlan }) {
  const theme = TIER_STYLES[alert.tier];

  return (
    <View style={[styles.card, theme.card]}>
      <View style={styles.header}>
        <Ionicons name="alert-circle" size={22} color={theme.icon} />
        <Text style={[styles.title, { color: theme.title }]}>{alert.title}</Text>
      </View>
      <Text style={[styles.percentage, { color: theme.percentage }]}>
        Current attendance: {percentage}%
      </Text>
      <Text style={[styles.quoteLabel, { color: theme.title }]}>Quote of the Day</Text>
      <Text style={[styles.quote, { color: theme.quote }]}>&ldquo;{alert.quote}&rdquo;</Text>
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
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  quoteLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  quote: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 21,
    marginBottom: 4,
  },
});
