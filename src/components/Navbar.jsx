import { useState, useEffect } from 'react';
import { Menu, X, User, Zap, Code, Briefcase, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScrollSpy } from '../hooks/useScrollSpy';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];

  const activeId = useScrollSpy(navItems.map(item => item.id), 100);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    setIsOpen(false);
    
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle hash navigation after page load
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          window.scrollTo({
            top: (elementRect - bodyRect) - offset,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location]);

  const getIcon = (id) => {
    switch (id) {
      case 'about': return <User size={18} className="mr-3 text-custom-gargoyleGas" />;
      case 'skills': return <Zap size={18} className="mr-3 text-custom-carrotOrange" />;
      case 'projects': return <Code size={18} className="mr-3 text-custom-midnightGreen" />;
      case 'experience': return <Briefcase size={18} className="mr-3 text-custom-gargoyleGas" />;
      case 'contact': return <Mail size={18} className="mr-3 text-custom-carrotOrange" />;
      default: return null;
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-custom-richBlack/80 backdrop-blur-lg py-3 border-b border-white/[0.06] shadow-2xl' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="font-heading text-2xl md:text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-custom-midnightGreen via-custom-carrotOrange to-custom-gargoyleGas hover:scale-105 transition-transform duration-300">
              PRINCE
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-base md:text-[15px] font-semibold tracking-wider transition-all duration-300 hover:text-custom-carrotOrange ${
                  activeId === item.id ? 'text-custom-carrotOrange drop-shadow-[0_0_8px_rgba(240,128,60,0.5)]' : 'text-gray-300 font-medium'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-lg bg-white/5 border border-white/10"
              aria-label="Toggle Mobile Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Modern Slide-down Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full border-t border-white/10 shadow-2xl overflow-hidden bg-custom-richBlack/95 backdrop-blur-xl">
          <div className="px-4 pt-3 pb-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center w-full text-left px-4 py-3 rounded-xl text-[15px] font-semibold tracking-wide transition-all duration-300 ${
                  activeId === item.id 
                    ? 'bg-gradient-to-r from-custom-carrotOrange/15 to-transparent text-custom-carrotOrange border-l-4 border-l-custom-carrotOrange' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-4 border-l-transparent'
                }`}
              >
                {getIcon(item.id)}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
