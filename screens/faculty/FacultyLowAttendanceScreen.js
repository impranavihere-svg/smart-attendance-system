import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LowAttendanceAlertCard from '../../components/LowAttendanceAlertCard';
import SearchBar from '../../components/SearchBar';
import ScreenLoader from '../../components/ScreenLoader';
import { getAttendanceReport } from '../../storage/attendanceStorage';
import { isLowAttendance } from '../../utils/attendanceUtils';
import { filterStudentsByQuery } from '../../utils/searchUtils';

export default function FacultyLowAttendanceScreen({ route }) {
  const user = route.params?.user;
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { report } = await getAttendanceReport();
        setStudents(
          report.filter(
            (s) =>
              s.classSection === user.assignedClass &&
              isLowAttendance(s.percentage)
          )
        );
        setLoading(false);
      })();
    }, [user])
  );

  const filtered = useMemo(
    () => filterStudentsByQuery(students, query),
    [students, query]
  );

  if (loading) return <ScreenLoader />;

  return (
    <View style={styles.container}>
      <Text style={styles.banner}>Low Attendance — {user.assignedClass}</Text>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search students" />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.usn}
        renderItem={({ item }) => <LowAttendanceAlertCard student={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No low attendance students in your class.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#EAF3FF' },
  banner: {
    color: '#C62828',
    fontWeight: '800',
    marginBottom: 10,
    fontSize: 15,
  },
  list: { paddingBottom: 24 },
  empty: { textAlign: 'center', marginTop: 24, color: '#2E7D32', fontWeight: '700' },
});
