import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUp, FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';
import { db, isFirebaseConfigured } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import useSettings from '../../hooks/useSettings';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setSubmitting(true);
      const subData = {
        email: email.trim(),
        subscribedAt: new Date().toISOString()
      };

      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, 'newsletter'), subData);
      } else {
        // Fallback: local storage
        const saved = JSON.parse(localStorage.getItem('prince_newsletter') || '[]');
        saved.push(subData);
        localStorage.setItem('prince_newsletter', JSON.stringify(saved));
      }

      toast.success('Successfully subscribed to my newsletter! ✨');
      setEmail('');
    } catch (err) {
      console.error('Newsletter error:', err);
      toast.error('Could not subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative z-10 bg-[#07070B] border-t border-border-light dark:border-border-dark/80 pt-16 pb-8 px-6 sm:px-12">
      {/* Sleek top glowing line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E8FF00]/15 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-border-light dark:border-border-dark">
        
        {/* Column 1: Brand & Tagline */}
        <div className="md:col-span-5 space-y-5">
          <Link to="/" className="text-xl font-extrabold font-display tracking-tight flex items-center gap-2 group select-none">
            <div className="w-8 h-8 rounded-lg bg-[#111118]/80 border border-primary/20 flex items-center justify-center shadow-lg group-hover:border-[#E8FF00]/40 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5.5 h-5.5">
                <defs>
                  <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6C63FF" />
                    <stop offset="100%" stopColor="#E8FF00" />
                  </linearGradient>
                </defs>
                <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="52" fill="url(#footerGrad)" letterSpacing="-3">PG</text>
              </svg>
            </div>
            <span className="bg-gradient-to-r from-primary to-[#E8FF00] bg-clip-text text-transparent font-black text-xl">
              Prince
            </span>
          </Link>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm max-w-sm leading-relaxed">
            Frontend developer focused on building modern, high-speed interfaces, interactive animations, and serverless product frameworks that convert technical recruiters.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a 
              href={settings?.socialLinks?.github || "https://github.com/princegajera1"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 border border-border-light dark:border-border-dark hover:border-[#E8FF00] text-text-secondary-light dark:text-text-secondary-dark hover:text-black hover:bg-[#E8FF00] rounded-xl transition-all duration-300 bg-white/5 hover:-translate-y-1 hover:shadow-glow-secondary" 
              aria-label="GitHub"
            >
              <FiGithub className="w-4 h-4" />
            </a>
            <a 
              href={settings?.socialLinks?.linkedin || "https://www.linkedin.com/in/gajera-prince/"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 border border-border-light dark:border-border-dark hover:border-[#E8FF00] text-text-secondary-light dark:text-text-secondary-dark hover:text-black hover:bg-[#E8FF00] rounded-xl transition-all duration-300 bg-white/5 hover:-translate-y-1 hover:shadow-glow-secondary" 
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-4 h-4" />
            </a>
            <a 
              href={settings?.socialLinks?.twitter || "https://x.com/GajeraPrin20670"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 border border-border-light dark:border-border-dark hover:border-[#E8FF00] text-text-secondary-light dark:text-text-secondary-dark hover:text-black hover:bg-[#E8FF00] rounded-xl transition-all duration-300 bg-white/5 hover:-translate-y-1 hover:shadow-glow-secondary" 
              aria-label="Twitter/X"
            >
              <FiTwitter className="w-4 h-4" />
            </a>
            <a 
              href={settings?.socialLinks?.instagram || "https://www.instagram.com/gajera6902/"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 border border-border-light dark:border-border-dark hover:border-[#E8FF00] text-text-secondary-light dark:text-text-secondary-dark hover:text-black hover:bg-[#E8FF00] rounded-xl transition-all duration-300 bg-white/5 hover:-translate-y-1 hover:shadow-glow-secondary" 
              aria-label="Instagram"
            >
              <FiInstagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="md:col-span-3 space-y-4 md:pl-8">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark">
            Quick Nav
          </h4>
          <ul className="space-y-2 text-xs font-mono">
            {[
              { path: "/about", label: "About Profile" },
              { path: "/projects", label: "Projects Index" },
              { path: "/resume", label: "Download CV" }
            ].map((link, idx) => (
              <li key={idx}>
                <Link 
                  to={link.path} 
                  className="text-text-secondary-light dark:text-text-secondary-dark hover:text-[#E8FF00] transition-all duration-300 hover:pl-1.5 flex items-center gap-1 w-fit"
                >
                  // {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Newsletter Form */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark">
            Join Newsletter
          </h4>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs leading-relaxed">
            Receive modular code snippets, performance optimizations, and backend architecture walkthroughs directly in your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                required
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-4 bg-white/5 border border-border-light dark:border-border-dark focus:border-[#E8FF00]/50 focus:ring-1 focus:ring-[#E8FF00] focus:shadow-glow-secondary rounded-lg text-xs outline-none text-text-primary-dark transition-all duration-300 font-sans"
              />
            </div>
            <Button
              variant="secondary"
              type="submit"
              size="sm"
              isLoading={submitting}
              className="h-10 border-border-light dark:border-border-dark hover:border-[#E8FF00]/50 hover:shadow-glow-secondary active:scale-95 transition-all"
            >
              <FiMail className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>

      </div>

      {/* Bottom Copyright & Back-to-Top padding */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-text-secondary-light dark:text-text-secondary-dark pb-16 sm:pb-0">
        <div>
          © {new Date().getFullYear()} Prince Gajera. All rights reserved.
        </div>
        <div className="flex items-center gap-1.5 sm:pr-32 select-text">
          <span>Built with React 18, Tailwind v3 &amp; ❤️ in India</span>
        </div>
      </div>

      {/* Back to top float - Shifted right to avoid copyright text overlap */}
      {showScrollTop && (
        <button
          onClick={handleScrollTop}
          className="fixed bottom-6 right-24 z-50 p-3 bg-gradient-to-tr from-primary to-secondary text-black rounded-full shadow-2xl cursor-pointer hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center"
          title="Back to Top"
        >
          <FiArrowUp className="w-4 h-4 stroke-[3px]" />
        </button>
      )}
    </footer>
  );
}
