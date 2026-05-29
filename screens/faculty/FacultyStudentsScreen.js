import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AdminStudentCard from '../../components/AdminStudentCard';
import SearchBar from '../../components/SearchBar';
import ScreenLoader from '../../components/ScreenLoader';
import { getAttendanceReport } from '../../storage/attendanceStorage';
import { filterStudentsByQuery } from '../../utils/searchUtils';

export default function FacultyStudentsScreen({ route }) {
  const user = route.params?.user;
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { report } = await getAttendanceReport();
        setStudents(
          report.filter((s) => s.classSection === user.assignedClass)
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
      <Text style={styles.header}>Class: {user.assignedClass}</Text>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search assigned students"
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.usn}
        renderItem={({ item }) => <AdminStudentCard student={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No students in this class.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#EAF3FF' },
  header: { fontWeight: '800', color: '#0D47A1', marginBottom: 8 },
  list: { paddingBottom: 24 },
  empty: { textAlign: 'center', marginTop: 20, color: '#78909C' },
});
