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
import { Ionicons } from '@expo/vector-icons';
import LowAttendanceAlertCard from '../../components/LowAttendanceAlertCard';
import SearchBar from '../../components/SearchBar';
import { getAdminDashboardData } from '../../storage/attendanceStorage';
import { isLowAttendance } from '../../utils/attendanceUtils';
import { filterStudentsByQuery } from '../../utils/searchUtils';

export default function AdminLowAttendanceScreen() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const data = await getAdminDashboardData();
      const lowOnly = data.students.filter((s) =>
        isLowAttendance(s.percentage)
      );
      setStudents(lowOnly);
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
      <View style={styles.banner}>
        <Ionicons name="warning" size={28} color="#C62828" />
        <Text style={styles.bannerTitle}>Low Attendance Alerts</Text>
        <Text style={styles.bannerSub}>
          Students below 75% attendance threshold
        </Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search alerts by name or USN"
      />

      <Text style={styles.count}>
        {filteredStudents.length} student(s) need attention
      </Text>

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.usn}
        renderItem={({ item }) => <LowAttendanceAlertCard student={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="happy-outline" size={48} color="#2E7D32" />
            <Text style={styles.emptyTitle}>No low attendance alerts</Text>
            <Text style={styles.emptySub}>
              All students are above the 75% threshold.
            </Text>
          </View>
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
  banner: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  bannerTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '800',
    color: '#C62828',
  },
  bannerSub: {
    marginTop: 4,
    fontSize: 13,
    color: '#6D4C41',
    textAlign: 'center',
  },
  count: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 8,
  },
  list: {
    paddingBottom: 24,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    color: '#2E7D32',
  },
  emptySub: {
    marginTop: 6,
    textAlign: 'center',
    color: '#546E7A',
  },
});
