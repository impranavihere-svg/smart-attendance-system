import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';
import StatCard from '../../components/StatCard';
import { getAdminDashboardData } from '../../storage/attendanceStorage';
import { isLowAttendance } from '../../utils/attendanceUtils';

export default function AdminDashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEntries: 0,
    lowCount: 0,
    goodCount: 0,
  });

  const loadDashboard = useCallback(async () => {
    try {
      const data = await getAdminDashboardData();
      const lowCount = data.students.filter((s) =>
        isLowAttendance(s.percentage)
      ).length;

      setStats({
        totalStudents: data.totalStudents,
        totalEntries: data.totalEntries,
        lowCount,
        goodCount: data.totalStudents - lowCount,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadDashboard();
    }, [loadDashboard])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1565C0" />
        <Text style={styles.loaderText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.welcomeCard}>
        <Ionicons name="person-circle" size={40} color="#0D47A1" />
        <Text style={styles.welcomeTitle}>Admin Dashboard</Text>
        <Text style={styles.welcomeSub}>Smart Attendance Management</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="people"
          accent="#1565C0"
        />
        <StatCard
          title="Attendance Entries"
          value={stats.totalEntries}
          icon="clipboard"
          accent="#1976D2"
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard
          title="Good Attendance"
          value={stats.goodCount}
          icon="checkmark-circle"
          accent="#2E7D32"
        />
        <StatCard
          title="Low Attendance"
          value={stats.lowCount}
          icon="alert-circle"
          accent="#C62828"
        />
      </View>

      <View style={styles.navCard}>
        <Text style={styles.sectionTitle}>Quick Navigation</Text>
        <PrimaryButton
          title="Student List"
          icon="list"
          onPress={() => navigation.navigate('AdminStudentList')}
        />
        <PrimaryButton
          title="Attendance Reports"
          icon="document-text-outline"
          onPress={() => navigation.navigate('AdminAttendanceReport')}
        />
        <PrimaryButton
          title="Low Attendance Alerts"
          icon="warning-outline"
          onPress={() => navigation.navigate('AdminLowAttendance')}
        />
        <PrimaryButton
          title="Logout"
          icon="log-out-outline"
          onPress={() => navigation.replace('Home')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF3FF',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAF3FF',
  },
  loaderText: {
    marginTop: 10,
    color: '#1565C0',
    fontWeight: '600',
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  welcomeTitle: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '800',
    color: '#0D47A1',
  },
  welcomeSub: {
    marginTop: 4,
    fontSize: 14,
    color: '#546E7A',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 8,
  },
  navCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D47A1',
    marginBottom: 4,
  },
});
