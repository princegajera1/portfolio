import ExperienceSection from '../components/sections/ExperienceSection';
import EducationSection from '../components/sections/EducationSection';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChatBot from '../components/ChatBot/ChatBot';
import CommandPalette from '../components/CommandPalette/CommandPalette';

export default function Experience() {
  return (
    <>
      <Navbar />
      <div className="bg-[#0A0A0F] pt-20">
        <ExperienceSection />
        <EducationSection />
      </div>
      <ChatBot />
      <CommandPalette />
      <Footer />
    </>
  );
}
