import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TrendRow({ label, count }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.min(count * 20, 100)}%` }]} />
      </View>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  label: { width: 44, color: '#546E7A', fontWeight: '700' },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: '#1E88E5' },
  count: { width: 24, textAlign: 'right', fontWeight: '700', color: '#0D47A1' },
});
