import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import ReportScreen from './screens/ReportScreen';
import AdminLoginScreen from './screens/admin/AdminLoginScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminStudentListScreen from './screens/admin/AdminStudentListScreen';
import AdminAttendanceReportScreen from './screens/admin/AdminAttendanceReportScreen';
import AdminLowAttendanceScreen from './screens/admin/AdminLowAttendanceScreen';
import HodLoginScreen from './screens/hod/HodLoginScreen';
import HodDashboardScreen from './screens/hod/HodDashboardScreen';
import HodStudentsScreen from './screens/hod/HodStudentsScreen';
import HodFacultyScreen from './screens/hod/HodFacultyScreen';
import HodAnalyticsScreen from './screens/hod/HodAnalyticsScreen';
import HodReportsScreen from './screens/hod/HodReportsScreen';
import HodLowAttendanceScreen from './screens/hod/HodLowAttendanceScreen';
import HodFacultyManagementScreen from './screens/hod/HodFacultyManagementScreen';
import HodVerificationLogsScreen from './screens/hod/HodVerificationLogsScreen';
import FacultyLoginScreen from './screens/faculty/FacultyLoginScreen';
import FacultyDashboardScreen from './screens/faculty/FacultyDashboardScreen';
import FacultyCreateSessionScreen from './screens/faculty/FacultyCreateSessionScreen';
import FacultyStudentsScreen from './screens/faculty/FacultyStudentsScreen';
import FacultyReportsScreen from './screens/faculty/FacultyReportsScreen';
import FacultyLowAttendanceScreen from './screens/faculty/FacultyLowAttendanceScreen';
import FacultyAnalyticsScreen from './screens/faculty/FacultyAnalyticsScreen';
import StudentLoginScreen from './screens/student/StudentLoginScreen';
import StudentDashboardScreen from './screens/student/StudentDashboardScreen';
import StudentMarkAttendanceScreen from './screens/student/StudentMarkAttendanceScreen';
import StudentRecordsScreen from './screens/student/StudentRecordsScreen';
import StudentImprovementPlanScreen from './screens/student/StudentImprovementPlanScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#0D47A1' },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '700' },
  contentStyle: { backgroundColor: '#F5F9FF' },
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Smart Attendance' }} />

        {/* Legacy student quick access */}
        <Stack.Screen name="MarkAttendance" component={AttendanceScreen} options={{ title: 'Mark Attendance' }} />
        <Stack.Screen name="AttendanceReport" component={ReportScreen} options={{ title: 'Attendance Report' }} />

        {/* Legacy admin module */}
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: 'Admin Login' }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard', headerBackVisible: false }} />
        <Stack.Screen name="AdminStudentList" component={AdminStudentListScreen} options={{ title: 'Student List' }} />
        <Stack.Screen name="AdminAttendanceReport" component={AdminAttendanceReportScreen} options={{ title: 'Attendance Reports' }} />
        <Stack.Screen name="AdminLowAttendance" component={AdminLowAttendanceScreen} options={{ title: 'Low Attendance Alerts' }} />

        {/* HOD module */}
        <Stack.Screen name="HodLogin" component={HodLoginScreen} options={{ title: 'HOD Login' }} />
        <Stack.Screen name="HodDashboard" component={HodDashboardScreen} options={{ title: 'HOD Dashboard', headerBackVisible: false }} />
        <Stack.Screen name="HodStudents" component={HodStudentsScreen} options={{ title: 'All Students' }} />
        <Stack.Screen name="HodFaculty" component={HodFacultyScreen} options={{ title: 'All Faculty' }} />
        <Stack.Screen name="HodAnalytics" component={HodAnalyticsScreen} options={{ title: 'Department Analytics' }} />
        <Stack.Screen name="HodReports" component={HodReportsScreen} options={{ title: 'Attendance Reports' }} />
        <Stack.Screen name="HodLowAttendance" component={HodLowAttendanceScreen} options={{ title: 'Low Attendance Alerts' }} />
        <Stack.Screen name="HodFacultyManagement" component={HodFacultyManagementScreen} options={{ title: 'Faculty Management' }} />
        <Stack.Screen name="HodVerificationLogs" component={HodVerificationLogsScreen} options={{ title: 'Verification Logs' }} />

        {/* Faculty module */}
        <Stack.Screen name="FacultyLogin" component={FacultyLoginScreen} options={{ title: 'Faculty Login' }} />
        <Stack.Screen name="FacultyDashboard" component={FacultyDashboardScreen} options={{ title: 'Faculty Dashboard', headerBackVisible: false }} />
        <Stack.Screen name="FacultyCreateSession" component={FacultyCreateSessionScreen} options={{ title: 'Create Session' }} />
        <Stack.Screen name="FacultyStudents" component={FacultyStudentsScreen} options={{ title: 'Assigned Students' }} />
        <Stack.Screen name="FacultyReports" component={FacultyReportsScreen} options={{ title: 'Class Reports' }} />
        <Stack.Screen name="FacultyLowAttendance" component={FacultyLowAttendanceScreen} options={{ title: 'Low Attendance' }} />
        <Stack.Screen name="FacultyAnalytics" component={FacultyAnalyticsScreen} options={{ title: 'Class Analytics' }} />

        {/* Student module */}
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} options={{ title: 'Student Login' }} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} options={{ title: 'Student Dashboard', headerBackVisible: false }} />
        <Stack.Screen name="StudentMarkAttendance" component={StudentMarkAttendanceScreen} options={{ title: 'Mark Attendance' }} />
        <Stack.Screen name="StudentRecords" component={StudentRecordsScreen} options={{ title: 'My Records' }} />
        <Stack.Screen
          name="StudentImprovementPlan"
          component={StudentImprovementPlanScreen}
          options={{ title: 'Improvement Plan' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
