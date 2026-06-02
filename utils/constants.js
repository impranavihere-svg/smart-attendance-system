export const VALID_CLASS_CODE = 'CLASS101';
export const TOTAL_CLASSES = 20;
export const LOW_ATTENDANCE_THRESHOLD = 75;
export const DEPARTMENT_NAME = 'Master of Computer Applications';

export const ROLES = {
  HOD: 'hod',
  FACULTY: 'faculty',
  STUDENT: 'student',
};

// Demo campus geofence (Bangalore reference point for mini project)
export const CAMPUS_LOCATION = {
  latitude: 12.9716,
  longitude: 77.5946,
  radiusMeters: 800,
};

// Authorized college Wi-Fi name keywords (demo/local validation)
export const AUTHORIZED_WIFI_KEYWORDS = [
  'CollegeWiFi',
  'CampusNet',
  'MCA-WiFi',
  'CMRIT',
];

// Allow demo mode in Expo Go when GPS/Wi-Fi checks are unavailable
export const ALLOW_DEMO_CAMPUS_BYPASS = true;

export const SESSION_DURATION_OPTIONS = [10, 15, 30, 45];

export const SUBSTITUTE_REASONS = [
  'Faculty Leave',
  'Emergency',
  'Meeting Duty',
  'Other',
];
