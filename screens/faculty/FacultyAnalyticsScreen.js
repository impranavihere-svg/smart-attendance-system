import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AnalyticsBar from '../../components/AnalyticsBar';
import StatCard from '../../components/StatCard';
import TrendRow from '../../components/TrendRow';
import ScreenLoader from '../../components/ScreenLoader';
import { getAttendanceReport } from '../../storage/attendanceStorage';
import {
  buildAttendanceTrend,
  getClassStats,
  getSessionStats,
} from '../../utils/analyticsUtils';
import { getSessionsByFaculty } from '../../storage/sessionStorage';

export default function FacultyAnalyticsScreen({ route }) {
  const user = route.params?.user;
  const [stats, setStats] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { report, logs } = await getAttendanceReport();
        const classStudents = report.filter(
          (s) => s.classSection === user.assignedClass
        );
        const classLogs = logs.filter((log) =>
          classStudents.some((s) => s.usn === log.usn)
        );
        const sessions = await getSessionsByFaculty(user.id);

        setStats(getClassStats(classStudents, user.assignedClass));
        setSessionStats(getSessionStats(sessions, classLogs));
        setTrends(buildAttendanceTrend(classLogs));
        setLoading(false);
      })();
    }, [user])
  );

  if (loading || !stats || !sessionStats) {
    return <ScreenLoader message="Loading class analytics..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Class Analytics — {user.assignedClass}</Text>

      <View style={styles.row}>
        <StatCard title="Present Count" value={stats.presentCount} icon="checkmark-circle" accent="#2E7D32" />
        <StatCard title="Absent Count" value={stats.absentCount} icon="close-circle" accent="#C62828" />
      </View>

      <View style={styles.card}>
        <AnalyticsBar
          label="Class Attendance %"
          value={stats.classAttendancePercentage}
        />
        <Text style={styles.meta}>
          Low Attendance Students: {stats.lowAttendanceStudents.length}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Session Statistics</Text>
        <Text style={styles.meta}>Total Sessions: {sessionStats.totalSessions}</Text>
        <Text style={styles.meta}>Active Sessions: {sessionStats.activeSessions}</Text>
        <Text style={styles.meta}>Attendance Marks: {sessionStats.totalMarks}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Attendance Trends</Text>
        {trends.map((item) => (
          <TrendRow key={item.label} label={item.label} count={item.count} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF3FF' },
  content: { padding: 16, paddingBottom: 28 },
  title: { fontSize: 18, fontWeight: '800', color: '#0D47A1', marginBottom: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    elevation: 2,
  },
  section: { fontSize: 15, fontWeight: '800', color: '#0D47A1', marginBottom: 8 },
  meta: { color: '#546E7A', fontWeight: '600', marginBottom: 4 },
});
