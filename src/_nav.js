import React from 'react'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Role Panels',
  },
  {
    component: CNavItem,
    name: 'Students',
    to: '/admin/students',
    roles: ['admin'],
  },
  {
    component: CNavItem,
    name: 'Registration',
    to: '/admin/registration',
    roles: ['admin'],
  },
  {
    component: CNavItem,
    name: 'Fees',
    to: '/admin/fees',
    roles: ['admin'],
  },
  {
    component: CNavItem,
    name: 'My Profile',
    to: '/student/profile',
    roles: ['student'],
  },
  {
    component: CNavItem,
    name: 'My Fees',
    to: '/student/fees',
    roles: ['student'],
  },
  {
    component: CNavItem,
    name: 'Study Portal',
    to: '/student/study-portal',
    roles: ['student'],
  },
]

export default _nav
