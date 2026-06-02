import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AttendanceProgressRing from '../../components/AttendanceProgressRing';
import PrimaryButton from '../../components/PrimaryButton';
import PremiumCard from '../../components/PremiumCard';
import ScreenLoader from '../../components/ScreenLoader';
import StatCard from '../../components/StatCard';
import StudentAttendanceAlertCard from '../../components/StudentAttendanceAlertCard';
import WelcomeHeader from '../../components/WelcomeHeader';
import { getStudentRecords } from '../../storage/attendanceStorage';
import { logoutCurrentUser } from '../../storage/userStorage';
import { getStudentAttendanceAlert, isLowAttendance } from '../../utils/attendanceUtils';
import { colors, spacing } from '../../utils/theme';

export default function StudentDashboardScreen({ navigation, route }) {
  const user = route.params?.user;
  const [student, setStudent] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [attendanceAlert, setAttendanceAlert] = useState(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { student: record, history } = await getStudentRecords(user.usn);
        const percentage = record?.percentage ?? 0;
        setStudent(record);
        setHistoryCount(history.length);
        setAttendanceAlert(getStudentAttendanceAlert(percentage));
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <WelcomeHeader
        title={`Welcome back, ${user.name} 👋`}
        subtitle={`USN: ${user.usn}`}
        meta={`Class: ${user.classSection}`}
        icon="school"
      />

      <PremiumCard shadowAccent={colors.primary}>
        <AttendanceProgressRing percentage={percentage} label="Your Attendance" />
      </PremiumCard>

      <View style={styles.row}>
        <StatCard
          title="History Entries"
          value={historyCount}
          icon="time"
          variant="teal"
          large
        />
        <StatCard
          title="Status"
          value={low ? 'At Risk' : 'Good'}
          icon={low ? 'warning' : 'checkmark-circle'}
          variant={low ? 'danger' : 'success'}
          large
        />
      </View>

      <View style={[styles.statusCard, low ? styles.low : styles.good]}>
        <Ionicons
          name={low ? 'alert-circle' : 'shield-checkmark'}
          size={22}
          color={low ? colors.danger : colors.success}
        />
        <View style={styles.statusBody}>
          <Text style={styles.statusTitle}>Attendance Status</Text>
          <Text style={styles.statusText}>
            {low ? 'Low Attendance Warning — below 75%' : 'Good Standing — keep it up!'}
          </Text>
        </View>
      </View>

      {attendanceAlert ? (
        <StudentAttendanceAlertCard
          alert={attendanceAlert}
          percentage={percentage}
          onViewPlan={() =>
            navigation.navigate('StudentImprovementPlan', {
              user,
              quote: attendanceAlert.quote,
            })
          }
        />
      ) : null}

      <PremiumCard style={styles.navCard}>
        <Text style={styles.navTitle}>Quick Actions</Text>
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
        <PrimaryButton title="Logout" icon="log-out-outline" onPress={handleLogout} variant="danger" />
      </PremiumCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 32 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderRadius: 22,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  good: { backgroundColor: '#E8F5E9' },
  low: { backgroundColor: '#FFEBEE' },
  statusBody: { flex: 1 },
  statusTitle: { fontWeight: '800', color: '#37474F', fontSize: 15 },
  statusText: { marginTop: 6, fontWeight: '700', color: colors.primary, lineHeight: 20 },
  navCard: { marginBottom: 0 },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
});
