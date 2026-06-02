import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton';
import PremiumCard from '../../components/PremiumCard';
import StatCard from '../../components/StatCard';
import WelcomeHeader from '../../components/WelcomeHeader';
import { getAdminDashboardData } from '../../storage/attendanceStorage';
import { isLowAttendance } from '../../utils/attendanceUtils';
import { colors, spacing } from '../../utils/theme';

export default function AdminDashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEntries: 0,
    lowCount: 0,
    goodCount: 0,
    averageAttendance: 0,
  });

  const loadDashboard = useCallback(async () => {
    try {
      const data = await getAdminDashboardData();
      const lowCount = data.students.filter((s) =>
        isLowAttendance(s.percentage)
      ).length;
      const averageAttendance =
        data.students.length === 0
          ? 0
          : Number(
              (
                data.students.reduce((sum, s) => sum + (s.percentage ?? 0), 0) /
                data.students.length
              ).toFixed(1)
            );

      setStats({
        totalStudents: data.totalStudents,
        totalEntries: data.totalEntries,
        lowCount,
        goodCount: data.totalStudents - lowCount,
        averageAttendance,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadDashboard();
    }, [loadDashboard])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loaderText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <WelcomeHeader
        title="Admin Dashboard"
        subtitle="Smart Attendance Management"
        meta="System-wide analytics overview"
        icon="person-circle"
      />

      <View style={styles.statsRow}>
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          emoji="👨‍🎓"
          variant="primary"
          large
        />
        <StatCard
          title="Low Attendance Students"
          value={stats.lowCount}
          emoji="📉"
          variant="danger"
          large
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard
          title="Average Attendance"
          value={`${stats.averageAttendance}%`}
          emoji="📈"
          variant="success"
          large
        />
        <StatCard
          title="Attendance Records"
          value={stats.totalEntries}
          emoji="📋"
          variant="secondary"
          large
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard
          title="Good Attendance"
          value={stats.goodCount}
          icon="checkmark-circle"
          variant="success"
        />
      </View>

      <PremiumCard style={styles.navCard}>
        <Text style={styles.sectionTitle}>Quick Navigation</Text>
        <PrimaryButton
          title="Student List"
          icon="list"
          onPress={() => navigation.navigate('AdminStudentList')}
        />
        <PrimaryButton
          title="Attendance Reports"
          icon="document-text-outline"
          onPress={() => navigation.navigate('AdminAttendanceReport')}
        />
        <PrimaryButton
          title="Low Attendance Alerts"
          icon="warning-outline"
          onPress={() => navigation.navigate('AdminLowAttendance')}
        />
        <PrimaryButton
          title="Logout"
          icon="log-out-outline"
          onPress={() => navigation.replace('Home')}
          variant="danger"
        />
      </PremiumCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 32,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loaderText: {
    marginTop: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 4,
  },
  navCard: { marginBottom: 0 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
});
