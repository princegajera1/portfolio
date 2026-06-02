import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e, path) => {
    // If on homepage, scroll smoothly. Otherwise, route.
    if (window.location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(path);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative z-10 bg-dark border-t border-white/5 py-16">
      {/* Subtle purple background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-36 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
        {/* Brand Details */}
        <div className="md:col-span-2 flex flex-col gap-4 select-none">
          <Link to="/" className="text-xl font-bold font-display text-white tracking-wider flex items-center gap-3 group">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold shadow-[0_0_15px_rgba(124,111,255,0.4)] transition-transform duration-300 group-hover:rotate-12 select-none">
              PG
            </span>
            <span className="font-extrabold text-white">Prince Gajera</span>
          </Link>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm leading-relaxed font-sans">
            Senior Full Stack Engineer & React Specialist based in Ahmedabad. Designing high-performance serverless cloud databases and visually stunning web interfaces.
          </p>
        </div>

        {/* Sitemap Coordinates */}
        <div className="flex flex-col gap-3 font-sans">
          <h4 className="text-white font-mono text-[10px] uppercase font-bold tracking-widest text-secondary select-none">Sitemap</h4>
          <div className="flex flex-col gap-2 text-xs text-gray-500 font-mono">
            <a href="#home" onClick={(e) => handleLinkClick(e, 'home')} className="hover:text-white transition-colors">&lt; Home /&gt;</a>
            <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-white transition-colors">&lt; About /&gt;</a>
            <a href="#skills" onClick={(e) => handleLinkClick(e, 'skills')} className="hover:text-white transition-colors">&lt; Skills /&gt;</a>
            <a href="#projects" onClick={(e) => handleLinkClick(e, 'projects')} className="hover:text-white transition-colors">&lt; Projects /&gt;</a>
            <a href="#experience" onClick={(e) => handleLinkClick(e, 'experience')} className="hover:text-white transition-colors">&lt; Experience /&gt;</a>
            <a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')} className="hover:text-white transition-colors">&lt; Contact /&gt;</a>
          </div>
        </div>

        {/* Social Indices */}
        <div className="flex flex-col gap-3 font-sans">
          <h4 className="text-white font-mono text-[10px] uppercase font-bold tracking-widest text-secondary select-none">Connect</h4>
          <div className="flex items-center gap-3 pt-1 select-none">
            <a 
              href="https://github.com/princegajera1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:border-primary hover:text-white transition-all duration-300"
              aria-label="GitHub Release Profiles"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <a 
              href="https://linkedin.com/in/prince-gajera-95bb38289" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:border-secondary hover:text-white transition-all duration-300"
              aria-label="LinkedIn Recruiters Page"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
          <p className="text-[10px] text-gray-600 font-mono mt-4 select-text">
            © {currentYear} Prince Gajera.
            <br />
            Ahmedabad, Gujarat, India.
          </p>
        </div>
      </div>
    </footer>
  );
}
