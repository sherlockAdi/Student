import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://Atm.edu.in" target="_blank" rel="noopener noreferrer">
          Atm.edu.in
        </a>
        <span className="ms-1">&copy; 2025 Aditya Kumar Dwivedi</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://Atm.edu.in" target="_blank" rel="noopener noreferrer">
          Atm.edu.in
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
