# QR Based Smart Attendance System with Low Attendance Alert

A beginner-friendly React Native mini project built with Expo.

## Features

- Home screen with clean dashboard and easy navigation
- Mark Attendance screen with:
  - Student Name input
  - USN input
  - QR scanner
  - Local save using AsyncStorage
- Attendance Report screen with:
  - Student cards
  - Attendance percentage calculation
  - Red low attendance warning for below 75%
- Blue and white modern UI with rounded cards and simple icons
- Loading states and basic error handling

## Formula Used

Attendance % = (Present / Total Classes) x 100

In this project, default total classes are set to `20`.

## Sample QR Data

Use this QR text while testing:

`CLASS101`

Any other QR value is treated as invalid.

## Sample Test Records

The app auto-loads sample records in report screen (first run):

- Aarav R - 1CR25MC001 - Present 18 / 20
- Bhavya M - 1CR25MC014 - Present 13 / 20
- Charan K - 1CR25MC029 - Present 16 / 20

## Project Structure

```text
qr-smart-attendance/
├── App.js
├── screens/
│   ├── HomeScreen.js
│   ├── AttendanceScreen.js
│   └── ReportScreen.js
├── components/
│   ├── PrimaryButton.js
│   └── StudentCard.js
├── storage/
│   └── attendanceStorage.js
├── utils/
│   ├── constants.js
│   ├── qrValidator.js
│   └── attendanceUtils.js
└── README.md
```

## Installation Commands

If starting from scratch:

```bash
npx create-expo-app@latest qr-smart-attendance --template blank
cd qr-smart-attendance
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage expo-barcode-scanner @expo/vector-icons expo-font
```

## Run Instructions

```bash
npm install
npm start
```

Then in Expo terminal:

- Press `a` for Android emulator/device
- Press `w` for web
- Scan QR with Expo Go app on your phone

## Beginner Explanation of Major Parts

1. `App.js`
   - Sets up navigation stack.
   - Connects Home, Mark Attendance, and Report screens.

2. `screens/AttendanceScreen.js`
   - Collects Name and USN.
   - Requests camera permission.
   - Scans QR and validates class code.
   - Saves attendance locally.

3. `storage/attendanceStorage.js`
   - Handles AsyncStorage read/write.
   - Stores student summary and attendance logs.
   - Provides report data with percentages.

4. `utils/qrValidator.js`
   - Keeps QR validation logic in one place for easy reuse.

5. `utils/attendanceUtils.js`
   - Calculates percentage and checks low attendance condition.

6. `screens/ReportScreen.js`
   - Loads and refreshes report data.
   - Displays colored cards and low attendance warning text.

## Notes

- No backend, Firebase, authentication, or ML is used.
- Everything works locally using AsyncStorage.
- You can clear app storage from device settings to reset data.
