import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLoader from '../../components/ScreenLoader';
import { getVerificationLogs } from '../../storage/verificationStorage';
import { formatDateTime } from '../../utils/dateUtils';

function LogCard({ log }) {
  return (
    <View style={[styles.card, log.success ? styles.pass : styles.fail]}>
      <Text style={styles.title}>{log.studentName} ({log.usn})</Text>
      <Text style={styles.meta}>Session Code: {log.sessionCode}</Text>
      <Text style={styles.meta}>GPS: {log.gpsValid ? 'Valid' : 'Invalid'} | Wi-Fi: {log.wifiValid ? 'Valid' : 'Invalid'}</Text>
      <Text style={styles.meta}>{log.details}</Text>
      <Text style={styles.time}>{formatDateTime(log.timestamp)}</Text>
    </View>
  );
}

export default function HodVerificationLogsScreen() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLogs(await getVerificationLogs());
        setLoading(false);
      })();
    }, [])
  );

  if (loading) return <ScreenLoader message="Loading verification logs..." />;

  return (
    <View style={styles.container}>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LogCard log={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No verification logs yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#EAF3FF' },
  list: { paddingBottom: 24 },
  card: { borderRadius: 14, padding: 14, marginBottom: 10, elevation: 2 },
  pass: { backgroundColor: '#E8F5E9', borderLeftWidth: 5, borderLeftColor: '#2E7D32' },
  fail: { backgroundColor: '#FFEBEE', borderLeftWidth: 5, borderLeftColor: '#C62828' },
  title: { fontWeight: '800', color: '#0D47A1' },
  meta: { marginTop: 4, color: '#455A64', fontWeight: '600' },
  time: { marginTop: 8, color: '#1565C0', fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 30, color: '#78909C', fontWeight: '600' },
});
