import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import Button from '../ui/Button';

export default function ConfirmDialog({
  isOpen,
  title = 'Delete Record',
  message = 'Are you sure you want to delete this record? This action cannot be undone and will permanently wipe it.',
  onConfirm,
  onCancel,
  confirmText = 'Delete Permanently',
  cancelText = 'Cancel',
  loading = false,
}) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative bg-[#1A1A24] border border-border-dark w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border-dark bg-[#14141E]">
              <div className="flex items-center gap-2.5 text-red-400">
                <FiAlertTriangle className="w-5 h-5 flex-shrink-0" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary-dark">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="text-text-secondary-dark hover:text-text-primary-dark p-1 hover:bg-white/5 rounded-lg transition-all"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              <p className="text-xs text-text-secondary-dark font-sans leading-relaxed">
                {message}
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 p-5 border-t border-border-dark bg-[#14141E]/40">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={loading}
                className="font-mono text-[10px] uppercase font-bold tracking-wider"
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                isLoading={loading}
                className="bg-red-500 hover:bg-red-600 text-white font-mono text-[10px] uppercase font-bold tracking-wider px-5 rounded-lg shadow-lg shadow-red-500/10"
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
