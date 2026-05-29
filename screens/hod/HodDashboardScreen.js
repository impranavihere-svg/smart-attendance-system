import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';
import StatCard from '../../components/StatCard';
import ScreenLoader from '../../components/ScreenLoader';
import { getHodDashboardData } from '../../storage/attendanceStorage';
import { getActiveSessions } from '../../storage/sessionStorage';
import { logoutCurrentUser } from '../../storage/userStorage';
import { getDepartmentStats } from '../../utils/analyticsUtils';

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
      <View style={styles.header}>
        <Ionicons name="business" size={36} color="#0D47A1" />
        <Text style={styles.title}>HOD Dashboard</Text>
        <Text style={styles.sub}>{user?.name} • {user?.department}</Text>
      </View>

      <View style={styles.row}>
        <StatCard title="Total Students" value={stats.totalStudents} icon="people" />
        <StatCard title="Total Faculty" value={stats.totalFaculty} icon="person" accent="#1976D2" />
      </View>
      <View style={styles.row}>
        <StatCard title="Dept Attendance" value={`${stats.departmentAttendancePercentage}%`} icon="stats-chart" accent="#00838F" />
        <StatCard title="Low Attendance" value={stats.lowAttendanceCount} icon="warning" accent="#C62828" />
      </View>
      <StatCard title="Active Sessions" value={stats.activeSessions} icon="time" accent="#6A1B9A" />

      <View style={styles.navCard}>
        <PrimaryButton title="View All Students" icon="list" onPress={() => navigation.navigate('HodStudents', { user })} />
        <PrimaryButton title="View All Faculty" icon="people-circle" onPress={() => navigation.navigate('HodFaculty', { user })} />
        <PrimaryButton title="Department Analytics" icon="analytics" onPress={() => navigation.navigate('HodAnalytics', { user })} />
        <PrimaryButton title="Attendance Reports" icon="document-text" onPress={() => navigation.navigate('HodReports', { user })} />
        <PrimaryButton title="Low Attendance Alerts" icon="alert-circle" onPress={() => navigation.navigate('HodLowAttendance', { user })} />
        <PrimaryButton title="Faculty Management" icon="construct" onPress={() => navigation.navigate('HodFacultyManagement', { user })} />
        <PrimaryButton title="Campus Verification Logs" icon="shield-checkmark" onPress={() => navigation.navigate('HodVerificationLogs', { user })} />
        <PrimaryButton title="Logout" icon="log-out-outline" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF3FF' },
  content: { padding: 16, paddingBottom: 28 },
  header: { backgroundColor: '#FFF', borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 12, elevation: 2 },
  title: { marginTop: 8, fontSize: 22, fontWeight: '800', color: '#0D47A1' },
  sub: { marginTop: 4, color: '#546E7A', fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  navCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 14, marginTop: 12, elevation: 2 },
});
