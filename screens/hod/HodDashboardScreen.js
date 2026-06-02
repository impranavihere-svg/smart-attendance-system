import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton';
import PremiumCard from '../../components/PremiumCard';
import StatCard from '../../components/StatCard';
import ScreenLoader from '../../components/ScreenLoader';
import WelcomeHeader from '../../components/WelcomeHeader';
import { getHodDashboardData } from '../../storage/attendanceStorage';
import { getActiveSessions } from '../../storage/sessionStorage';
import { logoutCurrentUser } from '../../storage/userStorage';
import { getDepartmentStats } from '../../utils/analyticsUtils';
import { colors, spacing } from '../../utils/theme';

export default function HodDashboardScreen({ navigation, route }) {
  const user = route.params?.user;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const loadData = useCallback(async () => {
    const [data, activeSessions] = await Promise.all([
      getHodDashboardData(),
      getActiveSessions(),
    ]);
    const dept = getDepartmentStats(data.students);
    setStats({
      ...dept,
      totalFaculty: data.faculty.length,
      activeSessions: activeSessions.length,
    });
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData])
  );

  async function handleLogout() {
    await logoutCurrentUser();
    navigation.replace('Home');
  }

  if (loading || !stats) {
    return <ScreenLoader message="Loading HOD dashboard..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <WelcomeHeader
        title="Department Overview"
        subtitle={user?.name}
        meta={user?.department}
        icon="business"
        accent={colors.primary}
      />

      <View style={styles.row}>
        <StatCard title="Total Students" value={stats.totalStudents} icon="people" variant="primary" large />
        <StatCard title="Total Faculty" value={stats.totalFaculty} icon="person" variant="secondary" large />
      </View>
      <View style={styles.row}>
        <StatCard
          title="Dept Attendance"
          value={`${stats.departmentAttendancePercentage}%`}
          icon="stats-chart"
          variant="teal"
          large
        />
        <StatCard
          title="Low Attendance"
          value={stats.lowAttendanceCount}
          icon="warning"
          variant="danger"
          large
        />
      </View>
      <StatCard
        title="Active Sessions"
        value={stats.activeSessions}
        icon="time"
        variant="purple"
        large
      />

      <PremiumCard style={styles.navCard}>
        <Text style={styles.navTitle}>Department Controls</Text>
        <PrimaryButton title="View All Students" icon="list" onPress={() => navigation.navigate('HodStudents', { user })} />
        <PrimaryButton title="View All Faculty" icon="people-circle" onPress={() => navigation.navigate('HodFaculty', { user })} />
        <PrimaryButton title="Department Analytics" icon="analytics" onPress={() => navigation.navigate('HodAnalytics', { user })} />
        <PrimaryButton title="Attendance Reports" icon="document-text" onPress={() => navigation.navigate('HodReports', { user })} />
        <PrimaryButton title="Low Attendance Alerts" icon="alert-circle" onPress={() => navigation.navigate('HodLowAttendance', { user })} />
        <PrimaryButton title="Faculty Management" icon="construct" onPress={() => navigation.navigate('HodFacultyManagement', { user })} />
        <PrimaryButton title="Campus Verification Logs" icon="shield-checkmark" onPress={() => navigation.navigate('HodVerificationLogs', { user })} />
        <PrimaryButton title="Logout" icon="log-out-outline" onPress={handleLogout} variant="danger" />
      </PremiumCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 32 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  navCard: { marginBottom: 0 },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
});
