import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { isLowAttendance } from '../utils/attendanceUtils';

export default function StudentCard({ student }) {
  const lowAttendance = isLowAttendance(student.percentage);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.usn}>{student.usn}</Text>
      </View>

      <Text style={styles.stats}>
        Present: {student.present} / {student.totalClasses}
      </Text>
      <Text style={styles.percentage}>Attendance: {student.percentage}%</Text>

      {lowAttendance ? (
        <Text style={styles.warning}>Low Attendance Warning</Text>
      ) : (
        <Text style={styles.good}>Good Attendance</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#1E88E5',
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    color: '#0D47A1',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  usn: {
    color: '#546E7A',
    fontSize: 12,
    fontWeight: '600',
  },
  stats: {
    color: '#455A64',
    fontSize: 14,
    marginBottom: 3,
  },
  percentage: {
    color: '#1565C0',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  warning: {
    color: '#C62828',
    fontWeight: '700',
  },
  good: {
    color: '#2E7D32',
    fontWeight: '700',
  },
});
