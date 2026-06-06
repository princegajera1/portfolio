import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
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

  // Update sliding underline position whenever active section or route changes
  useEffect(() => {
    const getActivePath = () => {
      if (location.pathname.startsWith('/blog')) return 'blog';
      if (location.pathname === '/') return activeSection;
      return '';
    };
    
    const activePath = getActivePath();
    const activeEl = document.querySelector(`.nav-desktop-list a[data-path="${activePath}"]`);
    
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1
      });
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [activeSection, location.pathname]);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled 
          ? 'bg-[#0A0A0A]/80 border-b border-white/5 py-4 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
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
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(232,255,0,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(232,255,0,0.7)] transition-all duration-300">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8FF00" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>
              <polygon
                points="50,5 92,27 92,73 50,95 8,73 8,27"
                fill="none"
                stroke="url(#logo-grad)"
                strokeWidth="6"
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
          <ul className="nav-desktop-list relative flex items-center gap-6 text-[11px] font-bold font-mono tracking-widest select-none py-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.isRoute ? `/${link.path}` : `#${link.path}`}
                  data-path={link.path}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`relative py-1 uppercase transition-colors duration-300 hover:text-white ${
                    isLinkActive(link) ? 'text-primary' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
            
            {/* Sliding Underline Dot/Line */}
            <div 
              className="absolute bottom-0 h-[2px] bg-primary rounded-full transition-all duration-300 pointer-events-none shadow-[0_0_8px_#E8FF00]"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
                transitionTimingFunction: 'var(--ease-expo)'
              }}
            />
          </ul>

          {/* Hiring CTA / Fast PDF Download */}
          <div className="flex items-center gap-3">
            <a 
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick('header_cv_download')}
              className="px-4 py-2 border border-primary/20 hover:border-primary text-gray-300 hover:text-black text-xs font-mono font-bold tracking-widest rounded-xl transition-all duration-300 bg-surface/40 backdrop-blur-sm shadow-[0_0_15px_rgba(232,255,0,0.05)] hover:bg-primary active:scale-95 flex items-center gap-2"
            >
              <span>RESUME</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-4 md:hidden z-[101]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 text-white flex flex-col justify-center items-center gap-1.5 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <span className={`w-6 h-[2px] bg-white rounded-full transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[8px] !bg-primary' : ''}`} />
            <span className={`w-6 h-[2px] bg-white rounded-full transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-[2px] bg-white rounded-full transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[8px] !bg-primary' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay — Full Screen */}
      <div 
        className={`fixed inset-0 z-[100] bg-[#0A0A0A]/98 backdrop-blur-2xl flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-8 font-display select-none">
          <ul className="flex flex-col items-center gap-6">
            {navLinks.map((link, idx) => (
              <li 
                key={link.name}
                style={{
                  transitionDelay: isOpen ? `${idx * 50}ms` : '0ms',
                  transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isOpen ? 1 : 0
                }}
                className="transition-all duration-500"
              >
                <a
                  href={link.isRoute ? `/${link.path}` : `#${link.path}`}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`text-3xl font-black uppercase tracking-tight ${
                    isLinkActive(link) 
                      ? 'text-primary' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={{ minHeight: '44px', display: 'block', padding: '10px' }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div 
            className="flex flex-col gap-4 items-center mt-12 w-64 transition-opacity duration-500"
            style={{
              transitionDelay: isOpen ? '400ms' : '0ms',
              opacity: isOpen ? 1 : 0
            }}
          >
            <a 
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setIsOpen(false);
                trackCTAClick('mobile_header_cv_download');
              }}
              className="py-4 bg-primary text-black font-mono font-bold tracking-widest rounded-xl transition-all duration-200 uppercase w-full text-center text-xs shadow-md shadow-primary/20"
              style={{ minHeight: '48px' }}
            >
              Download CV
            </a>
            <p className="text-[10px] text-gray-500 font-mono mt-2">© 2026 PG — INDIA</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
