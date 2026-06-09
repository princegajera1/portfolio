import { auth, isFirebaseConfigured } from './config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const isOfflineMode = () => !isFirebaseConfigured || !auth || localStorage.getItem('mock_admin_logged') === 'true';

export const signIn = async (email, password) => {
  if (isOfflineMode()) {
    if (email === 'admin@portfolio.com' && password === 'password123') {
      localStorage.setItem('mock_admin_logged', 'true');
      window.dispatchEvent(new CustomEvent('authChanged'));
      return {
        uid: 'mock-admin-id',
        email: 'admin@portfolio.com',
        displayName: 'Prince Gajera (Mock)',
        isMock: true
      };
    }
    throw new Error('Invalid mock administrator credentials');
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    window.dispatchEvent(new CustomEvent('authChanged'));
    return result.user;
  } catch (error) {
    console.error('Firebase Auth sign in error:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  if (isOfflineMode()) {
    localStorage.removeItem('mock_admin_logged');
    window.dispatchEvent(new CustomEvent('authChanged'));
    return true;
  }

  try {
    await signOut(auth);
    window.dispatchEvent(new CustomEvent('authChanged'));
    return true;
  } catch (error) {
    console.error('Firebase Auth sign out error:', error);
    throw error;
  }
};
