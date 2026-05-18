import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load sections for better performance
const Home = lazy(() => import('./pages/Home'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));

function App() {
  return (
    <div className="bg-dark min-h-screen text-gray-200 font-sans relative">
      <Helmet>
        <title>Gajera Prince | Full Stack Developer</title>
        <meta name="description" content="Portfolio of Gajera Prince, a Full Stack Developer & Generative AI Enthusiast from Ahmedabad, Gujarat." />
        <meta property="og:title" content="Gajera Prince | Full Stack Developer" />
        <meta property="og:description" content="Portfolio of Gajera Prince, a Full Stack Developer & Generative AI Enthusiast." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-indigo/20 blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-purple/20 blur-[120px] animate-float-delayed"></div>
        <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] rounded-full bg-accent-cyan/20 blur-[100px] animate-float"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-accent-indigo border-t-transparent rounded-full animate-spin"></div></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<ProjectsPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
