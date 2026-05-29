import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function ScreenLoader({ message = 'Loading...' }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color="#1565C0" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAF3FF',
  },
  text: { marginTop: 10, color: '#1565C0', fontWeight: '600' },
});
