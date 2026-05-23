import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ConfirmContext = createContext(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}

export function ConfirmProvider({ children }) {
  const [modalConfig, setModalConfig] = useState(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setModalConfig({
        title: options.title || 'Are you sure?',
        subtitle: options.subtitle || 'This action cannot be undone.',
        confirmLabel: options.confirmLabel || 'Delete',
        confirmVariant: options.confirmVariant || 'danger', // danger or primary
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback((value) => {
    if (modalConfig) {
      modalConfig.resolve(value);
      setModalConfig(null);
    }
  }, [modalConfig]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalConfig) {
        handleClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalConfig, handleClose]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {modalConfig && (
        <ConfirmModal
          config={modalConfig}
          onClose={handleClose}
        />
      )}
    </ConfirmContext.Provider>
  );
}

function ConfirmModal({ config, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleAction = (val) => {
    setIsClosing(true);
    setTimeout(() => onClose(val), 200); // match duration-200 of exit animation
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={() => handleAction(false)}
    >
      <div
        className={`bg-[#0D0D1A] border border-[#7C6FFF]/12 p-6 rounded-2xl max-w-[420px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-all duration-200 ${
          isClosing ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
        } font-sans`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center text-danger text-2xl select-none">
            ⚠️
          </div>
        </div>

        {/* Text Details */}
        <h3 className="text-white text-lg font-bold font-display text-center mb-1">
          {config.title}
        </h3>
        <p className="text-muted text-xs sm:text-sm text-center leading-relaxed mb-6 font-light">
          {config.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleAction(false)}
            className="flex-1 px-4 py-2.5 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-lg font-mono text-xs uppercase tracking-wider transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => handleAction(true)}
            className={`flex-1 px-4 py-2.5 ${
              config.confirmVariant === 'primary'
                ? 'bg-primary hover:bg-primary/80 shadow-primary/20 text-white'
                : 'bg-danger hover:bg-danger/80 shadow-danger/20'
            } text-white rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300 font-semibold active:scale-95 shadow-lg`}
          >
            {config.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
