export function calculateAttendancePercentage(present, totalClasses) {
  if (!totalClasses || totalClasses <= 0) {
    return 0;
  }

  return Number(((present / totalClasses) * 100).toFixed(2));
}

export function isLowAttendance(percentage) {
  return percentage < 75;
}
