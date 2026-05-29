import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLoader from '../../components/ScreenLoader';
import { getFaculty, updateFacultyList } from '../../storage/userStorage';

export default function HodFacultyManagementScreen() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFaculty = useCallback(async () => {
    setFaculty(await getFaculty());
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadFaculty();
    }, [loadFaculty])
  );

  async function toggleFacultyStatus(facultyId) {
    const updated = faculty.map((item) =>
      item.id === facultyId ? { ...item, active: item.active === false } : item
    );
    await updateFacultyList(updated);
    setFaculty(updated);
    Alert.alert('Updated', 'Faculty status changed successfully.');
  }

  if (loading) return <ScreenLoader />;

  return (
    <View style={styles.container}>
      <Text style={styles.info}>Activate or deactivate faculty accounts.</Text>
      <FlatList
        data={faculty}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.id} • {item.assignedClass}</Text>
            <Text style={styles.status}>
              Status: {item.active !== false ? 'Active' : 'Inactive'}
            </Text>
            <Pressable style={styles.btn} onPress={() => toggleFacultyStatus(item.id)}>
              <Text style={styles.btnText}>
                {item.active !== false ? 'Deactivate' : 'Activate'}
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#EAF3FF' },
  info: { color: '#546E7A', marginBottom: 10, fontWeight: '600' },
  list: { paddingBottom: 24 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '800', color: '#0D47A1' },
  meta: { marginTop: 4, color: '#546E7A' },
  status: { marginTop: 6, fontWeight: '700', color: '#37474F' },
  btn: {
    marginTop: 10,
    backgroundColor: '#1565C0',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnText: { color: '#FFF', fontWeight: '700' },
});
