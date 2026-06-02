import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AdminReportStudentCard from '../../components/AdminReportStudentCard';
import AttendanceLogCard from '../../components/AttendanceLogCard';
import SearchBar from '../../components/SearchBar';
import ScreenLoader from '../../components/ScreenLoader';
import { getAttendanceReport } from '../../storage/attendanceStorage';
import { getAllSessions } from '../../storage/sessionStorage';
import { filterStudentsByQuery } from '../../utils/searchUtils';
import { buildSessionMap } from '../../utils/sessionLookup';
import { getStudentsByClass } from '../../storage/userStorage';

export default function FacultyReportsScreen({ route }) {
  const user = route.params?.user;
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sessionMap, setSessionMap] = useState({});
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const assigned = await getStudentsByClass(user.assignedClass);
        const usnSet = new Set(assigned.map((s) => s.usn));
        const [{ report, logs: allLogs }, sessions] = await Promise.all([
          getAttendanceReport(),
          getAllSessions(),
        ]);
        setStudents(report.filter((s) => usnSet.has(s.usn)));
        setLogs(allLogs.filter((l) => usnSet.has(l.usn)));
        setSessionMap(buildSessionMap(sessions));
        setLoading(false);
      })();
    }, [user])
  );

  const filteredStudents = useMemo(
    () => filterStudentsByQuery(students, query),
    [students, query]
  );

  const filteredLogs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (log) =>
        log.name.toLowerCase().includes(q) ||
        log.usn.toLowerCase().includes(q)
    );
  }, [logs, query]);

  if (loading) return <ScreenLoader />;

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search class reports" />
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.usn}
        renderItem={({ item }) => <AdminReportStudentCard student={item} />}
        ListFooterComponent={
          <>
            <Text style={styles.section}>Class Log Entries</Text>
            {filteredLogs.map((log) => (
              <AttendanceLogCard
                key={log.id}
                log={log}
                session={log.sessionId ? sessionMap[log.sessionId] : null}
              />
            ))}
          </>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#EAF3FF' },
  section: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '800',
    color: '#0D47A1',
  },
  list: { paddingBottom: 24 },
});
