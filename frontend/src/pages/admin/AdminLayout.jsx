import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminTopbar from '../../components/layout/AdminTopbar';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#111118] text-text-primary-dark flex font-sans overflow-hidden">
      {/* Collapsible Sidebar */}
      <AdminSidebar />

      {/* Main Content Pane */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <AdminTopbar />

        {/* Dynamic Nested Route Page */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#111118]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }} // 150ms fade-in
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
