import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SessionCard({ session }) {
  const isActive = session.status === 'active';
  return (
    <View style={[styles.card, isActive ? styles.active : styles.closed]}>
      <Text style={styles.title}>{session.classSection}</Text>
      <Text style={styles.meta}>Faculty: {session.facultyName}</Text>
      <Text style={styles.code}>Code: {session.sessionCode}</Text>
      <Text style={styles.meta}>Duration: {session.durationMinutes} min</Text>
      <Text style={styles.status}>{isActive ? 'ACTIVE' : 'CLOSED'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  active: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 5,
    borderLeftColor: '#2E7D32',
  },
  closed: {
    backgroundColor: '#ECEFF1',
    borderLeftWidth: 5,
    borderLeftColor: '#78909C',
  },
  title: { fontSize: 16, fontWeight: '800', color: '#0D47A1' },
  meta: { color: '#546E7A', marginTop: 4, fontWeight: '600' },
  code: { color: '#1565C0', marginTop: 6, fontWeight: '800', fontSize: 15 },
  status: { marginTop: 8, fontWeight: '800', color: '#37474F' },
});
