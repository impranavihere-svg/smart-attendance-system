import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StatCard({ title, value, icon, accent = '#1565C0' }) {
  return (
    <View style={[styles.card, { borderLeftColor: accent }]}>
      <Ionicons name={icon} size={24} color={accent} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    margin: 4,
    borderLeftWidth: 5,
    elevation: 2,
  },
  value: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '800',
    color: '#0D47A1',
  },
  title: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#546E7A',
  },
});
