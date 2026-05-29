import { readJson, writeJson } from './storageHelpers';

const SESSIONS_KEY = 'attendance_sessions_v1';

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function getAllSessions() {
  return readJson(SESSIONS_KEY, []);
}

export async function getActiveSessions() {
  const sessions = await getAllSessions();
  const now = Date.now();
  return sessions.filter(
    (session) =>
      session.status === 'active' && new Date(session.endsAt).getTime() > now
  );
}

export async function getActiveSessionForClass(classSection) {
  const active = await getActiveSessions();
  return active.find((s) => s.classSection === classSection) || null;
}

export async function getSessionsByFaculty(facultyId) {
  const sessions = await getAllSessions();
  return sessions.filter((s) => s.facultyId === facultyId);
}

export async function createAttendanceSession({
  facultyId,
  facultyName,
  classSection,
  durationMinutes,
}) {
  const sessions = await getAllSessions();
  const now = new Date();
  const endsAt = new Date(now.getTime() + durationMinutes * 60 * 1000);
  const sessionCode = generateCode();

  const session = {
    id: `session-${Date.now()}`,
    facultyId,
    facultyName,
    classSection,
    sessionCode,
    durationMinutes,
    startedAt: now.toISOString(),
    endsAt: endsAt.toISOString(),
    status: 'active',
  };

  sessions.unshift(session);
  await writeJson(SESSIONS_KEY, sessions);
  return session;
}

export async function closeSession(sessionId) {
  const sessions = await getAllSessions();
  const updated = sessions.map((session) =>
    session.id === sessionId ? { ...session, status: 'closed' } : session
  );
  await writeJson(SESSIONS_KEY, updated);
  return updated.find((s) => s.id === sessionId) || null;
}

export async function findSessionByCode(sessionCode) {
  const active = await getActiveSessions();
  return (
    active.find(
      (s) => s.sessionCode.toUpperCase() === sessionCode.trim().toUpperCase()
    ) || null
  );
}

export async function isSessionValid(session) {
  if (!session || session.status !== 'active') {
    return false;
  }
  return new Date(session.endsAt).getTime() > Date.now();
}
