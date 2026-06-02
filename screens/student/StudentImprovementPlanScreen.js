import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLoader from '../../components/ScreenLoader';
import { getStudentRecords } from '../../storage/attendanceStorage';
import {
  estimateClassesToReachTarget,
  getStudentAttendanceAlert,
} from '../../utils/attendanceUtils';

const TARGETS = [65, 70, 75];

function formatClassesNeeded(count) {
  if (count === 0) {
    return 'Already at or above this goal';
  }
  if (count === 1) {
    return '1 more class';
  }
  return `${count} more classes`;
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
      <View style={styles.hero}>
        <Ionicons name="school" size={28} color="#0D47A1" />
        <Text style={styles.heroTitle}>Improvement Plan</Text>
        <Text style={styles.heroSubtitle}>{user.name}</Text>
      </View>

      <View style={styles.currentCard}>
        <Text style={styles.currentLabel}>Current Attendance</Text>
        <Text style={styles.currentValue}>{percentage}%</Text>
        <Text style={styles.currentMeta}>
          Present: {present} / {totalClasses} classes
        </Text>
      </View>

      {alert ? (
        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>Quote of the Day</Text>
          <Text style={styles.quoteText}>&ldquo;{alert.quote}&rdquo;</Text>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Estimated classes needed</Text>
      <Text style={styles.sectionHint}>
        Based on attending upcoming classes without additional absences.
      </Text>

      {TARGETS.map((target) => {
        const needed = estimateClassesToReachTarget(present, totalClasses, target);
        return (
          <View key={target} style={styles.targetCard}>
            <View style={styles.targetHeader}>
              <Ionicons name="flag" size={20} color="#1565C0" />
              <Text style={styles.targetTitle}>Reach {target}%</Text>
            </View>
            <Text style={styles.targetValue}>{formatClassesNeeded(needed)}</Text>
          </View>
        );
      })}

      <View style={styles.recommendation}>
        <Ionicons name="information-circle" size={22} color="#1565C0" />
        <Text style={styles.recommendationText}>
          Attend upcoming classes regularly to improve your attendance.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF3FF' },
  content: { padding: 16, paddingBottom: 28 },
  hero: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  heroTitle: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '800',
    color: '#0D47A1',
  },
  heroSubtitle: {
    marginTop: 4,
    color: '#546E7A',
    fontWeight: '600',
  },
  currentCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#1565C0',
    elevation: 2,
  },
  currentLabel: {
    fontSize: 13,
    color: '#78909C',
    fontWeight: '600',
  },
  currentValue: {
    marginTop: 6,
    fontSize: 32,
    fontWeight: '800',
    color: '#0D47A1',
  },
  currentMeta: {
    marginTop: 6,
    color: '#546E7A',
    fontWeight: '600',
  },
  quoteCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  quoteLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78909C',
    marginBottom: 6,
  },
  quoteText: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#37474F',
    lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D47A1',
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 13,
    color: '#78909C',
    fontWeight: '600',
    marginBottom: 10,
  },
  targetCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  targetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  targetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1565C0',
  },
  targetValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#37474F',
    marginLeft: 28,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0D47A1',
    lineHeight: 20,
  },
});
