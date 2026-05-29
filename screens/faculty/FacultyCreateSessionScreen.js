import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import {
  closeSession,
  createAttendanceSession,
  getActiveSessionForClass,
} from '../../storage/sessionStorage';
import { SESSION_DURATION_OPTIONS } from '../../utils/constants';

export default function FacultyCreateSessionScreen({ route, navigation }) {
  const user = route.params?.user;
  const [duration, setDuration] = useState(15);
  const [createdSession, setCreatedSession] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleCreateSession() {
    setLoading(true);
    const existing = await getActiveSessionForClass(user.assignedClass);
    if (existing) {
      setLoading(false);
      Alert.alert(
        'Session Already Active',
        'Close the current session before creating a new one.'
      );
      return;
    }

    const session = await createAttendanceSession({
      facultyId: user.id,
      facultyName: user.name,
      classSection: user.assignedClass,
      durationMinutes: duration,
    });

    setCreatedSession(session);
    setLoading(false);
    Alert.alert('Session Created', `Share code: ${session.sessionCode}`);
  }

  async function handleCloseSession() {
    if (!createdSession) return;
    await closeSession(createdSession.id);
    Alert.alert('Session Closed', 'Attendance session has been closed.');
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Attendance Session</Text>
        <Text style={styles.meta}>Class: {user.assignedClass}</Text>
        <Text style={styles.label}>Session Duration (minutes)</Text>
        <View style={styles.durationRow}>
          {SESSION_DURATION_OPTIONS.map((option) => (
            <Pressable
              key={option}
              style={[
                styles.durationBtn,
                duration === option && styles.durationBtnActive,
              ]}
              onPress={() => setDuration(option)}
            >
              <Text
                style={[
                  styles.durationText,
                  duration === option && styles.durationTextActive,
                ]}
              >
                {option}m
              </Text>
            </Pressable>
          ))}
        </View>

        <PrimaryButton
          title={loading ? 'Creating...' : 'Generate Session Code'}
          icon="key-outline"
          onPress={handleCreateSession}
          disabled={loading}
        />

        {createdSession ? (
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Session Code</Text>
            <Text style={styles.code}>{createdSession.sessionCode}</Text>
            <Text style={styles.endsAt}>
              Valid until: {new Date(createdSession.endsAt).toLocaleTimeString()}
            </Text>
            <PrimaryButton
              title="Close Session"
              icon="close-circle"
              onPress={handleCloseSession}
            />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF3FF' },
  content: { padding: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#0D47A1' },
  meta: { marginTop: 4, marginBottom: 12, color: '#546E7A', fontWeight: '600' },
  label: { color: '#0D47A1', fontWeight: '700', marginBottom: 8 },
  durationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  durationBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
  },
  durationBtnActive: { backgroundColor: '#1565C0' },
  durationText: { color: '#1565C0', fontWeight: '700' },
  durationTextActive: { color: '#FFF' },
  codeBox: {
    marginTop: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
  },
  codeLabel: { color: '#2E7D32', fontWeight: '700' },
  code: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1B5E20',
    marginVertical: 8,
    letterSpacing: 2,
  },
  endsAt: { color: '#455A64', marginBottom: 8, fontWeight: '600' },
});
