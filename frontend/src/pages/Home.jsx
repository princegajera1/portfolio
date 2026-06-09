import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import useAnalytics from '../hooks/useAnalytics';

// Layout & Global Components (ChatBot and CommandPalette will be mounted globally or here)
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChatBot from '../components/ChatBot/ChatBot';
import CommandPalette from '../components/CommandPalette/CommandPalette';

// Landing Sections
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import NowSection from '../components/sections/NowSection';
import SkillsSection from '../components/sections/SkillsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import EducationSection from '../components/sections/EducationSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import ContactSection from '../components/sections/ContactSection';

export default function Home() {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/');
  }, [trackPageView]);

  return (
    <>
      {/* SEO Head Infrastructure */}
      <Helmet>
        <title>Prince Gajera | Frontend Developer &amp; React Specialist</title>
        <meta name="description" content="Official portfolio of Prince Gajera, a high-performance Frontend Developer &amp; React Specialist. Explore expert e-commerce platforms, serverless architectures, and advanced UI animations." />
        <link rel="canonical" href="https://princegajera.vercel.app/" />
        
        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://princegajera.vercel.app/" />
        <meta property="og:title" content="Prince Gajera | Frontend Developer &amp; React Specialist" />
        <meta property="og:description" content="Official portfolio of Prince Gajera, a high-performance Frontend Developer &amp; React Specialist. Explore case studies and dynamic coding timelines." />
        <meta property="og:image" content="https://princegajera.vercel.app/og-image.jpg" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prince Gajera | Frontend Developer &amp; React Specialist" />
        <meta name="twitter:description" content="Explore Prince Gajera's web engineering portfolio. React, Firebase, and Framer Motion." />
        <meta name="twitter:image" content="https://princegajera.vercel.app/og-image.jpg" />

        {/* JSON-LD Structured Data Entity */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Prince Gajera",
              "jobTitle": "Frontend Developer",
              "url": "https://princegajera.vercel.app",
              "image": "https://princegajera.vercel.app/og-image.jpg",
              "sameAs": [
                "https://github.com/princegajera1",
                "https://www.linkedin.com/in/gajera-prince/"
              ]
            }
          `}
        </script>
      </Helmet>

      {/* Public Layout Navbar */}
      <Navbar />

      <main className="relative min-h-screen bg-bg-dark w-full overflow-x-hidden">
        
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. About Section */}
        <AboutSection />

        {/* 3. Now Section */}
        <NowSection />

        {/* 4. Skills Section */}
        <SkillsSection />

        {/* 5. Projects Section */}
        <ProjectsSection />

        {/* 6. Experience Section */}
        <ExperienceSection />

        {/* 7. Education Section */}
        <EducationSection />

        {/* 8. Testimonials Section */}
        <TestimonialsSection />

        {/* 9. Contact Section */}
        <ContactSection />

      </main>

      {/* Global Utilities */}
      <ChatBot />
      <CommandPalette />

      {/* Public Layout Footer */}
      <Footer />
    </>
  );
}
