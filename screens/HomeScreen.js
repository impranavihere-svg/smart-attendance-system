import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <Ionicons name="school" size={42} color="#0D47A1" />
        <Text style={styles.title}>Smart Attendance Monitoring System</Text>
        <Text style={styles.subtitle}>Role-Based Attendance Management Platform</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Login by Role</Text>
        <PrimaryButton
          title="HOD Login"
          icon="business"
          onPress={() => navigation.navigate('HodLogin')}
        />
        <PrimaryButton
          title="Faculty Login"
          icon="person"
          onPress={() => navigation.navigate('FacultyLogin')}
        />
        <PrimaryButton
          title="Student Login"
          icon="school"
          onPress={() => navigation.navigate('StudentLogin')}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Quick Access (Legacy)</Text>
        <PrimaryButton
          title="Mark Attendance (Guest)"
          icon="create-outline"
          onPress={() => navigation.navigate('MarkAttendance')}
        />
        <PrimaryButton
          title="View Attendance Report"
          icon="bar-chart-outline"
          onPress={() => navigation.navigate('AttendanceReport')}
        />
        <PrimaryButton
          title="Teacher / Admin Login"
          icon="shield-checkmark-outline"
          onPress={() => navigation.navigate('AdminLogin')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF3FF' },
  content: { padding: 18, paddingBottom: 28, flexGrow: 1, justifyContent: 'center' },
  banner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  title: {
    marginTop: 10,
    fontSize: 21,
    color: '#0D47A1',
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#1565C0',
    textAlign: 'center',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  section: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D47A1',
    marginBottom: 4,
  },
});
