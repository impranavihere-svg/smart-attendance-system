import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import PremiumCard from '../../components/PremiumCard';
import {
  closeSession,
  createSubstituteAttendanceSession,
  getActiveSessionForClass,
} from '../../storage/sessionStorage';
import { SESSION_DURATION_OPTIONS, SUBSTITUTE_REASONS } from '../../utils/constants';
import { colors, radii, spacing } from '../../utils/theme';

export default function SubstituteFacultyScreen({ route, navigation }) {
  const user = route.params?.user;
  const [originalFaculty, setOriginalFaculty] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [classSection, setClassSection] = useState(user?.assignedClass || '');
  const [reason, setReason] = useState(SUBSTITUTE_REASONS[0]);
  const [duration, setDuration] = useState(15);
  const [createdSession, setCreatedSession] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleStartSession() {
    if (!originalFaculty.trim()) {
      Alert.alert('Required Field', 'Please enter the original faculty name.');
      return;
    }
    if (!subjectName.trim()) {
      Alert.alert('Required Field', 'Please enter the subject name.');
      return;
    }
    if (!classSection.trim()) {
      Alert.alert('Required Field', 'Please enter the class / section.');
      return;
    }

    setLoading(true);
    const existing = await getActiveSessionForClass(classSection.trim());
    if (existing) {
      setLoading(false);
      Alert.alert(
        'Session Already Active',
        'An active session already exists for this class. Close it before starting a substitute session.'
      );
      return;
    }

    const session = await createSubstituteAttendanceSession({
      facultyId: user.id,
      facultyName: user.name,
      classSection: classSection.trim(),
      durationMinutes: duration,
      originalFaculty: originalFaculty.trim(),
      subjectName: subjectName.trim(),
      reason,
    });

    setCreatedSession(session);
    setLoading(false);
    Alert.alert(
      'Substitute Session Started',
      `Share code ${session.sessionCode} with students in ${session.classSection}.`
    );
  }

  async function handleCloseSession() {
    if (!createdSession) return;
    await closeSession(createdSession.id);
    Alert.alert('Session Closed', 'Substitute attendance session has been closed.');
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PremiumCard>
        <Text style={styles.title}>Substitute Faculty Attendance</Text>
        <Text style={styles.hint}>
          Take attendance on behalf of another faculty member when they are absent.
        </Text>

        <Text style={styles.label}>Original Faculty Name</Text>
        <TextInput
          style={styles.input}
          value={originalFaculty}
          onChangeText={setOriginalFaculty}
          placeholder="e.g. Dr. Smith"
          placeholderTextColor={colors.textSoft}
        />

        <Text style={styles.label}>Subject Name</Text>
        <TextInput
          style={styles.input}
          value={subjectName}
          onChangeText={setSubjectName}
          placeholder="e.g. Data Structures"
          placeholderTextColor={colors.textSoft}
        />

        <Text style={styles.label}>Class / Section</Text>
        <TextInput
          style={styles.input}
          value={classSection}
          onChangeText={setClassSection}
          placeholder="e.g. 1st MCA-A"
          placeholderTextColor={colors.textSoft}
        />

        <Text style={styles.label}>Reason for Substitution</Text>
        <View style={styles.reasonRow}>
          {SUBSTITUTE_REASONS.map((option) => (
            <Pressable
              key={option}
              style={[styles.reasonBtn, reason === option && styles.reasonBtnActive]}
              onPress={() => setReason(option)}
            >
              <Text
                style={[styles.reasonText, reason === option && styles.reasonTextActive]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Session Duration (minutes)</Text>
        <View style={styles.durationRow}>
          {SESSION_DURATION_OPTIONS.map((option) => (
            <Pressable
              key={option}
              style={[styles.durationBtn, duration === option && styles.durationBtnActive]}
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
          title={loading ? 'Starting...' : 'Start Substitute Attendance Session'}
          icon="swap-horizontal"
          onPress={handleStartSession}
          disabled={loading || Boolean(createdSession)}
        />

        {createdSession ? (
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Substitute Session Code</Text>
            <Text style={styles.code}>{createdSession.sessionCode}</Text>
            <Text style={styles.meta}>Class: {createdSession.classSection}</Text>
            <Text style={styles.meta}>Subject: {createdSession.subjectName}</Text>
            <Text style={styles.meta}>
              Original Faculty: {createdSession.originalFaculty}
            </Text>
            <Text style={styles.meta}>Reason: {createdSession.reason}</Text>
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
      </PremiumCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  hint: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    color: colors.textMuted,
    fontWeight: '600',
    lineHeight: 20,
  },
  label: {
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: '#F0F4FA',
    borderRadius: radii.button,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reasonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reasonBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: '#E3F2FD',
  },
  reasonBtnActive: { backgroundColor: colors.primary },
  reasonText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  reasonTextActive: { color: '#FFFFFF' },
  durationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm },
  durationBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: '#E3F2FD',
  },
  durationBtnActive: { backgroundColor: colors.primary },
  durationText: { color: colors.primary, fontWeight: '700' },
  durationTextActive: { color: '#FFFFFF' },
  codeBox: {
    marginTop: spacing.md,
    backgroundColor: '#E8F5E9',
    borderRadius: radii.card,
    padding: spacing.md,
  },
  codeLabel: { color: colors.success, fontWeight: '700' },
  code: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1B5E20',
    marginVertical: 8,
    letterSpacing: 2,
  },
  meta: { color: '#455A64', marginBottom: 4, fontWeight: '600' },
  endsAt: { color: '#455A64', marginBottom: spacing.sm, fontWeight: '600' },
});
