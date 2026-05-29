import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';
import { validateAdminLogin } from '../../utils/adminAuth';

export default function AdminLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password.');
      return;
    }

    if (!validateAdminLogin(username, password)) {
      setError('Invalid username or password.');
      Alert.alert('Login Failed', 'Use admin / 1234 for demo access.');
      return;
    }

    setError('');
    navigation.replace('AdminDashboard');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerCard}>
          <Ionicons name="shield-checkmark" size={48} color="#0D47A1" />
          <Text style={styles.title}>Teacher / Admin Login</Text>
          <Text style={styles.subtitle}>
            Secure access to attendance management
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            autoCapitalize="none"
            placeholderTextColor="#90A4AE"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
            placeholderTextColor="#90A4AE"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            title="Login to Dashboard"
            icon="log-in-outline"
            onPress={handleLogin}
          />
        </View>

        <Text style={styles.hint}>Demo: admin / 1234</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#EAF3FF',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '800',
    color: '#0D47A1',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#546E7A',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
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
    paddingVertical: 11,
    marginBottom: 14,
    fontSize: 15,
    color: '#102A43',
    backgroundColor: '#F8FBFF',
  },
  error: {
    color: '#C62828',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  hint: {
    marginTop: 16,
    textAlign: 'center',
    color: '#78909C',
    fontSize: 13,
    fontWeight: '600',
  },
});
