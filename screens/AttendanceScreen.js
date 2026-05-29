import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { validateClassQr } from '../utils/qrValidator';
import { markAttendance } from '../storage/attendanceStorage';
import { VALID_CLASS_CODE } from '../utils/constants';

export default function AttendanceScreen() {
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [attendanceCode, setAttendanceCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function submitAttendance() {
    if (!name.trim() || !usn.trim() || !attendanceCode.trim()) {
      Alert.alert(
        'Missing Details',
        'Please enter student name, USN, and attendance code.'
      );
      return;
    }

    setMessage('');
    setIsSaving(true);

    try {
      if (!validateClassQr(attendanceCode)) {
        setMessage(`Invalid code. Please enter: ${VALID_CLASS_CODE}`);
        return;
      }

      await markAttendance({
        name,
        usn,
        classCode: attendanceCode.toUpperCase(),
      });

      setMessage('Attendance marked successfully.');
      setName('');
      setUsn('');
      setAttendanceCode('');
    } catch (error) {
      setMessage('Could not save attendance. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.label}>Student Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter student name"
          placeholderTextColor="#7B8A9A"
        />

        <Text style={styles.label}>USN</Text>
        <TextInput
          style={styles.input}
          value={usn}
          onChangeText={setUsn}
          placeholder="Enter USN (e.g., 1CR25MC001)"
          autoCapitalize="characters"
          placeholderTextColor="#7B8A9A"
        />

        <Text style={styles.label}>Attendance Code</Text>
        <TextInput
          style={styles.input}
          value={attendanceCode}
          onChangeText={setAttendanceCode}
          placeholder={`Enter code (e.g., ${VALID_CLASS_CODE})`}
          autoCapitalize="characters"
          placeholderTextColor="#7B8A9A"
        />

        <PrimaryButton
          title="Mark Attendance"
          icon="checkmark-circle-outline"
          onPress={submitAttendance}
          disabled={isSaving}
        />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF3FF',
    padding: 16,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  label: {
    color: '#0D47A1',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BBD4F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: '#102A43',
    backgroundColor: '#F8FBFF',
  },
  message: {
    marginTop: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  success: {
    color: '#2E7D32',
  },
  error: {
    color: '#C62828',
  },
});
