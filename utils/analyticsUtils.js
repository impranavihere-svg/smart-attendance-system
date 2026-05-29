import { calculateAttendancePercentage, isLowAttendance } from './attendanceUtils';
import { TOTAL_CLASSES, DEPARTMENT_NAME } from './constants';

export function enrichStudents(students) {
  return students.map((student) => ({
    ...student,
    totalClasses: student.totalClasses || TOTAL_CLASSES,
    percentage: calculateAttendancePercentage(
      student.present,
      student.totalClasses || TOTAL_CLASSES
    ),
  }));
}

export function getDepartmentStats(students) {
  const enriched = enrichStudents(students);
  const lowCount = enriched.filter((s) => isLowAttendance(s.percentage)).length;
  const avgPercentage =
    enriched.length === 0
      ? 0
      : Number(
          (
            enriched.reduce((sum, s) => sum + s.percentage, 0) / enriched.length
          ).toFixed(2)
        );

  return {
    departmentName: DEPARTMENT_NAME,
    totalStudents: enriched.length,
    lowAttendanceCount: lowCount,
    departmentAttendancePercentage: avgPercentage,
    students: enriched,
  };
}

export function getClassStats(students, classSection) {
  const classStudents = enrichStudents(
    students.filter((s) => s.classSection === classSection)
  );
  const presentTotal = classStudents.reduce((sum, s) => sum + s.present, 0);
  const capacity = classStudents.length * TOTAL_CLASSES;
  const classPercentage =
    capacity === 0
      ? 0
      : Number(((presentTotal / capacity) * 100).toFixed(2));

  return {
    classSection,
    totalStudents: classStudents.length,
    presentCount: presentTotal,
    absentCount: Math.max(capacity - presentTotal, 0),
    classAttendancePercentage: classPercentage,
    lowAttendanceStudents: classStudents.filter((s) =>
      isLowAttendance(s.percentage)
    ),
    students: classStudents,
  };
}

export function buildAttendanceTrend(logs) {
  const buckets = {};
  logs.forEach((log) => {
    const day = new Date(log.markedAt).toLocaleDateString(undefined, {
      weekday: 'short',
    });
    buckets[day] = (buckets[day] || 0) + 1;
  });

  return Object.entries(buckets).map(([label, count]) => ({ label, count }));
}

export function getSessionStats(sessions, logs) {
  const closed = sessions.filter((s) => s.status === 'closed').length;
  const active = sessions.filter((s) => s.status === 'active').length;
  return {
    totalSessions: sessions.length,
    activeSessions: active,
    closedSessions: closed,
    totalMarks: logs.length,
  };
}
