import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatDateTime } from '../utils/dateUtils';
import SubstituteClassInfo, { getSubstituteDetails } from './SubstituteClassInfo';
import { colors } from '../utils/theme';

export default function AttendanceLogCard({ log, session }) {
  const substituteSource = getSubstituteDetails(log)
    ? log
    : getSubstituteDetails(session)
      ? session
      : null;

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{log.name}</Text>
      <Text style={styles.usn}>USN: {log.usn}</Text>
      <Text style={styles.row}>Class Code: {log.classCode}</Text>
      <Text style={styles.date}>Marked: {formatDateTime(log.markedAt)}</Text>
      <SubstituteClassInfo source={substituteSource} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: colors.secondary,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  usn: {
    fontSize: 13,
    color: colors.textMuted,
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
    color: colors.primary,
    fontWeight: '600',
  },
});
