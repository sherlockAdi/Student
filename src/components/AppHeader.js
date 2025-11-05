import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CFormInput,
  CButton,
  CListGroup,
  CListGroupItem,
  CSpinner,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilSearch,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
  cilUser,
  cilPhone,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import atmLogo from '../assets/images/atm_global_business_logo4.png'
import { searchStudentByText } from '../api/api'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const navigate = useNavigate()
  const [headerSearch, setHeaderSearch] = useState('')
  const [hdrResults, setHdrResults] = useState([])
  const [hdrOpen, setHdrOpen] = useState(false)
  const [hdrLoading, setHdrLoading] = useState(false)

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!headerRef.current) return
      if (!headerRef.current.contains(e.target)) setHdrOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const runHeaderSearch = async () => {
    const q = headerSearch.trim()
    if (q.length < 2) {
      setHdrResults([])
      setHdrOpen(false)
      return
    }
    setHdrLoading(true)
    try {
      const results = await searchStudentByText(q)
      setHdrResults(results || [])
      setHdrOpen(true)
    } catch (e) {
      setHdrResults([])
      setHdrOpen(true)
    } finally {
      setHdrLoading(false)
    }
  }

  const handlePickHeaderStudent = (student) => {
    setHdrOpen(false)
    setHeaderSearch('')
    navigate(`/admin/update-student?studentId=${encodeURIComponent(student.StudentId)}`)
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <AppBreadcrumb />
        {/* Header quick search (Update Student) - inline dropdown */}
        <div className="d-none d-md-flex align-items-center ms-3 position-relative" style={{ maxWidth: 480, width: 420, flex: 0, flexShrink: 0 }}>
          <div className="input-group" style={{ width: '100%' }}>
            <CFormInput
              placeholder="Search student by name or ID"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  runHeaderSearch()
                }
              }}
            />
            <CButton color="primary" type="button" onClick={runHeaderSearch}>
              {hdrLoading ? <CSpinner size="sm" /> : <CIcon icon={cilSearch} />}
            </CButton>
          </div>
        {/* Spacer to keep logo centered relative to header search width */}
        <div className="d-none d-md-block" style={{ width: 420, flex: 0, flexShrink: 0 }} />
          {hdrOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 2000 }}>
              <div className="bg-white border rounded-3 shadow mt-1" style={{ overflow: 'hidden' }}>
                {hdrLoading && (
                  <div className="p-2 text-center small text-muted">
                    <CSpinner size="sm" className="me-1" /> Searching...
                  </div>
                )}
                {!hdrLoading && hdrResults.length === 0 && (
                  <div className="p-2 small text-muted">No students found</div>
                )}
                {!hdrLoading && hdrResults.length > 0 && (
                  <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                    <CListGroup flush>
                      {hdrResults.map((s) => (
                        <CListGroupItem
                          key={s.StudentId}
                          action
                          className="d-flex justify-content-between align-items-start py-2 px-3"
                          onClick={() => handlePickHeaderStudent(s)}
                        >
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-1" style={{ minWidth: 0 }}>
                              <CIcon icon={cilUser} className="me-2 text-primary" />
                              <strong className="me-2 text-truncate" style={{ maxWidth: 220 }}>{s.StudentName}</strong>
                              <span className="badge bg-info">ID: {s.StudentId}</span>
                            </div>
                            <div className="d-flex align-items-center text-muted small flex-wrap" style={{ gap: 12 }}>
                              <span><CIcon icon={cilPhone} className="me-1" size="sm" />{s.Mobileno1 || 'N/A'}</span>
                              <span>📧 {s.EmailId || 'N/A'}</span>
                              <span>🆔 {s.AdmissionNo || 'N/A'}</span>
                            </div>
                          </div>
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Centered brand logo */}
        <div className="flex-grow-1 d-none d-md-flex justify-content-center">
          <img
            src={atmLogo}
            alt="ATM Group of Colleges"
            style={{
              height: 48,
              width: 'auto',
              backgroundColor: '#fff',
              borderRadius: 6,
              padding: '4px 8px',
              objectFit: 'contain',
            }}
          />
        </div>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      {/* <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer> */}
    </CHeader>
  )
}

export default AppHeader
