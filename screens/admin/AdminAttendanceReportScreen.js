import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AdminReportStudentCard from '../../components/AdminReportStudentCard';
import AttendanceLogCard from '../../components/AttendanceLogCard';
import SearchBar from '../../components/SearchBar';
import { getAdminDashboardData } from '../../storage/attendanceStorage';
import { getAllSessions } from '../../storage/sessionStorage';
import { filterStudentsByQuery } from '../../utils/searchUtils';
import { buildSessionMap } from '../../utils/sessionLookup';

export default function AdminAttendanceReportScreen() {
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sessionMap, setSessionMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [data, sessions] = await Promise.all([
        getAdminDashboardData(),
        getAllSessions(),
      ]);
      setStudents(data.students);
      setLogs(data.logs);
      setSessionMap(buildSessionMap(sessions));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData])
  );

  const filteredStudents = useMemo(
    () => filterStudentsByQuery(students, searchQuery),
    [students, searchQuery]
  );

  const filteredLogs = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) {
      return logs;
    }
    return logs.filter(
      (log) =>
        log.name.toLowerCase().includes(trimmed) ||
        log.usn.toLowerCase().includes(trimmed)
    );
  }, [logs, searchQuery]);

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search reports by name or USN"
      />

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => `student-${item.usn}`}
        renderItem={({ item }) => <AdminReportStudentCard student={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            <Text style={styles.section}>Student Summary</Text>
          </>
        }
        ListFooterComponent={
          <>
            <Text style={[styles.section, styles.logSection]}>
              Attendance Log Entries ({filteredLogs.length})
            </Text>
            {filteredLogs.length === 0 ? (
              <Text style={styles.empty}>No log entries found.</Text>
            ) : (
              filteredLogs.map((log) => (
                <AttendanceLogCard
                  key={log.id}
                  log={log}
                  session={log.sessionId ? sessionMap[log.sessionId] : null}
                />
              ))
            )}
          </>
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No students match your search.</Text>
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAF3FF',
  },
  section: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D47A1',
    marginBottom: 10,
  },
  logSection: {
    marginTop: 16,
  },
  list: {
    paddingBottom: 28,
  },
  empty: {
    textAlign: 'center',
    color: '#78909C',
    fontWeight: '600',
    marginVertical: 12,
  },
});
