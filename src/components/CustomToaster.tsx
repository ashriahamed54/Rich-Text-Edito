import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'info';
export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useCustomToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useCustomToast must be used within CustomToaster');
  return ctx;
};

export const CustomToaster: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              marginBottom: 10,
              padding: '12px 20px',
              borderRadius: 6,
              color: '#fff',
              background: toast.type === 'success' ? '#22c55e' : toast.type === 'error' ? '#ef4444' : '#2563eb',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              minWidth: 200,
              fontWeight: 500,
              fontSize: 15,
              opacity: 0.95,
              transition: 'all 0.2s',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}; 