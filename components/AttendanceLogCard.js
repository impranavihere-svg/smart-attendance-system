import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatDateTime } from '../utils/dateUtils';

export default function AttendanceLogCard({ log }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{log.name}</Text>
      <Text style={styles.usn}>USN: {log.usn}</Text>
      <Text style={styles.row}>Class Code: {log.classCode}</Text>
      <Text style={styles.date}>Marked: {formatDateTime(log.markedAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#42A5F5',
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D47A1',
    marginBottom: 4,
  },
  usn: {
    fontSize: 13,
    color: '#546E7A',
    fontWeight: '600',
    marginBottom: 6,
  },
  row: {
    fontSize: 14,
    color: '#455A64',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#1565C0',
    fontWeight: '600',
  },
});
