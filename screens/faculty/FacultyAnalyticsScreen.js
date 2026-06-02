import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AnalyticsBar from '../../components/AnalyticsBar';
import PremiumCard from '../../components/PremiumCard';
import StatCard from '../../components/StatCard';
import TrendRow from '../../components/TrendRow';
import ScreenLoader from '../../components/ScreenLoader';
import WelcomeHeader from '../../components/WelcomeHeader';
import { getAttendanceReport } from '../../storage/attendanceStorage';
import {
  buildAttendanceTrend,
  getClassStats,
  getSessionStats,
} from '../../utils/analyticsUtils';
import { getSessionsByFaculty } from '../../storage/sessionStorage';
import { colors, spacing } from '../../utils/theme';

export default function FacultyAnalyticsScreen({ route }) {
  const user = route.params?.user;
  const [stats, setStats] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [recordCount, setRecordCount] = useState(0);
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
        setRecordCount(classLogs.length);
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
      <WelcomeHeader
        title="Class Analytics"
        subtitle={user.assignedClass}
        meta={`Instructor: ${user.name}`}
        icon="analytics"
      />

      <View style={styles.row}>
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          emoji="👨‍🎓"
          variant="primary"
          large
        />
        <StatCard
          title="Low Attendance Students"
          value={stats.lowAttendanceStudents.length}
          emoji="📉"
          variant="danger"
          large
        />
      </View>
      <View style={styles.row}>
        <StatCard
          title="Average Attendance"
          value={`${stats.classAttendancePercentage}%`}
          emoji="📈"
          variant="success"
          large
        />
        <StatCard
          title="Attendance Records"
          value={recordCount}
          emoji="📋"
          variant="secondary"
          large
        />
      </View>

      <PremiumCard>
        <AnalyticsBar label="Class Attendance %" value={stats.classAttendancePercentage} />
        <Text style={styles.meta}>
          Present: {stats.presentCount} • Absent marks: {stats.absentCount}
        </Text>
      </PremiumCard>

      <PremiumCard>
        <Text style={styles.section}>Session Statistics</Text>
        <Text style={styles.meta}>Total Sessions: {sessionStats.totalSessions}</Text>
        <Text style={styles.meta}>Active Sessions: {sessionStats.activeSessions}</Text>
        <Text style={styles.meta}>Attendance Marks: {sessionStats.totalMarks}</Text>
      </PremiumCard>

      <PremiumCard>
        <Text style={styles.section}>Attendance Trends</Text>
        {trends.map((item) => (
          <TrendRow key={item.label} label={item.label} count={item.count} />
        ))}
      </PremiumCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 32 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  section: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  meta: { color: colors.textMuted, fontWeight: '600', marginBottom: 6 },
});
