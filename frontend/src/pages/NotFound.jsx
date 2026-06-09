import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg-dark overflow-hidden px-6 py-24 select-none font-sans">
      
      {/* Background Grids */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(#6C63FF 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center relative z-10 space-y-8"
      >
        
        {/* Animated Error Code */}
        <div className="relative inline-block">
          <h1 className="text-8xl sm:text-9xl font-black font-display tracking-widest text-primary drop-shadow-[0_0_30px_rgba(108,99,255,0.2)]">
            404
          </h1>
          <span className="absolute -bottom-2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-primary">
            <FiAlertTriangle className="w-5 h-5 animate-bounce" />
            <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary-light dark:text-text-primary-dark">
              Lost in Code Sandbox
            </h2>
          </div>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-mono">
            This route does not map to any active endpoint in Prince's portfolio. You have exited the application sandbox.
          </p>
        </div>

        {/* Link Button */}
        <div className="pt-4 flex justify-center">
          <Link to="/">
            <Button variant="primary" className="gap-2">
              <FiHome className="w-4 h-4" />
              <span>Return to Portfolio</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
