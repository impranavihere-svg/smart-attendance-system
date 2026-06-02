import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/theme';

export function getSubstituteDetails(source) {
  if (!source?.isSubstituteClass) {
    return null;
  }

  return {
    originalFaculty: source.originalFaculty,
    substituteFaculty: source.substituteFaculty,
    reason: source.reason,
  };
}

export default function SubstituteClassInfo({ source }) {
  const details = getSubstituteDetails(source);
  if (!details) {
    return null;
  }

  return (
    <View style={styles.box}>
      <Text style={styles.badge}>🔄 Substitute Class</Text>
      <Text style={styles.line}>Original Faculty: {details.originalFaculty}</Text>
      <Text style={styles.line}>Taken By: {details.substituteFaculty}</Text>
      <Text style={styles.line}>Reason: {details.reason}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#E8F4FD',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  badge: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 6,
  },
  line: {
    fontSize: 13,
    fontWeight: '600',
    color: '#455A64',
    marginTop: 2,
  },
});
