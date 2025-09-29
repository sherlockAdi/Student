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
]

export default _nav
