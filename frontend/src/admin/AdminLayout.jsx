import { useEffect, useState } from 'react';
import { Link, useNavigate, Outlet, useLocation, Navigate } from 'react-router-dom';
import { auth, isFirebaseConfigured, db } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { useConfirm } from '../context/ConfirmContext';
import { useToast } from '../context/ToastContext';

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const confirm = useConfirm();
  const toast = useToast();

  useEffect(() => {
    // Check for local password session bypass first
    const mockSession = localStorage.getItem("mock_admin_logged");
    if (mockSession === "true") {
      setUser({ email: "princegajera944@gmail.com", displayName: "Prince Gajera" });
      setLoading(false);
    } else {
      // If Firebase is not configured and no mock session, log out
      if (!isFirebaseConfigured || !auth) {
        setUser(null);
        setLoading(false);
      }
    }

    // Live Firebase Auth listener as fallback
    let unsubscribe = () => {};
    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
    }

    return () => unsubscribe();
  }, [location.pathname]);

  // Reactive unread count listener via Snapshot or Local Storage fallback
  useEffect(() => {
    let unsubSnapshot = () => {};

    if (isFirebaseConfigured && db) {
      unsubSnapshot = onSnapshot(collection(db, 'messages'), (snapshot) => {
        const msgs = snapshot.docs.map(doc => doc.data());
        const unread = msgs.filter(m => !m.read).length;
        setUnreadCount(unread);
        localStorage.setItem('prince_unread_count', unread);
      }, (err) => {
        console.error("Messages layout snapshot error:", err);
      });
    } else {
      const checkUnread = () => {
        const localMsgs = JSON.parse(localStorage.getItem('prince_messages') || '[]');
        const unread = localMsgs.filter(m => !m.read).length;
        setUnreadCount(unread);
        localStorage.setItem('prince_unread_count', unread);
      };
      
      checkUnread();
      const interval = setInterval(checkUnread, 1500);
      return () => clearInterval(interval);
    }

    return () => unsubSnapshot();
  }, [location.pathname]);

  const handleLogoutClick = async () => {
    const approved = await confirm({
      title: "Sign Out of Admin Panel?",
      subtitle: "You will need to re-enter your password to access these dashboards again.",
      confirmLabel: "Sign Out",
      confirmVariant: "danger"
    });

    if (!approved) return;

    if (!isFirebaseConfigured || !auth) {
      localStorage.removeItem("mock_admin_logged");
      setUser(null);
      toast.success("Successfully logged out (sandbox session)");
      navigate("/");
      return;
    }

    try {
      await signOut(auth);
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
        Verifying credentials...
      </div>
    );
  }

  // Redirect directly to login if user session is absent
  if (!user && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }

  // If we are logged in, render the dashboard shell
  return (
    <div className="min-h-screen bg-dark text-text flex flex-col font-sans">
      {/* Premium Sticky Admin Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-dark/80 backdrop-blur-xl border-b border-white/5 select-none">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-xl font-bold font-display text-white tracking-widest flex items-center gap-2 group">
              <span className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-black shadow-[0_0_15px_rgba(124,111,255,0.3)] transition-transform group-hover:rotate-12">
                AD
              </span>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-extrabold">Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono">
            <span className="text-muted flex items-center gap-1.5">
              <span>Signed in as:</span>
              <a 
                href={`mailto:${user?.email || "princegajera944@gmail.com"}`} 
                className="text-secondary hover:text-white transition-colors hover:underline font-bold"
              >
                {user?.email || "princegajera944@gmail.com"}
              </a>
            </span>
            <button 
              onClick={handleLogoutClick}
              className="px-4 py-2 border border-danger/40 hover:bg-danger text-danger hover:text-white rounded-xl transition-all duration-300 font-bold uppercase tracking-wider text-[10px] active:scale-95 hover:shadow-[0_0_15px_rgba(255,68,68,0.2)]"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab links inside the same sticky container (never overlaps or gets cut off!) */}
        <div className="max-w-7xl mx-auto px-6 pb-3 flex flex-wrap gap-2 font-mono text-xs uppercase tracking-wider justify-center sm:justify-start">
          <Link 
            to="/admin/dashboard" 
            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
              location.pathname === '/admin/dashboard' 
                ? 'bg-primary text-white font-bold shadow-[0_0_15px_rgba(124,111,255,0.25)]' 
                : 'bg-transparent text-muted hover:text-white hover:bg-primary/5'
            }`}
          >
            Stats
          </Link>
          <Link 
            to="/admin/projects" 
            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
              location.pathname === '/admin/projects' 
                ? 'bg-primary text-white font-bold shadow-[0_0_15px_rgba(124,111,255,0.25)]' 
                : 'bg-transparent text-muted hover:text-white hover:bg-primary/5'
            }`}
          >
            Projects CRUD
          </Link>
          <Link 
            to="/admin/skills" 
            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
              location.pathname === '/admin/skills' 
                ? 'bg-primary text-white font-bold shadow-[0_0_15px_rgba(124,111,255,0.25)]' 
                : 'bg-transparent text-muted hover:text-white hover:bg-primary/5'
            }`}
          >
            Skills
          </Link>
          <Link 
            to="/admin/messages" 
            className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
              location.pathname === '/admin/messages' 
                ? 'bg-primary text-white font-bold shadow-[0_0_15px_rgba(124,111,255,0.25)]' 
                : 'bg-transparent text-muted hover:text-white hover:bg-primary/5'
            }`}
          >
            Client Messages
            {unreadCount > 0 && (
              <span className="bg-secondary text-dark text-[9px] font-mono font-black h-4 px-1.5 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_8px_#00e5ff]">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Primary Subpage viewport - using pt-10 instead of pt-48 since sticky navigation is very compact */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-10 pb-20">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}
