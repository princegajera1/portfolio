import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Public Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import Loader from './components/Loader';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Contact from './pages/Contact';

// Admin Pages & Core Layout
import AdminLayout from './admin/AdminLayout';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import ManageProjects from './admin/ManageProjects';
import ManageSkills from './admin/ManageSkills';
import ViewMessages from './admin/ViewMessages';

function AppContent({ darkMode, setDarkMode }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Check if current route is inside the Admin Dashboard paths
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <>
      {/* 0-100% Intro loading screen */}
      {loading && <Loader onComplete={() => setLoading(false)} />}
      
      {/* Glowing Trailing Cursor */}
      <Cursor />

      {/* Renders visitor headers/footers only if we are outside the admin dashboard manager */}
      {!isAdminRoute && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}

      <Routes>
        {/* Public Visitor Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Administration Nested Router */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="messages" element={<ViewMessages />} />
        </Route>
        
        {/* Auth Route */}
        <Route path="/admin/login" element={<Login />} />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme_mode');
    return saved ? saved === 'dark' : true; // default dark neon
  });

  useEffect(() => {
    localStorage.setItem('theme_mode', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <ToastProvider>
        <ConfirmProvider>
          <AppContent darkMode={darkMode} setDarkMode={setDarkMode} />
        </ConfirmProvider>
      </ToastProvider>
    </Router>
  );
}
