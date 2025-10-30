import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader, ToastProvider } from '../components/index'

const DefaultLayout = () => {
  return (
    <ToastProvider>
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </div>
    </ToastProvider>
  )
}

export default DefaultLayout
