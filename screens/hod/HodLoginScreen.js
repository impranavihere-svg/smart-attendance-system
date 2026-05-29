import React, { useState } from 'react';
import { Alert } from 'react-native';
import RoleLoginForm from '../../components/RoleLoginForm';
import { loginUser } from '../../storage/userStorage';
import { ROLES } from '../../utils/constants';
import { DEMO_CREDENTIALS } from '../../storage/seedData';

export default function HodLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');
    const user = await loginUser(ROLES.HOD, username, password);
    setLoading(false);

    if (!user) {
      setError('Invalid HOD ID or password.');
      Alert.alert('Login Failed', 'Use HOD001 / hod1234');
      return;
    }

    navigation.replace('HodDashboard', { user });
  }

  return (
    <RoleLoginForm
      roleTitle="HOD Login"
      roleIcon="business"
      idLabel="HOD ID"
      idPlaceholder="Enter HOD ID"
      passwordPlaceholder="Enter password"
      demoHint={`Demo: ${DEMO_CREDENTIALS.hod.id} / ${DEMO_CREDENTIALS.hod.password}`}
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
