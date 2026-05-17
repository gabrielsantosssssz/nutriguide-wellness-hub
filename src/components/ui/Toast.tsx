import React, { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import type { ToastMessage } from '../../types';

interface ToastContextType {
  showToast: (type: ToastMessage['type'], message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return context;
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const icons: Record<string, string> = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  const colors: Record<string, string> = {
    success: 'border-l-4 border-l-primary bg-surface-container-lowest',
    error: 'border-l-4 border-l-error bg-surface-container-lowest',
    warning: 'border-l-4 border-l-tertiary bg-surface-container-lowest',
    info: 'border-l-4 border-l-secondary bg-surface-container-lowest',
  };

  const iconColors: Record<string, string> = {
    success: 'text-primary',
    error: 'text-error',
    warning: 'text-tertiary',
    info: 'text-secondary',
  };

  return (
    <div
      className={`${colors[toast.type]} ${isExiting ? 'animate-toast-exit' : 'animate-toast-enter'} rounded-lg shadow-[0_4px_24px_rgba(7,30,39,0.12)] p-4 flex items-start gap-3 min-w-[300px] max-w-[420px]`}
      role="alert"
      aria-live="polite"
    >
      <span className={`material-symbols-outlined ${iconColors[toast.type]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
        {icons[toast.type]}
      </span>
      <p className="font-body-md text-body-md text-on-surface flex-1">{toast.message}</p>
      <button
        onClick={() => { setIsExiting(true); setTimeout(() => onRemove(toast.id), 300); }}
        className="text-on-surface-variant hover:text-on-surface transition-colors p-0.5"
        aria-label="Fechar notificação"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastMessage['type'], message: string, duration?: number) => {
    const newToast: ToastMessage = {
      id: crypto.randomUUID(),
      type,
      message,
      duration,
    };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2" aria-label="Notificações">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
