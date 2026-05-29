import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AnalyticsBar from '../../components/AnalyticsBar';
import StatCard from '../../components/StatCard';
import TrendRow from '../../components/TrendRow';
import ScreenLoader from '../../components/ScreenLoader';
import { getHodDashboardData } from '../../storage/attendanceStorage';
import {
  buildAttendanceTrend,
  getDepartmentStats,
} from '../../utils/analyticsUtils';

export default function HodAnalyticsScreen() {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getHodDashboardData();
        setStats(getDepartmentStats(data.students));
        setTrends(buildAttendanceTrend(data.logs));
        setLoading(false);
      })();
    }, [])
  );

  if (loading || !stats) return <ScreenLoader message="Loading analytics..." />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Department Analytics</Text>
      <View style={styles.row}>
        <StatCard title="Students" value={stats.totalStudents} icon="people" />
        <StatCard title="Low Attendance" value={stats.lowAttendanceCount} icon="warning" accent="#C62828" />
      </View>

      <View style={styles.card}>
        <AnalyticsBar
          label="Department Attendance %"
          value={stats.departmentAttendancePercentage}
          color="#1565C0"
        />
        <Text style={styles.note}>{stats.departmentName}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Attendance Trends</Text>
        {trends.length === 0 ? (
          <Text style={styles.note}>No trend data yet.</Text>
        ) : (
          trends.map((item) => (
            <TrendRow key={item.label} label={item.label} count={item.count} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF3FF' },
  content: { padding: 16, paddingBottom: 28 },
  title: { fontSize: 20, fontWeight: '800', color: '#0D47A1', marginBottom: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    elevation: 2,
  },
  section: { fontSize: 16, fontWeight: '800', color: '#0D47A1', marginBottom: 10 },
  note: { color: '#546E7A', fontWeight: '600' },
});
