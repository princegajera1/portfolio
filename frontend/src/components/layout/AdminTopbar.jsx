import { Link, useLocation } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import useSettings from '../../hooks/useSettings';
import { useAuth } from '../../context/AuthContext';

export default function AdminTopbar() {
  const location = useLocation();
  const { settings } = useSettings();
  const { user } = useAuth();

  // Generate breadcrumbs based on route path
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return (
      <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-secondary-dark uppercase tracking-widest">
        <span className="hover:text-primary transition-colors">Admin</span>
        {paths.map((p, index) => {
          if (p === 'admin') return null;
          return (
            <div key={p} className="flex items-center gap-1.5">
              <span>&gt;</span>
              <span className={index === paths.length - 1 ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}>
                {p.replace('-', ' ')}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <header className="h-16 bg-[#111118] border-b border-border-light dark:border-border-dark flex items-center justify-between px-6 z-40 select-none">
      
      {/* Left side Breadcrumbs */}
      <div>{getBreadcrumbs()}</div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        {/* View Public Portfolio Link */}
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-1 px-3 py-1.5 border border-border-light dark:border-border-dark hover:border-primary/40 rounded-lg text-[10px] font-mono font-bold text-text-secondary-dark hover:text-primary transition-all bg-[#1A1A24] active:scale-95"
          title="Open Public Site"
        >
          <span>Live Site</span>
          <FiExternalLink className="w-3 h-3" />
        </Link>

        {/* Admin profile detail mini-badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-border-light dark:border-border-dark">
          <img
            src={settings?.avatarUrl || user?.photoURL || '/avatar.png'}
            alt="Admin Avatar"
            className="w-7 h-7 rounded-full border border-primary/20 object-cover"
          />
        </div>

      </div>
    </header>
  );
}
