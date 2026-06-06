import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e, path) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(path);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative z-10 bg-dark border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-gray-500">
        
        {/* Left Side: Copyright & Signature */}
        <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
          <span>© {currentYear} Prince Gajera.</span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="text-gray-400">Designed &amp; Developed by Prince Gajera</span>
        </div>

        {/* Center: Quirky Line */}
        <div className="text-center italic text-[11px] text-gray-600 font-sans">
          Made with frustration, coffee, and Stack Overflow
        </div>

        {/* Right Side: Social & Navigation Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a 
            href="https://github.com/princegajera1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-200"
          >
            [github]
          </a>
          <a 
            href="https://www.linkedin.com/in/gajera-prince/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-200"
          >
            [linkedin]
          </a>
        </div>

      </div>
    </footer>
  );
}
