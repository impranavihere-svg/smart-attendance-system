import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AnalyticsBar from '../../components/AnalyticsBar';
import PremiumCard from '../../components/PremiumCard';
import StatCard from '../../components/StatCard';
import TrendRow from '../../components/TrendRow';
import ScreenLoader from '../../components/ScreenLoader';
import WelcomeHeader from '../../components/WelcomeHeader';
import { getHodDashboardData } from '../../storage/attendanceStorage';
import {
  buildAttendanceTrend,
  countSubstituteSessions,
  getDepartmentStats,
} from '../../utils/analyticsUtils';
import { getAllSessions } from '../../storage/sessionStorage';
import { colors, spacing } from '../../utils/theme';

export default function HodAnalyticsScreen() {
  const [stats, setStats] = useState(null);
  const [recordCount, setRecordCount] = useState(0);
  const [trends, setTrends] = useState([]);
  const [substituteCount, setSubstituteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [data, sessions] = await Promise.all([
          getHodDashboardData(),
          getAllSessions(),
        ]);
        setStats(getDepartmentStats(data.students));
        setRecordCount(data.logs.length);
        setTrends(buildAttendanceTrend(data.logs));
        setSubstituteCount(countSubstituteSessions(sessions));
        setLoading(false);
      })();
    }, [])
  );

  if (loading || !stats) return <ScreenLoader message="Loading analytics..." />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <WelcomeHeader
        title="Department Analytics"
        subtitle={stats.departmentName}
        meta="Live department attendance insights"
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
          value={stats.lowAttendanceCount}
          emoji="📉"
          variant="danger"
          large
        />
      </View>
      <View style={styles.row}>
        <StatCard
          title="Average Attendance"
          value={`${stats.departmentAttendancePercentage}%`}
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
      <StatCard
        title="Substitute Classes Conducted"
        value={substituteCount}
        emoji="🔄"
        variant="purple"
        large
      />

      <PremiumCard>
        <AnalyticsBar
          label="Department Attendance %"
          value={stats.departmentAttendancePercentage}
          color={colors.primary}
        />
      </PremiumCard>

      <PremiumCard>
        <Text style={styles.section}>Attendance Trends</Text>
        {trends.length === 0 ? (
          <Text style={styles.note}>No trend data yet.</Text>
        ) : (
          trends.map((item) => (
            <TrendRow key={item.label} label={item.label} count={item.count} />
          ))
        )}
      </PremiumCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 32 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  section: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  note: { color: colors.textSoft, fontWeight: '600' },
});
