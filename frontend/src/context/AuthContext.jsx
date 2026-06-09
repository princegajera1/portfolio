import { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local mock login state active (offline/dev fallback)
    const mockLogged = localStorage.getItem('mock_admin_logged') === 'true';
    
    if (mockLogged) {
      setUser({
        uid: 'mock-admin-id',
        email: 'admin@portfolio.com',
        displayName: 'Prince Gajera (Mock)',
        isMock: true
      });
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        // Double check if mock login wasn't set while this listener ran
        const currentMockLogged = localStorage.getItem('mock_admin_logged') === 'true';
        if (!currentMockLogged) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginMock = (email, password) => {
    const formattedEmail = email.toLowerCase().trim();
    if ((formattedEmail === 'admin@portfolio.com' || formattedEmail === 'princegajera944@gmail.com') && 
        (password === 'password123' || password === 'Riya@2412')) {
      localStorage.setItem('mock_admin_logged', 'true');
      setUser({
        uid: 'mock-admin-id',
        email: formattedEmail,
        displayName: 'Prince Gajera (Mock)',
        isMock: true
      });
      return true;
    }
    return false;
  };

  const logoutMock = () => {
    localStorage.removeItem('mock_admin_logged');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginMock, logoutMock }}>
      {children}
    </AuthContext.Provider>
  );
}
