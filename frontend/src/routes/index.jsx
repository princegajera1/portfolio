import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Spinner from '../components/ui/Spinner';
import PublicLayout from '../components/layout/PublicLayout';

// Suspense wrapper
const Loadable = (Component) => (props) => (
  <Suspense fallback={
    <div className="min-h-screen bg-bg-dark flex justify-center items-center">
      <Spinner size="lg" />
    </div>
  }>
    <Component {...props} />
  </Suspense>
);

// Public Pages
const Home = Loadable(lazy(() => import('../pages/Home')));
const About = Loadable(lazy(() => import('../pages/About')));
const Projects = Loadable(lazy(() => import('../pages/Projects')));
const ProjectDetail = Loadable(lazy(() => import('../pages/ProjectDetail')));
const Contact = Loadable(lazy(() => import('../pages/Contact')));
const Resume = Loadable(lazy(() => import('../pages/Resume')));
const Experience = Loadable(lazy(() => import('../pages/Experience')));
const Booking = Loadable(lazy(() => import('../pages/Booking')));
const NotFound = Loadable(lazy(() => import('../pages/NotFound')));

// Admin Pages
const AdminLogin = Loadable(lazy(() => import('../pages/admin/AdminLogin')));
const AdminLayout = Loadable(lazy(() => import('../pages/admin/AdminLayout')));
const Overview = Loadable(lazy(() => import('../pages/admin/Overview')));
const ProjectsManager = Loadable(lazy(() => import('../pages/admin/ProjectsManager')));
const ProjectForm = Loadable(lazy(() => import('../pages/admin/ProjectForm')));
const Settings = Loadable(lazy(() => import('../pages/admin/Settings')));
const SocialLinks = Loadable(lazy(() => import('../pages/admin/SocialLinks')));
const ResumeManager = Loadable(lazy(() => import('../pages/admin/ResumeManager')));
const Messages = Loadable(lazy(() => import('../pages/admin/Messages')));
const Bookings = Loadable(lazy(() => import('../pages/admin/Bookings')));

export const router = createBrowserRouter([
  // Public Routes — wrapped in PublicLayout for page transitions
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/projects', element: <Projects /> },
      { path: '/project/:slug', element: <ProjectDetail /> },
      { path: '/blog', element: <Navigate to="/" replace /> },
      { path: '/blog/:slug', element: <Navigate to="/" replace /> },
      { path: '/certificates', element: <Navigate to="/" replace /> },
      { path: '/contact', element: <Contact /> },
      { path: '/booking', element: <Booking /> },
      { path: '/resume', element: <Resume /> },
      { path: '/experience', element: <Experience /> },
    ]
  },

  // Admin Auth Route
  { path: '/admin-login', element: <AdminLogin /> },

  // Protected Admin Dashboard Routes
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/overview" replace /> },
          { path: 'overview', element: <Overview /> },
          { path: 'bookings', element: <Bookings /> },
          { path: 'projects', element: <ProjectsManager /> },
          { path: 'projects/new', element: <ProjectForm /> },
          { path: 'projects/edit/:id', element: <ProjectForm /> },
          { path: 'settings', element: <Settings /> },
          { path: 'social-links', element: <SocialLinks /> },
          { path: 'resume', element: <ResumeManager /> },
          { path: 'messages', element: <Messages /> }
        ]
      }
    ]
  },

  // Fallback Catch-all Route
  { path: '*', element: <NotFound /> }
]);
