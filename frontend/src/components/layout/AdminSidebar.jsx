import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiGrid, FiFolder, FiEdit3, FiAward, 
  FiMessageSquare, FiSettings, FiLogOut, 
  FiChevronLeft, FiChevronRight, FiLink2, FiFileText, FiCalendar
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../firebase/auth';
import useSettings from '../../hooks/useSettings';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { subscribeToMessages } from '../../firebase/contact';

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('admin_sidebar_collapsed') === 'true';
  });
  const { user, logoutMock } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [hasUnsavedSettings, setHasUnsavedSettings] = useState(() => !!window.hasUnsavedSettings);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((msgs) => {
      const count = msgs?.filter(m => !m.read).length || 0;
      setUnreadCount(count);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleUnsavedChange = (e) => {
      setHasUnsavedSettings(!!e.detail);
    };
    window.addEventListener('unsavedSettingsChanged', handleUnsavedChange);
    return () => {
      window.removeEventListener('unsavedSettingsChanged', handleUnsavedChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('admin_sidebar_collapsed', String(collapsed));
  }, [collapsed]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      logoutMock();
      toast.success('Signed out successfully');
      navigate('/admin-login');
    } catch (err) {
      toast.error('Sign out failed. Please try again.');
    }
  };

  const navItems = [
    { name: 'Overview', path: '/admin/overview', icon: FiGrid },
    { name: 'Bookings', path: '/admin/bookings', icon: FiCalendar },
    { name: 'Projects', path: '/admin/projects', icon: FiFolder },
    { name: 'Messages', path: '/admin/messages', icon: FiMessageSquare, badge: unreadCount },
    { name: 'Social Links', path: '/admin/social-links', icon: FiLink2 },
    { name: 'Resume', path: '/admin/resume', icon: FiFileText },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings }
  ];

  return (
    <aside
      className={cn(
        'relative bg-[#0D0D14] border-r border-border-light dark:border-border-dark flex flex-col h-screen text-text-primary-dark transition-all duration-300 z-50 select-none',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Top Brand Info */}
      <div className="flex items-center justify-between h-16 border-b border-border-light dark:border-border-dark px-4">
        {!collapsed && (
          <span className="font-display font-extrabold text-base bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Prince.Admin
          </span>
        )}
        {collapsed && (
          <span className="font-display font-black text-sm text-primary mx-auto">
            P.
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 p-1 bg-[#1A1A24] border border-border-light dark:border-border-dark rounded-full text-text-secondary-dark hover:text-primary transition-colors hover:scale-110 shadow-lg"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <FiChevronRight className="w-3 h-3" /> : <FiChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-300',
                  isActive
                    ? 'bg-primary text-black shadow-lg shadow-primary/20'
                    : 'text-text-secondary-dark hover:text-text-primary-dark hover:bg-white/5'
                )
              }
              title={collapsed ? item.name : undefined}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
              {!collapsed && item.badge > 0 && (
                <span className="bg-red-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
              )}
              {item.name === 'Settings' && hasUnsavedSettings && (
                <span className={cn(
                  "w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308] animate-pulse",
                  collapsed ? "absolute top-2 right-2" : "ml-auto"
                )} />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile details & Sign Out */}
      <div className="border-t border-border-light dark:border-border-dark p-3 space-y-3">
        {!collapsed && (
          <div className="flex items-center gap-3 bg-[#1A1A24] p-3 rounded-lg border border-border-light dark:border-border-dark">
            <img
              src={settings?.avatarUrl || user?.photoURL || '/avatar.png'}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-primary/20 object-cover"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-[10px] font-bold font-mono truncate text-text-primary-dark uppercase">
                {settings?.name || 'Prince Gajera'}
              </h5>
              <span className="text-[8px] font-mono text-primary uppercase font-bold tracking-widest block mt-0.5">
                {settings?.title || 'Administrator'}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className={cn(
            'flex items-center gap-3 px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-xs font-mono font-bold uppercase w-full transition-all duration-300 active:scale-95',
            collapsed && 'justify-center'
          )}
          title="Sign Out"
        >
          <FiLogOut className="w-4.5 h-4.5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
