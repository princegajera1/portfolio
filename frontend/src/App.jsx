import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { ToastProvider } from './context/ToastContext';
import { LenisProvider } from './context/LenisContext';
import { router } from './routes/index';
import Cursor from './components/Cursor';

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <ConfirmProvider>
            <ToastProvider>
              {/* Glowing Trailing Cursor */}
              <Cursor />
              
              {/* Lenis Smooth Scroll + Router */}
              <LenisProvider>
                <RouterProvider router={router} />
              </LenisProvider>
              
              {/* React Hot Toast Handler */}
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#111118',
                    color: '#F0F0FF',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    borderRadius: '8px',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#00e5ff',
                      secondary: '#111118',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#111118',
                    },
                  },
                }}
              />
            </ToastProvider>
          </ConfirmProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
