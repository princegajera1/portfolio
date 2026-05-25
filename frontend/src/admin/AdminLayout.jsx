import { useEffect, useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { auth, isFirebaseConfigured, db } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { useConfirm } from '../context/ConfirmContext';
import { useToast } from '../context/ToastContext';

const ADMIN_EMAIL = 'princegajera944@gmail.com';

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    return saved ? saved === 'true' : false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const confirm = useConfirm();
  const toast = useToast();

  // Sidebar toggle handler
  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      localStorage.setItem('admin_sidebar_collapsed', !prev);
      return !prev;
    });
  };

  useEffect(() => {
    if (localStorage.getItem("mock_admin_logged") === "true") {
      setUser({ email: ADMIN_EMAIL });
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 30-minute inactivity auto-logout listener
  useEffect(() => {
    if (!user) return;

    let timeoutId;
    const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutes

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (localStorage.getItem("mock_admin_logged") === "true") {
          localStorage.removeItem("mock_admin_logged");
          toast.warning("Session expired due to 30 minutes of inactivity.");
          navigate("/admin/login");
        } else if (auth) {
          signOut(auth)
            .then(() => {
              toast.warning("Session expired due to 30 minutes of inactivity.");
              navigate("/admin/login");
            })
            .catch((err) => console.error("Inactivity logout failed:", err));
        }
      }, INACTIVITY_TIME);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user, navigate, toast]);

  // Live messages unread count snapshot listener
  useEffect(() => {
    if (localStorage.getItem("mock_admin_logged") === "true") {
      const checkLocalUnread = () => {
        const localMsgs = JSON.parse(localStorage.getItem('prince_messages') || '[]');
        const unread = localMsgs.filter(m => !m.read).length;
        setUnreadCount(unread);
      };
      
      checkLocalUnread();
      const interval = setInterval(checkLocalUnread, 1500);
      return () => clearInterval(interval);
    }

    if (!isFirebaseConfigured || !db || !user) return;

    const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      const unread = msgs.filter(m => !m.read).length;
      setUnreadCount(unread);
    }, (err) => {
      console.error("Unread count listener error:", err);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogoutClick = async () => {
    const approved = await confirm({
      title: "Sign Out of Admin Panel?",
      subtitle: "You will need to re-authenticate to access the admin dashboards again.",
      confirmLabel: "Sign Out",
      confirmVariant: "danger"
    });

    if (!approved) return;

    try {
      if (localStorage.getItem("mock_admin_logged") === "true") {
        localStorage.removeItem("mock_admin_logged");
      } else if (auth) {
        await signOut(auth);
      }
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      console.error("Signout error:", error);
      toast.error(`Signout failed: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-gray-500 font-mono text-xs uppercase tracking-widest gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        Verifying secure credentials...
      </div>
    );
  }

  // Sidebar link items
  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Stats',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      )
    },
    {
      path: '/admin/projects',
      label: 'Projects CRUD',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      path: '/admin/skills',
      label: 'Skills',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      path: '/admin/messages',
      label: 'Messages',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      badge: unreadCount > 0 ? unreadCount : null
    }
  ];

  return (
    <div className="min-h-screen bg-dark text-text flex font-sans overflow-hidden">
      
      {/* MOBILE HEADER BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-2/80 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-6 select-none">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-black shadow-[0_0_15px_rgba(124,111,255,0.3)]">
            AD
          </span>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold font-display">Dashboard</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-muted hover:text-white active:scale-95 transition-all focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMobileOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-dark/60 backdrop-blur-sm z-40 transition-all duration-300"
        />
      )}

      {/* SIDEBAR NAVIGATION (SHARED MOBILE/DESKTOP) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 lg:sticky lg:top-0 z-50 bg-[#0d0d1a] border-r border-white/5 flex flex-col justify-between transition-all duration-300 ease-in-out select-none ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          isMobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo & Expand / Collapse Trigger */}
          <div className="h-20 border-b border-white/5 flex items-center justify-between px-6">
            <Link to="/admin/dashboard" className="flex items-center gap-3 font-display">
              <span className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-black shadow-[0_0_15px_rgba(124,111,255,0.3)] shrink-0">
                AD
              </span>
              <span className={`bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-black tracking-wider text-base transition-opacity duration-200 ${
                isCollapsed ? 'lg:opacity-0 lg:w-0 overflow-hidden' : 'opacity-100'
              }`}>
                DASHBOARD
              </span>
            </Link>

            {/* Desktop Collapse Trigger */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex w-6 h-6 rounded-md bg-white/5 border border-white/5 items-center justify-center text-muted hover:text-white active:scale-95 transition-all"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 font-mono text-xs uppercase tracking-wider">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
                    isActive
                      ? 'bg-primary text-white font-bold shadow-[0_0_15px_rgba(124,111,255,0.25)]'
                      : 'text-muted hover:text-white hover:bg-primary/5'
                  }`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  <span className={`transition-opacity duration-200 ${
                    isCollapsed ? 'lg:opacity-0 lg:w-0 overflow-hidden' : 'opacity-100'
                  }`}>
                    {item.label}
                  </span>

                  {/* Badge */}
                  {item.badge && (
                    <span className={`absolute shrink-0 text-dark text-[9px] font-mono font-black h-4 px-1.5 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_8px_#00e5ff] ${
                      isCollapsed ? 'right-2.5 top-2.5 bg-secondary' : 'right-4 bg-secondary'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Collapsed Tooltip */}
                  {isCollapsed && (
                    <div className="hidden lg:block absolute left-24 bg-surface border border-white/10 px-3 py-1.5 rounded-lg text-white font-mono text-[10px] uppercase font-bold tracking-widest opacity-0 scale-90 translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-xl z-[9999]">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer & User Stats */}
        <div className="p-4 border-t border-white/5 space-y-4">
          <div className={`flex items-center gap-3 transition-all duration-300 ${
            isCollapsed ? 'lg:justify-center' : ''
          }`}>
            {/* Avatar / Profile dot */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-black text-white text-xs shrink-0 select-none">
              PG
            </div>
            
            <div className={`flex flex-col min-w-0 transition-opacity duration-200 ${
              isCollapsed ? 'lg:opacity-0 lg:w-0 overflow-hidden' : 'opacity-100'
            }`}>
              <span className="text-[10px] font-mono text-muted uppercase tracking-widest leading-none mb-1">Administrator</span>
              <span className="text-white text-xs font-bold font-sans truncate" title={user?.email || ADMIN_EMAIL}>
                {user?.email || ADMIN_EMAIL}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border border-danger/20 hover:bg-danger text-danger hover:text-white transition-all duration-300 font-mono text-[10px] font-bold uppercase tracking-wider active:scale-95 hover:shadow-[0_0_15px_rgba(255,68,68,0.2)] ${
              isCollapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
            title="Sign Out"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className={`${
              isCollapsed ? 'lg:hidden' : 'block'
            }`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* PRIMARY MAIN PANEL VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Spacer for desktop main or top spacing for mobile header bar */}
        <div className="h-16 lg:hidden" />
        
        <main className="flex-1 w-full mx-auto px-6 py-10 overflow-y-auto">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
