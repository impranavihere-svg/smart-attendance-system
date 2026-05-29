import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { markSecureAttendance } from '../../storage/attendanceStorage';
import { validateSecureAttendance } from '../../utils/attendanceValidation';

export default function StudentMarkAttendanceScreen({ route }) {
  const user = route.params?.user;
  const [sessionCode, setSessionCode] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      appStateRef.current = nextState;
      setAppActive(nextState === 'active');
    });
    return () => subscription.remove();
  }, []);

  async function submitAttendance() {
    if (!sessionCode.trim()) {
      Alert.alert('Missing Code', 'Enter the session code from your faculty.');
      return;
    }

    setMessage('');
    setIsSaving(true);

    try {
      const validation = await validateSecureAttendance({
        student: user,
        sessionCode,
        appState: appStateRef.current,
      });

      if (!validation.valid) {
        setMessage(validation.failures.join('\n'));
        return;
      }

      await markSecureAttendance({
        student: user,
        session: validation.session,
      });

      setMessage('Attendance marked successfully.');
      setSessionCode('');
    } catch (error) {
      setMessage(error.message || 'Could not save attendance.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Secure Attendance Marking</Text>
        <Text style={styles.meta}>{user.name} • {user.usn}</Text>
        <Text style={styles.meta}>Class: {user.classSection}</Text>

        <Text style={[styles.check, appActive ? styles.ok : styles.bad]}>
          App Active: {appActive ? 'Yes' : 'No — keep app in foreground'}
        </Text>

        <Text style={styles.label}>Session Code</Text>
        <TextInput
          style={styles.input}
          value={sessionCode}
          onChangeText={setSessionCode}
          placeholder="Enter faculty session code"
          autoCapitalize="characters"
          placeholderTextColor="#90A4AE"
        />

        <PrimaryButton
          title="Submit Attendance"
          icon="shield-checkmark"
          onPress={submitAttendance}
          disabled={isSaving}
        />
      </View>

      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>Validation Rules</Text>
        <Text style={styles.rule}>• Active session must exist</Text>
        <Text style={styles.rule}>• Correct session code required</Text>
        <Text style={styles.rule}>• Must submit within session time limit</Text>
        <Text style={styles.rule}>• App must remain active</Text>
        <Text style={styles.rule}>• College Wi-Fi OR campus GPS boundary</Text>
      </View>

      {isSaving ? <ActivityIndicator size="large" color="#1565C0" /> : null}

      {message ? (
        <Text
          style={[
            styles.message,
            message.includes('successfully') ? styles.success : styles.error,
          ]}
        >
          {message}
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF3FF' },
  content: { padding: 16, paddingBottom: 28 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#0D47A1' },
  meta: { marginTop: 4, color: '#546E7A', fontWeight: '600' },
  check: { marginTop: 10, fontWeight: '700' },
  ok: { color: '#2E7D32' },
  bad: { color: '#C62828' },
  label: {
    marginTop: 12,
    marginBottom: 6,
    color: '#0D47A1',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BBD4F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#F8FBFF',
    color: '#102A43',
  },
  rulesCard: {
    marginTop: 14,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    elevation: 2,
  },
  rulesTitle: { fontWeight: '800', color: '#0D47A1', marginBottom: 8 },
  rule: { color: '#455A64', marginBottom: 4, fontWeight: '600' },
  message: { marginTop: 14, fontWeight: '700', textAlign: 'center' },
  success: { color: '#2E7D32' },
  error: { color: '#C62828' },
});
