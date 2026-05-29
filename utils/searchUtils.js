// Filter students by name or USN for admin search
export function filterStudentsByQuery(students, query) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return students;
  }

  return students.filter(
    (student) =>
      student.name.toLowerCase().includes(trimmed) ||
      student.usn.toLowerCase().includes(trimmed)
  );
}
