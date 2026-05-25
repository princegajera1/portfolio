import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export default function PrivateRoute() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("mock_admin_logged") === "true") {
      setAuthenticated(true);
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-gray-500 font-mono text-xs uppercase tracking-widest gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        Verifying secure credentials...
      </div>
    );
  }

  return authenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
