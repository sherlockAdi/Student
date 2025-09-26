import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import atmLogo from '../assets/images/atm_global_business_logo4.png'

// sidebar nav config
import navigation from '../_nav'
import { getRole, isLoggedIn } from '../utils/auth'

function filterByRole(items, role) {
  const allow = (item) => {
    if (!item) return false
    if (item.roles && item.roles.length > 0) {
      return role && item.roles.includes(role)
    }
    return true
  }
  return items
    .filter((it) => allow(it))
    .map((it) => {
      if (it.items && Array.isArray(it.items)) {
        return { ...it, items: filterByRole(it.items, role) }
      }
      return it
    })
}

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const role = isLoggedIn() ? getRole() : null
  const navItems = role ? filterByRole(navigation, role) : navigation

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <img
            src={atmLogo}
            alt="ATM Group of Colleges"
            className="sidebar-brand-full"
            style={{
              height: 64,
              width: 'auto',
              maxWidth: '100%',
              backgroundColor: '#fff',
              borderRadius: 6,
              padding: '6px 10px',
              objectFit: 'contain',
            }}
          />
          <img
            src={atmLogo}
            alt="ATM"
            className="sidebar-brand-narrow"
            style={{
              height: 40,
              width: 'auto',
              backgroundColor: '#fff',
              borderRadius: 6,
              padding: 4,
              objectFit: 'contain',
            }}
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navItems} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
