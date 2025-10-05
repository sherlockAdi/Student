import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import ProtectedRoute from './ProtectedRoute'

const AppContent = () => {
  return (
    // <CContainer >
   
      <Suspense classname='.px-4' fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            if (!route.element) return null
            const Element = route.element
            const element = route.roles ? (
              <ProtectedRoute roles={route.roles}>
                <Element />
              </ProtectedRoute>
            ) : (
              <Element />
            )
            return (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                element={element}
              />
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
   
  )
}

export default React.memo(AppContent)
