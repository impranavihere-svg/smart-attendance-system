import { readJson, writeJson } from './storageHelpers';

const VERIFICATION_LOGS_KEY = 'campus_verification_logs_v1';

export async function getVerificationLogs() {
  return readJson(VERIFICATION_LOGS_KEY, []);
}

export async function addVerificationLog(entry) {
  const logs = await getVerificationLogs();
  logs.unshift({
    id: `verify-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...entry,
  });
  await writeJson(VERIFICATION_LOGS_KEY, logs.slice(0, 200));
  return logs;
}
