import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
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
      rootMargin: '-40% 0px -50% 0px',
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
    { name: 'Blog', path: 'blog', isRoute: true },
    { name: 'Contact', path: 'contact' },
  ];

  const handleLinkClick = (e, link) => {
    setIsOpen(false);
    if (link.isRoute) {
      e.preventDefault();
      navigate(`/${link.path}`);
      return;
    }

    const path = link.path;
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(path);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      e.preventDefault();
      navigate(`/#${path}`);
      setTimeout(() => {
        const el = document.getElementById(path);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const isLinkActive = (link) => {
    if (link.isRoute) {
      return location.pathname.startsWith(`/${link.path}`);
    }
    if (location.pathname === '/') {
      return activeSection === link.path;
    }
    return false;
  };

  const trackCTAClick = (label) => {
    if (window.gtag) {
      window.gtag('event', 'click_cta', {
        'event_category': 'Engagement',
        'event_label': label
      });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled 
          ? 'bg-dark/75 border-b border-white/5 py-4 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]' 
          : 'bg-transparent py-7'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={(e) => handleLinkClick(e, { name: 'Home', path: 'home' })}
          className="text-xl sm:text-2xl font-extrabold font-display text-white tracking-wider flex items-center gap-3 group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(124,111,255,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(0,229,255,0.6)] transition-all duration-300">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c6fff" />
                  <stop offset="100%" stopColor="#00e5ff" />
                </linearGradient>
              </defs>
              <polygon
                points="50,4 93,26 93,74 50,96 7,74 7,26"
                fill="none"
                stroke="url(#logo-grad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="relative font-display font-black text-xs tracking-tighter text-white select-none">
              PG
            </span>
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:text-primary transition-colors duration-300 font-black">
            Prince Gajera
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-[11px] font-bold font-mono tracking-widest select-none">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.isRoute ? `/${link.path}` : `#${link.path}`}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`relative py-2 uppercase transition-colors duration-300 hover:text-white ${
                    isLinkActive(link) ? 'text-secondary font-bold' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                  {isLinkActive(link) && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary rounded-full shadow-[0_0_8px_#00e5ff]" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Hiring CTA / Fast PDF Download */}
          <div className="flex items-center gap-3">
            <a 
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick('header_cv_download')}
              className="px-4 py-2 border border-[#7C6FFF]/35 hover:border-secondary text-gray-300 hover:text-white text-xs font-mono font-bold tracking-widest rounded-xl transition-all duration-300 bg-surface/40 backdrop-blur-sm shadow-[0_0_15px_rgba(124,111,255,0.05)] hover:shadow-[0_0_20px_rgba(0,229,255,0.12)] active:scale-95 flex items-center gap-2"
            >
              <span>RESUME</span>
              <svg className="w-3.5 h-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
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

      {/* Full-screen backdrop — fully opaque so no content bleeds through */}
      <div 
        className={`fixed inset-0 z-[98] md:hidden transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(4, 4, 12, 0.96)' }}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Drawer — slides in from right */}
      <div 
        className={`fixed inset-y-0 right-0 z-[99] bg-[#080818] border-l border-[#00e5ff]/10 flex flex-col transition-transform duration-200 ease-out md:hidden relative ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: 'min(280px, 85vw)' }}
      >
        {/* Top accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00e5ff]/40 to-transparent" />

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close menu"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="flex flex-col h-full justify-between px-8 pb-8 pt-20 font-mono select-none overflow-y-auto">
          {/* Nav links */}
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.isRoute ? `/${link.path}` : `#${link.path}`}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`flex items-center gap-3 py-3.5 px-3 rounded-xl text-[11px] uppercase tracking-[0.22em] font-bold transition-all duration-150 ${
                    isLinkActive(link) 
                      ? 'text-[#00e5ff] bg-[#00e5ff]/8 border border-[#00e5ff]/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isLinkActive(link) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff] shrink-0" />
                  )}
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Bottom section */}
          <div className="flex flex-col gap-4 border-t border-white/5 pt-6 mt-6">
            <a 
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setIsOpen(false);
                trackCTAClick('mobile_header_cv_download');
              }}
              className="py-3.5 bg-[#00e5ff]/8 border border-[#00e5ff]/25 hover:bg-[#00e5ff]/15 text-center text-[#00e5ff] text-[10px] font-bold tracking-[0.2em] rounded-xl transition-all duration-200 uppercase"
            >
              ⬇ Download CV
            </a>
            <p className="text-center text-[9px] text-gray-600">© 2026 PG — INDIA</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
