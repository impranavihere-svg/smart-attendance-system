import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton';
import SessionCard from '../../components/SessionCard';
import StatCard from '../../components/StatCard';
import ScreenLoader from '../../components/ScreenLoader';
import { getClassStats } from '../../utils/analyticsUtils';
import { logoutCurrentUser } from '../../storage/userStorage';
import {
  closeSession,
  createAttendanceSession,
  getActiveSessionForClass,
} from '../../storage/sessionStorage';
import { getAttendanceReport } from '../../storage/attendanceStorage';
import { SESSION_DURATION_OPTIONS } from '../../utils/constants';

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
      <View style={styles.header}>
        <Text style={styles.title}>{user.name}</Text>
        <Text style={styles.sub}>Assigned Class: {user.assignedClass}</Text>
      </View>

      <View style={styles.row}>
        <StatCard title="Class Students" value={classStats.totalStudents} icon="people" />
        <StatCard
          title="Class Attendance"
          value={`${classStats.classAttendancePercentage}%`}
          icon="stats-chart"
          accent="#00838F"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Active Session Status</Text>
        {activeSession ? (
          <SessionCard session={activeSession} />
        ) : (
          <Text style={styles.note}>No active session for your class.</Text>
        )}
      </View>

      <View style={styles.navCard}>
        <PrimaryButton
          title="Create Attendance Session"
          icon="add-circle"
          onPress={() => navigation.navigate('FacultyCreateSession', { user })}
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
        <PrimaryButton title="Logout" icon="log-out-outline" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF3FF' },
  content: { padding: 16, paddingBottom: 28 },
  header: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#0D47A1' },
  sub: { marginTop: 4, color: '#546E7A', fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    elevation: 2,
  },
  section: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D47A1',
    marginBottom: 8,
  },
  note: { color: '#78909C', fontWeight: '600' },
  navCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    elevation: 2,
  },
});
