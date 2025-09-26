import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isLoggedIn, getRole } from '../utils/auth'

const ProtectedRoute = ({ children, roles }) => {
  const location = useLocation()
  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (roles && roles.length > 0) {
    const role = getRole()
    if (!roles.includes(role)) {
      // If not authorized, redirect to a sensible default per role
      const fallback = role === 'admin' ? '/admin/students' : '/student/profile'
      return <Navigate to={fallback} replace />
    }
  }
  return children
}

export default ProtectedRoute
