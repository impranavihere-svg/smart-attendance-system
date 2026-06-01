export function calculateAttendancePercentage(present, totalClasses) {
  if (!totalClasses || totalClasses <= 0) {
    return 0;
  }

  return Number(((present / totalClasses) * 100).toFixed(2));
}

export function isLowAttendance(percentage) {
  return percentage < 75;
}

const STUDENT_ALERT_QUOTES = {
  caution: 'Small improvements every day lead to big results.',
  warning: 'Discipline is choosing between what you want now and what you want most.',
  critical: 'Your future is created by what you do today, not tomorrow.',
};

export function getStudentAttendanceAlert(percentage) {
  if (percentage >= 75) {
    return null;
  }

  if (percentage >= 70) {
    return { tier: 'caution', title: 'Attendance Alert', quote: STUDENT_ALERT_QUOTES.caution };
  }

  if (percentage >= 60) {
    return { tier: 'warning', title: 'Attendance Alert', quote: STUDENT_ALERT_QUOTES.warning };
  }

  return { tier: 'critical', title: 'Attendance Alert', quote: STUDENT_ALERT_QUOTES.critical };
}

export function estimateClassesToReachTarget(present, totalClasses, targetPercentage) {
  const current = calculateAttendancePercentage(present, totalClasses);
  if (current >= targetPercentage) {
    return 0;
  }

  const target = targetPercentage / 100;
  const needed = (target * totalClasses - present) / (1 - target);
  return Math.max(0, Math.ceil(needed));
}
