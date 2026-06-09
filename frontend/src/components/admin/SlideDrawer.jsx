import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export default function SlideDrawer({
  isOpen,
  title,
  onClose,
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
}) {
  // Disable body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            />

            {/* Slide drawer container */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex pl-10 max-w-full">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className={`pointer-events-auto w-screen ${sizes[size]}`}
              >
                <div className="flex h-full flex-col bg-[#1A1A24] border-l border-border-dark shadow-2xl overflow-hidden">
                  
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between p-6 border-b border-border-dark bg-[#14141E]">
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-text-primary-dark">
                      {title}
                    </h2>
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-text-secondary-dark hover:text-text-primary-dark p-1.5 hover:bg-white/5 rounded-lg transition-all"
                    >
                      <span className="sr-only">Close panel</span>
                      <FiX className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Drawer Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {children}
                  </div>

                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
