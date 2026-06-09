import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiTerminal, FiSearch } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      // Scrolled state for background blur
      setScrolled(window.scrollY > 20);

      // Scroll progress percentage calculation
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Closes mobile menu on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleCommandPaletteClick = () => {
    // Dispatch event to toggle command palette
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  const isLinkActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }} />

      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled
            ? 'bg-bg-dark/80 border-b border-[#E8FF00]/10 py-4 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-xl font-extrabold font-display tracking-tight flex items-center gap-2 group select-none">
            <div className="w-8 h-8 rounded-lg bg-[#111118]/80 border border-primary/20 flex items-center justify-center shadow-lg group-hover:border-primary/50 transition-colors">
              <img src="/pg_logo.png" alt="PG Logo" className="w-5.5 h-5.5 object-contain" />
            </div>
            <span className="bg-gradient-to-r from-primary to-[#E8FF00] bg-clip-text text-transparent font-black text-xl">
              Prince
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8 text-xs font-mono font-bold tracking-wider select-none">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`relative py-1 uppercase transition-colors duration-200 hover:text-[#E8FF00] ${
                    isLinkActive(link.path)
                      ? 'text-[#E8FF00] font-bold'
                      : 'text-gray-400'
                  }`}
                >
                  {link.name}
                  {isLinkActive(link.path) && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-[#E8FF00] rounded-full shadow-[0_0_12px_rgba(232,255,0,0.6)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Command Palette Trigger */}
            <button
              onClick={handleCommandPaletteClick}
              className="flex items-center gap-2 px-3 py-1.5 border border-border-dark hover:border-[#E8FF00]/50 rounded-lg text-[10px] font-mono font-bold text-text-secondary-dark hover:text-white transition-all duration-200 bg-white/5 backdrop-blur-md hover:bg-white/10 active:scale-95"
              title="Search and Commands (Ctrl+K)"
            >
              <FiSearch className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-400 font-sans tracking-wide">Search...</span>
            </button>

            {/* Admin Quick Link */}
            {user && (
              <Link
                to="/admin/overview"
                className="px-3 py-1.5 border border-primary/20 hover:border-primary/40 rounded-lg text-[10px] font-mono font-bold text-primary transition-all duration-200 bg-primary/5 active:scale-95"
              >
                ADMIN
              </Link>
            )}

            {/* Book a Call Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/booking')}
              className="hidden lg:flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Book a Call
            </Button>

            {/* Hire Me Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/contact')}
            >
              Hire Me
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Command trigger */}
            <button
              onClick={handleCommandPaletteClick}
              className="p-2 border border-border-dark text-text-secondary-dark rounded-lg bg-white/5 active:scale-95 hover:border-[#E8FF00]/40 transition-colors"
              aria-label="Command Palette"
            >
              <FiSearch className="w-4.5 h-4.5 text-gray-400" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border border-border-dark text-text-secondary-dark rounded-lg bg-white/5 active:scale-95"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FiX className="w-4.5 h-4.5 text-gray-400" /> : <FiMenu className="w-4.5 h-4.5 text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Navigation Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-0 top-[60px] h-[calc(100vh-60px)] z-50 bg-bg-dark/95 backdrop-blur-2xl border-t border-border-dark flex flex-col justify-between p-8 font-sans md:hidden"
            >
              <ul className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-2xl font-black uppercase tracking-tight block transition-colors ${
                        isLinkActive(link.path)
                          ? 'text-[#E8FF00]'
                          : 'text-gray-400 hover:text-[#E8FF00]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-4 border-t border-border-dark pt-8 mb-12">
                <Button
                  variant="primary"
                  className="w-full py-4 text-center"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/contact');
                  }}
                >
                  Hire Me
                </Button>
                <div className="text-center text-[10px] font-mono text-text-secondary-dark mt-4">
                  © 2026 PG — REMOTE FRIENDLY
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
