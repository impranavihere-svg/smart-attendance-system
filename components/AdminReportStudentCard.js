import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { isLowAttendance } from '../utils/attendanceUtils';

export default function AdminReportStudentCard({ student }) {
  const low = isLowAttendance(student.percentage);

  return (
    <View style={[styles.card, low && styles.cardLow]}>
      <Text style={styles.name}>{student.name}</Text>
      <Text style={styles.usn}>USN: {student.usn}</Text>
      <View style={styles.grid}>
        <View style={styles.cell}>
          <Text style={styles.label}>Present</Text>
          <Text style={styles.value}>{student.present}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.label}>Total Classes</Text>
          <Text style={styles.value}>{student.totalClasses}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.label}>Attendance %</Text>
          <Text style={[styles.value, low && styles.valueLow]}>
            {student.percentage}%
          </Text>
        </View>
      </View>
      {low ? (
        <Text style={styles.warning}>Below 75% — Low Attendance</Text>
      ) : null}
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
  cardLow: {
    borderLeftColor: '#C62828',
    backgroundColor: '#FFF8F8',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0D47A1',
    marginBottom: 4,
  },
  usn: {
    fontSize: 13,
    color: '#546E7A',
    fontWeight: '600',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cell: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: '#F5F9FF',
    borderRadius: 10,
    padding: 10,
  },
  label: {
    fontSize: 11,
    color: '#78909C',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1565C0',
  },
  valueLow: {
    color: '#C62828',
  },
  warning: {
    marginTop: 10,
    color: '#C62828',
    fontWeight: '700',
    fontSize: 13,
  },
});
