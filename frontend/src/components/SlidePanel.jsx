import { useEffect } from 'react';

export default function SlidePanel({ isOpen, onClose, title, children }) {
  // Prevent body scroll when panel is open
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

  if (!isOpen) return null;

  return (
    <>
      {/* Dark Overlay Background */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />
      
      {/* Right Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-[101] w-full max-w-lg bg-[#0d0d1a] border-l border-[#7C6FFF]/12 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 animate-slide-in font-sans">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-6 border-b border-white/5 mb-6 select-none">
            <h2 className="text-white font-display text-lg font-bold tracking-wide">
              {title}
            </h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-xl border border-white/10 hover:border-white/20 text-muted hover:text-white flex items-center justify-center font-bold text-sm transition-colors active:scale-95"
            >
              ✕
            </button>
          </div>

          {/* Panel Content */}
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
