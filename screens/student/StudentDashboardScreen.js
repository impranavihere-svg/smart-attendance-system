import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton';
import StatCard from '../../components/StatCard';
import ScreenLoader from '../../components/ScreenLoader';
import { getStudentRecords } from '../../storage/attendanceStorage';
import { logoutCurrentUser } from '../../storage/userStorage';
import StudentAttendanceAlertCard from '../../components/StudentAttendanceAlertCard';
import { getStudentAttendanceAlert, isLowAttendance } from '../../utils/attendanceUtils';

export default function StudentDashboardScreen({ navigation, route }) {
  const user = route.params?.user;
  const [student, setStudent] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { student: record, history } = await getStudentRecords(user.usn);
        setStudent(record);
        setHistoryCount(history.length);
        setLoading(false);
      })();
    }, [user])
  );

  async function handleLogout() {
    await logoutCurrentUser();
    navigation.replace('Home');
  }

  if (loading) return <ScreenLoader message="Loading student dashboard..." />;

  const percentage = student?.percentage ?? 0;
  const low = isLowAttendance(percentage);
  const attendanceAlert = getStudentAttendanceAlert(percentage);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.meta}>USN: {user.usn}</Text>
        <Text style={styles.meta}>Class: {user.classSection}</Text>
      </View>

      <View style={styles.row}>
        <StatCard title="Attendance %" value={`${percentage}%`} icon="stats-chart" />
        <StatCard title="History Entries" value={historyCount} icon="time" accent="#00838F" />
      </View>

      <View style={[styles.statusCard, low ? styles.low : styles.good]}>
        <Text style={styles.statusTitle}>Attendance Status</Text>
        <Text style={styles.statusText}>
          {low ? 'Low Attendance Warning — below 75%' : 'Good Standing'}
        </Text>
      </View>

      {attendanceAlert ? (
        <StudentAttendanceAlertCard
          alert={attendanceAlert}
          percentage={percentage}
          onViewPlan={() =>
            navigation.navigate('StudentImprovementPlan', { user })
          }
        />
      ) : null}

      <View style={styles.navCard}>
        <PrimaryButton
          title="Mark Attendance"
          icon="checkmark-circle"
          onPress={() => navigation.navigate('StudentMarkAttendance', { user })}
        />
        <PrimaryButton
          title="View Personal Records"
          icon="document-text"
          onPress={() => navigation.navigate('StudentRecords', { user })}
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
  name: { fontSize: 20, fontWeight: '800', color: '#0D47A1' },
  meta: { marginTop: 4, color: '#546E7A', fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  statusCard: { borderRadius: 14, padding: 14, marginTop: 10, elevation: 2 },
  good: { backgroundColor: '#E8F5E9' },
  low: { backgroundColor: '#FFEBEE' },
  statusTitle: { fontWeight: '800', color: '#37474F' },
  statusText: { marginTop: 6, fontWeight: '700', color: '#0D47A1' },
  navCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    elevation: 2,
  },
});
