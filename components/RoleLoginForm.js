import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';

export default function RoleLoginForm({
  roleTitle,
  roleIcon,
  idLabel,
  idPlaceholder,
  passwordPlaceholder,
  demoHint,
  error,
  loading,
  onSubmit,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
}) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerCard}>
          <Ionicons name={roleIcon} size={46} color="#0D47A1" />
          <Text style={styles.title}>{roleTitle}</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>{idLabel}</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={onUsernameChange}
            placeholder={idPlaceholder}
            autoCapitalize="characters"
            placeholderTextColor="#90A4AE"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={onPasswordChange}
            placeholder={passwordPlaceholder}
            secureTextEntry
            placeholderTextColor="#90A4AE"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            title={loading ? 'Signing in...' : 'Login'}
            icon="log-in-outline"
            onPress={onSubmit}
            disabled={loading}
          />
        </View>

        {demoHint ? <Text style={styles.hint}>{demoHint}</Text> : null}
        {loading ? <ActivityIndicator style={styles.loader} color="#1565C0" /> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#EAF3FF' },
  container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '800',
    color: '#0D47A1',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
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
  error: {
    color: '#C62828',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  hint: {
    marginTop: 14,
    textAlign: 'center',
    color: '#78909C',
    fontSize: 13,
    fontWeight: '600',
  },
  loader: { marginTop: 12 },
});
