import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LowAttendanceAlertCard({ student }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="warning" size={22} color="#C62828" />
        <Text style={styles.alertTitle}>Low Attendance Warning</Text>
      </View>
      <Text style={styles.name}>{student.name}</Text>
      <Text style={styles.usn}>USN: {student.usn}</Text>
      <Text style={styles.percentage}>
        Attendance: {student.percentage}% (below 75%)
      </Text>
      <Text style={styles.stats}>
        Present only {student.present} of {student.totalClasses} classes
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EF9A9A',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  alertTitle: {
    color: '#C62828',
    fontSize: 14,
    fontWeight: '800',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#B71C1C',
    marginBottom: 4,
  },
  usn: {
    fontSize: 13,
    color: '#5D4037',
    fontWeight: '600',
    marginBottom: 6,
  },
  percentage: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 4,
  },
  stats: {
    fontSize: 13,
    color: '#6D4C41',
  },
});
