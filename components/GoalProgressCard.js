import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cardShadow, colors, radii, spacing } from '../utils/theme';

const GOAL_CONFIG = {
  65: { emoji: '✓', icon: 'checkmark-circle', accent: colors.success },
  70: { emoji: '🎯', icon: 'flag', accent: colors.primary },
  75: { emoji: '🏆', icon: 'trophy', accent: colors.warning },
};

export default function GoalProgressCard({ target, statusText, achieved }) {
  const config = GOAL_CONFIG[target] || GOAL_CONFIG[70];
  const isAchieved = achieved === true;
  const accent = isAchieved ? colors.success : config.accent;
  const displayEmoji = isAchieved ? '✓' : config.emoji;

  return (
    <View style={[styles.card, cardShadow(accent)]}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: `${accent}14` }]}>
          <Text style={styles.emoji}>{displayEmoji}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>
            {displayEmoji} Reach {target}%
          </Text>
          <Text style={[styles.status, isAchieved && styles.statusAchieved]}>{statusText}</Text>
        </View>
        <Ionicons name={config.icon} size={22} color={accent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  status: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  statusAchieved: {
    color: colors.success,
    fontWeight: '700',
  },
});
