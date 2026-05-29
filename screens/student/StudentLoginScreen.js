import React, { useState } from 'react';
import { Alert } from 'react-native';
import RoleLoginForm from '../../components/RoleLoginForm';
import { loginUser } from '../../storage/userStorage';
import { ROLES } from '../../utils/constants';
import { DEMO_CREDENTIALS } from '../../storage/seedData';

export default function StudentLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');
    const user = await loginUser(ROLES.STUDENT, username, password);
    setLoading(false);

    if (!user) {
      setError('Invalid USN or password.');
      Alert.alert('Login Failed', `Use ${DEMO_CREDENTIALS.student.usn} / student123`);
      return;
    }

    navigation.replace('StudentDashboard', { user });
  }

  return (
    <RoleLoginForm
      roleTitle="Student Login"
      roleIcon="school"
      idLabel="USN"
      idPlaceholder="Enter USN (e.g., 1CR25MC001)"
      passwordPlaceholder="Enter password"
      demoHint={`Demo: ${DEMO_CREDENTIALS.student.usn} / ${DEMO_CREDENTIALS.student.password}`}
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
