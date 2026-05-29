import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { isLowAttendance } from '../utils/attendanceUtils';

export default function AdminStudentCard({ student }) {
  const low = isLowAttendance(student.percentage);
  const statusLabel = low ? 'Low Attendance' : 'Good Standing';
  const statusStyle = low ? styles.statusLow : styles.statusGood;
  const cardStyle = low ? styles.cardLow : styles.card;

  return (
    <View style={cardStyle}>
      <View style={styles.row}>
        <Text style={styles.name}>{student.name}</Text>
        <View style={[styles.badge, statusStyle]}>
          <Text style={styles.badgeText}>{statusLabel}</Text>
        </View>
      </View>
      <Text style={styles.usn}>USN: {student.usn}</Text>
      <Text style={styles.percentage}>Attendance: {student.percentage}%</Text>
      <Text style={styles.stats}>
        Present {student.present} / {student.totalClasses} classes
      </Text>
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
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#C62828',
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0D47A1',
  },
  usn: {
    fontSize: 13,
    color: '#546E7A',
    fontWeight: '600',
    marginBottom: 4,
  },
  percentage: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 4,
  },
  stats: {
    fontSize: 13,
    color: '#455A64',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusGood: {
    backgroundColor: '#E8F5E9',
  },
  statusLow: {
    backgroundColor: '#FFCDD2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#37474F',
  },
});
