import React, { useState } from 'react';
import { Alert } from 'react-native';
import RoleLoginForm from '../../components/RoleLoginForm';
import { loginUser } from '../../storage/userStorage';
import { ROLES } from '../../utils/constants';
import { DEMO_CREDENTIALS } from '../../storage/seedData';

export default function FacultyLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');
    const user = await loginUser(ROLES.FACULTY, username, password);
    setLoading(false);

    if (!user) {
      setError('Invalid Faculty ID or password.');
      Alert.alert('Login Failed', 'Use FAC001 / faculty123');
      return;
    }

    navigation.replace('FacultyDashboard', { user });
  }

  return (
    <RoleLoginForm
      roleTitle="Faculty Login"
      roleIcon="person"
      idLabel="Faculty ID"
      idPlaceholder="Enter Faculty ID"
      passwordPlaceholder="Enter password"
      demoHint={`Demo: ${DEMO_CREDENTIALS.faculty.id} / ${DEMO_CREDENTIALS.faculty.password}`}
      error={error}
      loading={loading}
      username={username}
      password={password}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
    />
  );
}
