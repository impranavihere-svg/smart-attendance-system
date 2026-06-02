import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SubstituteClassInfo from './SubstituteClassInfo';
import { colors } from '../utils/theme';

export default function SessionCard({ session }) {
  const isActive = session.status === 'active';

  return (
    <View style={[styles.card, isActive ? styles.active : styles.closed]}>
      <Text style={styles.title}>{session.classSection}</Text>
      <Text style={styles.meta}>Faculty: {session.facultyName}</Text>
      {session.subjectName ? (
        <Text style={styles.meta}>Subject: {session.subjectName}</Text>
      ) : null}
      <Text style={styles.code}>Code: {session.sessionCode}</Text>
      <Text style={styles.meta}>Duration: {session.durationMinutes} min</Text>
      <Text style={styles.status}>{isActive ? 'ACTIVE' : 'CLOSED'}</Text>
      <SubstituteClassInfo source={session} />
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
    borderLeftColor: colors.success,
  },
  closed: {
    backgroundColor: '#ECEFF1',
    borderLeftWidth: 5,
    borderLeftColor: colors.textSoft,
  },
  title: { fontSize: 16, fontWeight: '800', color: colors.text },
  meta: { color: colors.textMuted, marginTop: 4, fontWeight: '600' },
  code: { color: colors.primary, marginTop: 6, fontWeight: '800', fontSize: 15 },
  status: { marginTop: 8, fontWeight: '800', color: '#37474F' },
});
