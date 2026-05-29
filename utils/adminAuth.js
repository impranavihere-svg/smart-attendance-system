// Hardcoded admin credentials for teacher login (local only, no backend)
export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = '1234';

export function validateAdminLogin(username, password) {
  return (
    username.trim().toLowerCase() === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
  );
}
