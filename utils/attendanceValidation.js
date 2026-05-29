import { AppState } from 'react-native';
import { findSessionByCode, isSessionValid } from '../storage/sessionStorage';
import { validateCampusLocation } from './locationValidation';
import {
  validateCollegeWifi,
  validateCampusNetworkOrLocation,
} from './networkValidation';
import { addVerificationLog } from '../storage/verificationStorage';

export async function validateSecureAttendance({
  student,
  sessionCode,
  appState = AppState.currentState,
}) {
  const failures = [];

  if (appState !== 'active') {
    failures.push('App must remain active while submitting attendance.');
  }

  const session = await findSessionByCode(sessionCode);
  if (!session) {
    failures.push('No active attendance session found for this code.');
  } else if (!(await isSessionValid(session))) {
    failures.push('Attendance session has expired.');
  } else if (session.classSection !== student.classSection) {
    failures.push('Session code is not valid for your class section.');
  }

  const locationResult = await validateCampusLocation();
  const wifiResult = await validateCollegeWifi();
  const campusResult = await validateCampusNetworkOrLocation(
    locationResult,
    wifiResult
  );

  if (!campusResult.valid) {
    failures.push(campusResult.message);
  }

  await addVerificationLog({
    usn: student.usn,
    studentName: student.name,
    sessionCode: sessionCode.toUpperCase(),
    gpsValid: locationResult.valid,
    wifiValid: wifiResult.valid,
    success: failures.length === 0,
    details: failures.length ? failures.join(' ') : 'All checks passed.',
  });

  if (failures.length > 0) {
    return { valid: false, failures, session: session || null };
  }

  return { valid: true, session, locationResult, wifiResult };
}
