// Simple static auth using localStorage

export const AUTH_STORAGE_KEY = 'app_auth_role'
export const STUDENT_ID_KEY = 'studentId'

export function loginAs(role) {
  localStorage.setItem(AUTH_STORAGE_KEY, role)
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(STUDENT_ID_KEY)
  localStorage.removeItem('studentData')
  localStorage.removeItem('authToken')
}

export function getRole() {
  return localStorage.getItem(AUTH_STORAGE_KEY)
}

export function isLoggedIn() {
  return !!getRole()
}

export function isAdmin() {
  return getRole() === 'admin'
}

export function isStudent() {
  return getRole() === 'student'
}

export function getStudentId() {
  return localStorage.getItem(STUDENT_ID_KEY)
}
