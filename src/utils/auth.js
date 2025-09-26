// Simple static auth using localStorage

export const AUTH_STORAGE_KEY = 'app_auth_role'

export function loginAs(role) {
  localStorage.setItem(AUTH_STORAGE_KEY, role)
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
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
