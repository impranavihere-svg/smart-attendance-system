import { readJson, writeJson } from './storageHelpers';
import { SEED_USERS } from './seedData';
import { ROLES } from '../utils/constants';

const USERS_KEY = 'rbac_users_v1';
const SESSION_USER_KEY = 'rbac_current_user_v1';

export async function bootstrapUsers() {
  const existing = await readJson(USERS_KEY, null);
  if (existing) {
    return existing;
  }

  const users = {
    hod: SEED_USERS.hod,
    faculty: SEED_USERS.faculty,
    students: SEED_USERS.students,
  };

  await writeJson(USERS_KEY, users);
  return users;
}

export async function getAllUsers() {
  return bootstrapUsers();
}

export async function getStudents() {
  const users = await bootstrapUsers();
  return users.students;
}

export async function getFaculty() {
  const users = await bootstrapUsers();
  return users.faculty;
}

export async function getHodUsers() {
  const users = await bootstrapUsers();
  return users.hod;
}

export async function getStudentByUsn(usn) {
  const students = await getStudents();
  return students.find((s) => s.usn === usn.trim().toUpperCase()) || null;
}

export async function getFacultyById(facultyId) {
  const faculty = await getFaculty();
  return faculty.find((f) => f.id === facultyId.trim().toUpperCase()) || null;
}

export async function getHodById(hodId) {
  const hodList = await getHodUsers();
  return hodList.find((h) => h.id === hodId.trim().toUpperCase()) || null;
}

export async function getStudentsByClass(classSection) {
  const students = await getStudents();
  return students.filter((s) => s.classSection === classSection);
}

export async function updateFacultyList(updatedFaculty) {
  const users = await bootstrapUsers();
  users.faculty = updatedFaculty;
  await writeJson(USERS_KEY, users);
  return users.faculty;
}

export async function loginUser(role, identifier, password) {
  await bootstrapUsers();
  const normalizedId = identifier.trim().toUpperCase();

  if (role === ROLES.HOD) {
    const hod = await getHodById(normalizedId);
    if (hod && hod.password === password) {
      await saveCurrentUser(hod);
      return hod;
    }
    return null;
  }

  if (role === ROLES.FACULTY) {
    const faculty = await getFacultyById(normalizedId);
    if (faculty && faculty.password === password && faculty.active !== false) {
      await saveCurrentUser(faculty);
      return faculty;
    }
    return null;
  }

  if (role === ROLES.STUDENT) {
    const student = await getStudentByUsn(normalizedId);
    if (student && student.password === password) {
      await saveCurrentUser(student);
      return student;
    }
    return null;
  }

  return null;
}

export async function saveCurrentUser(user) {
  await writeJson(SESSION_USER_KEY, user);
}

export async function getCurrentUser() {
  return readJson(SESSION_USER_KEY, null);
}

export async function logoutCurrentUser() {
  await writeJson(SESSION_USER_KEY, null);
}
