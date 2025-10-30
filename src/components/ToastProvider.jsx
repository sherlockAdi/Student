import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CToaster, CToast, CToastHeader, CToastBody } from '@coreui/react'

const ToastContext = createContext({
  pushToast: () => {},
  clearToasts: () => {},
})

const typeToColor = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'danger',
  danger: 'danger',
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback(({ title, message, type = 'info', autohide = true, delay = 5000 }) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [
      ...prev,
      { id, title, message, type: typeToColor[type] || 'info', autohide, delay },
    ])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearToasts = useCallback(() => setToasts([]), [])

  const value = useMemo(() => ({ pushToast, clearToasts }), [pushToast, clearToasts])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <CToaster placement="top-end" className="p-3" push={null}>
        {toasts.map((t) => (
          <CToast
            key={t.id}
            autohide={t.autohide}
            delay={t.delay}
            visible
            color={t.type}
            className="shadow-lg"
            style={{ minWidth: '420px', maxWidth: '560px', borderRadius: '10px' }}
            onClose={() => removeToast(t.id)}
          >
            {t.title ? (
              <CToastHeader closeButton style={{ fontSize: '16px' }}>
                <strong className="me-auto" style={{ fontSize: '16px' }}>{t.title}</strong>
              </CToastHeader>
            ) : null}
            <CToastBody style={{ fontSize: '16px', padding: '14px 16px' }}>{t.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
