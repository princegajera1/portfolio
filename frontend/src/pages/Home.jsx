// Sections
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import ContactSection from '../components/sections/ContactSection';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. About Section */}
      <AboutSection />

      {/* 3. Skills Section */}
      <SkillsSection />

      {/* 4. Projects Section */}
      <ProjectsSection />

      {/* 5. Experience Section */}
      <ExperienceSection />

      {/* 6. Contact Section */}
      <ContactSection />
    </div>
  );
}
