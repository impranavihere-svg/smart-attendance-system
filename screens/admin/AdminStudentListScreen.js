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
import AdminStudentCard from '../../components/AdminStudentCard';
import SearchBar from '../../components/SearchBar';
import { getAdminDashboardData } from '../../storage/attendanceStorage';
import { filterStudentsByQuery } from '../../utils/searchUtils';

export default function AdminStudentListScreen() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStudents = useCallback(async () => {
    try {
      const data = await getAdminDashboardData();
      setStudents(data.students);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadStudents();
    }, [loadStudents])
  );

  const filteredStudents = useMemo(
    () => filterStudentsByQuery(students, searchQuery),
    [students, searchQuery]
  );

  async function onRefresh() {
    setRefreshing(true);
    await loadStudents();
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
        placeholder="Search by name or USN"
      />
      <Text style={styles.count}>
        Showing {filteredStudents.length} of {students.length} students
      </Text>
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.usn}
        renderItem={({ item }) => <AdminStudentCard student={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  count: {
    fontSize: 13,
    color: '#546E7A',
    fontWeight: '600',
    marginBottom: 8,
  },
  list: {
    paddingBottom: 24,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    color: '#78909C',
    fontWeight: '600',
  },
});
