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
          <span 
            className="rounded-xl bg-[#0d0d1a]/60 border border-primary/45 flex items-center justify-center text-primary text-base sm:text-lg font-black font-display transition-all duration-300 group-hover:border-primary/90 group-hover:bg-primary/5 shadow-[0_0_15px_rgba(124,111,255,0.08)] group-hover:shadow-[0_0_20px_rgba(124,111,255,0.18)]"
            style={{ width: '42px', height: '42px', minWidth: '42px', minHeight: '42px', letterSpacing: 'normal', lineHeight: '1' }}
          >
            PG
          </span>
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

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-y-0 right-0 w-[260px] z-[99] bg-dark/95 border-l border-white/10 backdrop-blur-xl flex flex-col p-8 transition-transform duration-500 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between pt-16">
          <ul className="flex flex-col gap-6 text-xs font-mono">
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
