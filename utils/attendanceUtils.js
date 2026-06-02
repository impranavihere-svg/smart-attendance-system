export function calculateAttendancePercentage(present, totalClasses) {
  if (!totalClasses || totalClasses <= 0) {
    return 0;
  }

  return Number(((present / totalClasses) * 100).toFixed(2));
}

export function isLowAttendance(percentage) {
  return percentage < 75;
}

export const STUDENT_ALERT_QUOTES = {
  caution: [
    'Small improvements every day lead to big results.',
    'Consistency today creates success tomorrow.',
    'Every class attended is a step closer to your goals.',
    'Progress is built one day at a time.',
    'Stay focused; small efforts add up.',
  ],
  warning: [
    'Discipline is choosing between what you want now and what you want most.',
    'Success comes from consistency, not motivation.',
    'Your habits determine your future.',
    'Great achievements require regular effort.',
    'Missing classes today may create challenges tomorrow.',
  ],
  critical: [
    'Your future is created by what you do today, not tomorrow.',
    'Every missed opportunity can become a missed achievement.',
    'It is never too late to turn things around.',
    'The comeback starts with the next class you attend.',
    'Small actions today can completely change tomorrow.',
  ],
};

export function pickRandomAlertQuote(tier) {
  const quotes = STUDENT_ALERT_QUOTES[tier];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getStudentAttendanceAlertTier(percentage) {
  if (percentage >= 75) {
    return null;
  }

  if (percentage >= 70) {
    return { tier: 'caution', title: 'Attendance Alert' };
  }

  if (percentage >= 60) {
    return { tier: 'warning', title: 'Attendance Alert' };
  }

  return { tier: 'critical', title: 'Attendance Alert' };
}

export function getStudentAttendanceAlert(percentage, quote) {
  const tierInfo = getStudentAttendanceAlertTier(percentage);
  if (!tierInfo) {
    return null;
  }

  return {
    ...tierInfo,
    quote: quote ?? pickRandomAlertQuote(tierInfo.tier),
  };
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
