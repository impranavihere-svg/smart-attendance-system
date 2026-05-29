import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import SearchBar from '../../components/SearchBar';
import ScreenLoader from '../../components/ScreenLoader';
import { getFaculty } from '../../storage/userStorage';

function FacultyCard({ faculty }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{faculty.name}</Text>
      <Text style={styles.meta}>ID: {faculty.id}</Text>
      <Text style={styles.meta}>Class: {faculty.assignedClass}</Text>
      <Text style={styles.status}>{faculty.active !== false ? 'Active' : 'Inactive'}</Text>
    </View>
  );
}

export default function HodFacultyScreen() {
  const [faculty, setFaculty] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setFaculty(await getFaculty());
        setLoading(false);
      })();
    }, [])
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faculty;
    return faculty.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.assignedClass.toLowerCase().includes(q)
    );
  }, [faculty, query]);

  if (loading) return <ScreenLoader />;

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search faculty by name, ID, or class" />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FacultyCard faculty={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#EAF3FF' },
  list: { paddingBottom: 24 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#1565C0',
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '800', color: '#0D47A1' },
  meta: { marginTop: 4, color: '#546E7A', fontWeight: '600' },
  status: { marginTop: 8, color: '#2E7D32', fontWeight: '700' },
});
