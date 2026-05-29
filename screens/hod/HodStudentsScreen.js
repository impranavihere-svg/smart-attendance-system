import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AdminStudentCard from '../../components/AdminStudentCard';
import SearchBar from '../../components/SearchBar';
import ScreenLoader from '../../components/ScreenLoader';
import { getHodDashboardData } from '../../storage/attendanceStorage';
import { filterStudentsByQuery } from '../../utils/searchUtils';

export default function HodStudentsScreen() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getHodDashboardData();
        setStudents(data.students);
        setLoading(false);
      })();
    }, [])
  );

  const filtered = useMemo(
    () => filterStudentsByQuery(students, query),
    [students, query]
  );

  if (loading) return <ScreenLoader />;

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search students by name or USN" />
      <Text style={styles.count}>{filtered.length} student(s)</Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.usn}
        renderItem={({ item }) => <AdminStudentCard student={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#EAF3FF' },
  count: { marginBottom: 8, color: '#546E7A', fontWeight: '600' },
  list: { paddingBottom: 24 },
});
