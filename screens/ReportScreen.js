import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import StudentCard from '../components/StudentCard';
import {
  bootstrapSampleData,
  getAttendanceReport,
} from '../storage/attendanceStorage';

export default function ReportScreen() {
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadReport = useCallback(async () => {
    try {
      setError('');
      await bootstrapSampleData();
      const { report, logs: attendanceLogs } = await getAttendanceReport();
      setStudents(report);
      setLogs(attendanceLogs);
    } catch (err) {
      setError('Unable to load attendance report.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReport();
    }, [loadReport])
  );

  async function onRefresh() {
    setRefreshing(true);
    await loadReport();
  }

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#1565C0" />
        <Text style={styles.loaderText}>Loading report...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topCard}>
        <Text style={styles.total}>Students: {students.length}</Text>
        <Text style={styles.total}>Attendance Entries: {logs.length}</Text>
        <PrimaryButton title="Refresh Report" icon="refresh" onPress={onRefresh} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={students}
        keyExtractor={(item) => item.usn}
        renderItem={({ item }) => <StudentCard student={item} />}
        contentContainerStyle={styles.listWrap}
        ListEmptyComponent={
          <Text style={styles.empty}>No attendance found. Mark attendance first.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#EAF3FF',
  },
  loaderWrap: {
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
  topCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  total: {
    color: '#0D47A1',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  error: {
    color: '#C62828',
    fontWeight: '700',
    marginBottom: 8,
  },
  listWrap: {
    paddingBottom: 24,
  },
  empty: {
    color: '#546E7A',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
});
