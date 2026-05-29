import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AnalyticsBar({ label, value, color = '#1565C0' }) {
  const width = Math.min(Math.max(Number(value) || 0, 0), 100);
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${width}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: '#455A64', fontWeight: '600' },
  value: { color: '#0D47A1', fontWeight: '800' },
  track: {
    height: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 8 },
});
