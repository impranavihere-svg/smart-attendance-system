import { readJson, writeJson } from './storageHelpers';
import { TOTAL_CLASSES } from '../utils/constants';
import { calculateAttendancePercentage } from '../utils/attendanceUtils';
import { bootstrapUsers, getStudents } from './userStorage';

const ATTENDANCE_LOG_KEY = 'attendance_logs_v1';
const STUDENT_SUMMARY_KEY = 'student_summary_v1';

async function syncSummaryFromUsers() {
  const users = await bootstrapUsers();
  const existing = await readJson(STUDENT_SUMMARY_KEY, []);

  const merged = users.students.map((student) => {
    const found = existing.find((item) => item.usn === student.usn);
    return {
      name: student.name,
      usn: student.usn,
      classSection: student.classSection,
      present: found?.present ?? student.present ?? 0,
      totalClasses: TOTAL_CLASSES,
    };
  });

  await writeJson(STUDENT_SUMMARY_KEY, merged);
  return merged;
}

export async function bootstrapSampleData() {
  return syncSummaryFromUsers();
}

export async function markAttendance({ name, usn, classCode, sessionId, ...extraFields }) {
  const summary = await syncSummaryFromUsers();
  const logs = await readJson(ATTENDANCE_LOG_KEY, []);
  const normalizedUsn = usn.trim().toUpperCase();

  const duplicate = logs.find(
    (log) => log.usn === normalizedUsn && log.sessionId === sessionId
  );
  if (duplicate) {
    throw new Error('Attendance already marked for this session.');
  }

  const studentIndex = summary.findIndex((student) => student.usn === normalizedUsn);

  if (studentIndex >= 0) {
    summary[studentIndex].present += 1;
    summary[studentIndex].name = name.trim();
  } else {
    summary.push({
      name: name.trim(),
      usn: normalizedUsn,
      present: 1,
      totalClasses: TOTAL_CLASSES,
    });
  }

  logs.unshift({
    id: `${Date.now()}`,
    name: name.trim(),
    usn: normalizedUsn,
    classCode,
    sessionId: sessionId || null,
    markedAt: new Date().toISOString(),
    ...extraFields,
  });

  await writeJson(STUDENT_SUMMARY_KEY, summary);
  await writeJson(ATTENDANCE_LOG_KEY, logs);
}

export async function markSecureAttendance({ student, session }) {
  const substituteFields = session?.isSubstituteClass
    ? {
        isSubstituteClass: true,
        originalFaculty: session.originalFaculty,
        substituteFaculty: session.substituteFaculty,
        reason: session.reason,
      }
    : {};

  await markAttendance({
    name: student.name,
    usn: student.usn,
    classCode: session.sessionCode,
    sessionId: session.id,
    ...substituteFields,
  });
}

export async function getAttendanceReport() {
  const summary = await syncSummaryFromUsers();
  const logs = await readJson(ATTENDANCE_LOG_KEY, []);

  const report = summary.map((student) => ({
    ...student,
    percentage: calculateAttendancePercentage(
      student.present,
      student.totalClasses
    ),
  }));

  return { report, logs };
}

export async function getStudentRecords(usn) {
  const { report, logs } = await getAttendanceReport();
  const student = report.find((item) => item.usn === usn.toUpperCase());
  const history = logs.filter((log) => log.usn === usn.toUpperCase());
  return { student, history };
}

export async function getAdminDashboardData() {
  await bootstrapSampleData();
  const { report, logs } = await getAttendanceReport();
  const students = await getStudents();

  return {
    totalStudents: report.length,
    totalEntries: logs.length,
    students: report,
    logs,
    rawStudents: students,
  };
}

export async function getHodDashboardData() {
  const data = await getAdminDashboardData();
  const faculty = (await bootstrapUsers()).faculty;
  return { ...data, faculty };
}
