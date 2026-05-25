import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer to track active section under scroll
  useEffect(() => {
    if (location.pathname !== '/') return;

    const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
    const observers = [];

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px', // Triggers when section occupies central viewport
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        observers.push(el);
      }
    });

    return () => {
      observers.forEach(el => observer.unobserve(el));
    };
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: 'home' },
    { name: 'About', path: 'about' },
    { name: 'Skills', path: 'skills' },
    { name: 'Projects', path: 'projects' },
    { name: 'Experience', path: 'experience' },
    { name: 'Contact', path: 'contact' },
  ];

  const handleLinkClick = (e, path) => {
    setIsOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(path);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on subpage, navigate back to home with anchor
      e.preventDefault();
      navigate(`/#${path}`);
      // Scroll after navigation
      setTimeout(() => {
        const el = document.getElementById(path);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const isLinkActive = (path) => {
    if (location.pathname === '/') {
      return activeSection === path;
    }
    return false;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        scrolled ? 'glass-nav py-6 shadow-lg' : 'bg-transparent py-9'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={(e) => handleLinkClick(e, 'home')}
          className="text-2xl sm:text-[27px] font-extrabold font-display text-white tracking-widest flex items-center gap-3 group select-none"
        >
          <div className="relative flex items-center justify-center w-11 h-11 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(0,245,255,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(124,58,237,0.6)] transition-all duration-300">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f5ff" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <polygon
                points="50,4 93,26 93,74 50,96 7,74 7,26"
                fill="none"
                stroke="url(#logo-grad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="relative font-display font-black text-sm tracking-tighter text-white group-hover:text-primary transition-colors duration-300 select-none">
              PG
            </span>
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:text-primary transition-colors duration-300 font-bold">
            Prince Gajera
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-7 text-[12px] font-bold font-mono select-none">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={`#${link.path}`}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className={`relative py-2 uppercase tracking-[0.2em] transition-colors duration-300 hover:text-white ${
                    isLinkActive(link.path) ? 'text-primary font-bold neon-text-primary' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                  {isLinkActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#00e5ff] rounded-full shadow-[0_0_10px_#00e5ff]" />
                  )}
                </a>
              </li>
            ))}
          </ul>


        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 text-white flex flex-col justify-center items-center gap-1.5 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <span className={`w-6 h-[2px] bg-white rounded-full transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`w-6 h-[2px] bg-white rounded-full transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-[2px] bg-white rounded-full transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Backdrop blur blue tint overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#03001e]/70 backdrop-blur-md z-[98] transition-opacity duration-300 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Overlay Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-[260px] z-[99] bg-[#0a0a1a] border-l border-[#00f5ff]/20 shadow-[-10px_0_30px_rgba(0,229,255,0.12)] flex flex-col p-8 transition-transform duration-500 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between pt-16">
          <ul className="flex flex-col gap-6 text-sm font-mono">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={`#${link.path}`}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className={`block py-2 uppercase tracking-[0.2em] transition-colors duration-300 hover:text-white ${
                    isLinkActive(link.path) ? 'text-primary font-bold neon-text-primary' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="border-t border-white/10 pt-8 select-none">
            <p className="text-center text-[10px] text-gray-600 font-mono">© 2026 PG</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
