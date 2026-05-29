import { ROLES } from '../utils/constants';

const SAMPLE_USN_PREFIX = '1CR25MC';

function createUsn(serialNumber) {
  return `${SAMPLE_USN_PREFIX}${String(serialNumber).padStart(3, '0')}`;
}

export const SEED_USERS = {
  hod: [
    {
      id: 'HOD001',
      role: ROLES.HOD,
      name: 'Prof. Meera N',
      department: 'MCA',
      password: 'hod1234',
    },
  ],
  faculty: [
    {
      id: 'FAC001',
      role: ROLES.FACULTY,
      name: 'Dr. Smith',
      assignedClass: '1st MCA-A',
      department: 'MCA',
      password: 'faculty123',
      active: true,
    },
    {
      id: 'FAC002',
      role: ROLES.FACULTY,
      name: 'Dr. Priya K',
      assignedClass: '1st MCA-B',
      department: 'MCA',
      password: 'faculty123',
      active: true,
    },
  ],
  students: [
    {
      id: createUsn(1),
      role: ROLES.STUDENT,
      usn: createUsn(1),
      name: 'Aarav R',
      classSection: '1st MCA-A',
      password: 'student123',
      present: 18,
    },
    {
      id: createUsn(14),
      role: ROLES.STUDENT,
      usn: createUsn(14),
      name: 'Bhavya M',
      classSection: '1st MCA-A',
      password: 'student123',
      present: 13,
    },
    {
      id: createUsn(29),
      role: ROLES.STUDENT,
      usn: createUsn(29),
      name: 'Charan K',
      classSection: '1st MCA-B',
      password: 'student123',
      present: 16,
    },
    {
      id: createUsn(32),
      role: ROLES.STUDENT,
      usn: createUsn(32),
      name: 'Divya S',
      classSection: '1st MCA-B',
      password: 'student123',
      present: 12,
    },
    {
      id: createUsn(45),
      role: ROLES.STUDENT,
      usn: createUsn(45),
      name: 'Esha P',
      classSection: '1st MCA-A',
      password: 'student123',
      present: 17,
    },
  ],
};

export const DEMO_CREDENTIALS = {
  hod: { id: 'HOD001', password: 'hod1234' },
  faculty: { id: 'FAC001', password: 'faculty123' },
  student: { usn: createUsn(1), password: 'student123' },
};
