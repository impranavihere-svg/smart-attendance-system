import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AttendanceProgressRing from '../../components/AttendanceProgressRing';
import GoalProgressCard from '../../components/GoalProgressCard';
import PremiumCard from '../../components/PremiumCard';
import QuoteOfTheDayCard from '../../components/QuoteOfTheDayCard';
import ScreenLoader from '../../components/ScreenLoader';
import WelcomeHeader from '../../components/WelcomeHeader';
import { getStudentRecords } from '../../storage/attendanceStorage';
import {
  estimateClassesToReachTarget,
  getStudentAttendanceAlert,
} from '../../utils/attendanceUtils';
import { colors, spacing } from '../../utils/theme';

const TARGETS = [65, 70, 75];

function formatGoalStatus(count) {
  if (count === 0) {
    return 'Already achieved';
  }
  if (count === 1) {
    return '1 more class needed';
  }
  return `${count} more classes needed`;
}

export default function StudentImprovementPlanScreen({ route }) {
  const user = route.params?.user;
  const quoteParam = route.params?.quote;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { student: record } = await getStudentRecords(user.usn);
        setStudent(record);
        setLoading(false);
      })();
    }, [user])
  );

  if (loading) return <ScreenLoader message="Loading improvement plan..." />;

  const percentage = student?.percentage ?? 0;
  const present = student?.present ?? 0;
  const totalClasses = student?.totalClasses ?? 0;
  const alert = getStudentAttendanceAlert(percentage, quoteParam);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <WelcomeHeader
        title="Improvement Plan"
        subtitle={user.name}
        meta="Track your path to better attendance"
        icon="trending-up"
      />

      <PremiumCard>
        <Text style={styles.currentLabel}>Current Attendance</Text>
        <AttendanceProgressRing percentage={percentage} label="Overall" />
        <Text style={styles.currentMeta}>
          Present: {present} / {totalClasses} classes
        </Text>
      </PremiumCard>

      {alert ? <QuoteOfTheDayCard quote={alert.quote} accent={colors.primary} /> : null}

      <Text style={styles.sectionTitle}>Goal Progress</Text>
      <Text style={styles.sectionHint}>
        Based on attending upcoming classes without additional absences.
      </Text>

      {TARGETS.map((target) => {
        const needed = estimateClassesToReachTarget(present, totalClasses, target);
        return (
          <GoalProgressCard
            key={target}
            target={target}
            achieved={needed === 0}
            statusText={formatGoalStatus(needed)}
          />
        );
      })}

      <View style={styles.recommendation}>
        <Text style={styles.recommendationEmoji}>ℹ️</Text>
        <Text style={styles.recommendationText}>
          Attend upcoming classes regularly to improve your attendance.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 32 },
  currentLabel: {
    fontSize: 13,
    color: colors.textSoft,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  currentMeta: {
    marginTop: spacing.sm,
    textAlign: 'center',
    color: colors.textMuted,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 13,
    color: colors.textSoft,
    fontWeight: '600',
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#E3F2FD',
    borderRadius: 22,
    padding: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  recommendationEmoji: {
    fontSize: 18,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 20,
  },
});
