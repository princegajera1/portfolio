import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxWidth = 'md' // 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}) {
  const modalRef = useRef(null);

  // Focus trap and escape close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidths = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={cn(
              'relative w-full overflow-hidden border border-border-dark bg-[#0A0A0F]/90 backdrop-blur-2xl rounded-2xl shadow-2xl z-10 flex flex-col font-sans',
              maxWidths[maxWidth],
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-dark px-6 py-4">
              <h3 className="text-base font-bold font-display text-text-primary-dark">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-text-secondary-dark hover:text-text-primary-dark transition-colors font-mono text-sm p-1.5 rounded-lg hover:bg-white/5 active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Contents */}
            <div className="flex-1 overflow-y-auto p-6 max-h-[75vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
