import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton';
import PremiumCard from '../../components/PremiumCard';
import SessionCard from '../../components/SessionCard';
import StatCard from '../../components/StatCard';
import ScreenLoader from '../../components/ScreenLoader';
import WelcomeHeader from '../../components/WelcomeHeader';
import { getClassStats } from '../../utils/analyticsUtils';
import { logoutCurrentUser } from '../../storage/userStorage';
import { getActiveSessionForClass } from '../../storage/sessionStorage';
import { getAttendanceReport } from '../../storage/attendanceStorage';
import { colors, spacing } from '../../utils/theme';

export default function FacultyDashboardScreen({ navigation, route }) {
  const user = route.params?.user;
  const [loading, setLoading] = useState(true);
  const [classStats, setClassStats] = useState(null);
  const [activeSession, setActiveSession] = useState(null);

  const loadData = useCallback(async () => {
    const { report } = await getAttendanceReport();
    const classStudents = report.filter(
      (student) => student.classSection === user.assignedClass
    );
    setClassStats(getClassStats(classStudents, user.assignedClass));
    setActiveSession(await getActiveSessionForClass(user.assignedClass));
    setLoading(false);
  }, [user]);

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

  if (loading || !classStats) {
    return <ScreenLoader message="Loading faculty dashboard..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <WelcomeHeader
        title="Good Morning, Professor"
        subtitle={user.name}
        meta={`Assigned Class: ${user.assignedClass}`}
        icon="easel"
        accent={colors.primary}
      />

      <View style={styles.row}>
        <StatCard
          title="Class Students"
          value={classStats.totalStudents}
          icon="people"
          variant="primary"
          large
        />
        <StatCard
          title="Class Attendance"
          value={`${classStats.classAttendancePercentage}%`}
          icon="stats-chart"
          variant="teal"
          large
        />
      </View>

      <PremiumCard>
        <Text style={styles.section}>Active Session Status</Text>
        {activeSession ? (
          <SessionCard session={activeSession} />
        ) : (
          <Text style={styles.note}>No active session for your class.</Text>
        )}
      </PremiumCard>

      <PremiumCard style={styles.navCard}>
        <Text style={styles.navTitle}>Faculty Tools</Text>
        <PrimaryButton
          title="Create Attendance Session"
          icon="add-circle"
          onPress={() => navigation.navigate('FacultyCreateSession', { user })}
        />
        <PrimaryButton
          title="Take Substitute Class"
          icon="swap-horizontal"
          onPress={() => navigation.navigate('SubstituteFaculty', { user })}
        />
        <PrimaryButton
          title="View Assigned Students"
          icon="list"
          onPress={() => navigation.navigate('FacultyStudents', { user })}
        />
        <PrimaryButton
          title="Attendance Reports"
          icon="document-text"
          onPress={() => navigation.navigate('FacultyReports', { user })}
        />
        <PrimaryButton
          title="Low Attendance Students"
          icon="warning"
          onPress={() => navigation.navigate('FacultyLowAttendance', { user })}
        />
        <PrimaryButton
          title="Attendance Analytics"
          icon="analytics"
          onPress={() => navigation.navigate('FacultyAnalytics', { user })}
        />
        <PrimaryButton title="Logout" icon="log-out-outline" onPress={handleLogout} variant="danger" />
      </PremiumCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 32 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  section: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  note: { color: colors.textSoft, fontWeight: '600' },
  navCard: { marginBottom: 0 },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
});
