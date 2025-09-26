import React from 'react'
import { Navigate } from 'react-router-dom'
import { getRole, isLoggedIn } from '../../utils/auth'

// Role-aware dashboard: redirects to the appropriate home per role
const RoleDashboard = () => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  const role = getRole()
  const target = role === 'admin' ? '/admin/dashboard' : '/student/profile'
  return <Navigate to={target} replace />
}

export default RoleDashboard
