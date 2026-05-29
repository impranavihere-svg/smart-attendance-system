import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AttendanceLogCard from '../../components/AttendanceLogCard';
import AdminReportStudentCard from '../../components/AdminReportStudentCard';
import ScreenLoader from '../../components/ScreenLoader';
import { getStudentRecords } from '../../storage/attendanceStorage';

export default function StudentRecordsScreen({ route }) {
  const user = route.params?.user;
  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getStudentRecords(user.usn);
        setStudent(data.student);
        setHistory(data.history);
        setLoading(false);
      })();
    }, [user])
  );

  if (loading) return <ScreenLoader message="Loading your records..." />;

  return (
    <View style={styles.container}>
      {student ? (
        <AdminReportStudentCard student={student} />
      ) : (
        <Text style={styles.empty}>No attendance summary found yet.</Text>
      )}

      <Text style={styles.section}>Your Attendance History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AttendanceLogCard log={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No attendance history yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#EAF3FF' },
  section: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '800',
    color: '#0D47A1',
  },
  list: { paddingBottom: 24 },
  empty: { textAlign: 'center', color: '#78909C', fontWeight: '600', marginVertical: 12 },
});
