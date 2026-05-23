import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      if (next.length > 3) {
        return next.slice(-3); // Keep max 3 visible
      }
      return next;
    });
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    info: (msg) => showToast(msg, 'info'),
    warning: (msg) => showToast(msg, 'warning'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Portal/Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none font-sans">
        {toasts.map((t) => (
          <ToastCard
            key={t.id}
            id={t.id}
            message={t.message}
            type={t.type}
            onClose={() => dismissToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ id, message, type, onClose }) {
  const [isDismissing, setIsDismissing] = useState(false);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          border: 'border-l-4 border-l-success',
          text: 'text-success',
        };
      case 'error':
        return {
          border: 'border-l-4 border-l-danger',
          text: 'text-danger',
        };
      case 'warning':
        return {
          border: 'border-l-4 border-l-warning',
          text: 'text-warning',
        };
      case 'info':
      default:
        return {
          border: 'border-l-4 border-l-secondary',
          text: 'text-secondary',
        };
    }
  };

  const styles = getStyles();

  // Self-dismiss mechanism
  useState(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);
    return () => clearTimeout(timer);
  });

  const handleClose = () => {
    setIsDismissing(true);
    setTimeout(onClose, 300); // Wait for slide-out animation to complete
  };

  return (
    <div
      className={`pointer-events-auto bg-[#13132A] border border-white/5 ${styles.border} p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-start gap-3 transition-all duration-300 transform ${
        isDismissing
          ? 'animate-slide-out opacity-0 translate-x-12'
          : 'animate-slide-in translate-x-0'
      }`}
    >
      <div className="flex-1 text-xs font-semibold text-text leading-relaxed">
        {message}
      </div>
      <button
        onClick={handleClose}
        className="text-muted hover:text-white transition-colors text-xs font-bold font-mono px-1 active:scale-95"
      >
        ✕
      </button>

      {/* Progress Bar Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden rounded-b-xl">
        <div
          className={`h-full ${
            type === 'success'
              ? 'bg-success'
              : type === 'error'
              ? 'bg-danger'
              : type === 'warning'
              ? 'bg-warning'
              : 'bg-secondary'
          } animate-deplete`}
        />
      </div>
    </div>
  );
}
