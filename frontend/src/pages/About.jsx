import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowRight, FiSmile, FiCompass, FiTarget, 
  FiClock, FiAward, FiCoffee, FiTrendingUp 
} from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChatBot from '../components/ChatBot/ChatBot';
import CommandPalette from '../components/CommandPalette/CommandPalette';
import SkillsSection from '../components/sections/SkillsSection';
import NowSection from '../components/sections/NowSection';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import useAnalytics from '../hooks/useAnalytics';

export default function About() {
  const navigate = useNavigate();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/about');
  }, [trackPageView]);

  const timeline = [
    { year: '2022', title: 'First Script', desc: 'Started learning HTML/CSS and wrote my first native JS functions.' },
    { year: '2022', title: 'Static Prototyping', desc: 'Built multi-screen web pages using flexbox, CSS Grid and basic DOM selectors.' },
    { year: '2023', title: 'React Scaffolding', desc: 'Scaffolded clean React applications using modern hooks and modular styling systems.' },
    { year: '2023', title: 'Serverless Backends', desc: 'Integrated real-time database state engines using Firestore and user sessions using Firebase Auth.' },
    { year: '2024', title: 'Full Stack Portfolios', desc: 'Shipped 6+ advanced full stack applications (MERN, Firebase Cloud security ledgers).' },
    { year: 'Current', title: 'Seeking Full-time Job', desc: 'Actively searching for Frontend Developer job roles and remote opportunities.' }
  ];

  const goals = [
    { type: 'Short-Term', icon: FiTarget, text: 'Secure a full-time frontend developer role to collaborate on enterprise SaaS applications.' },
    { type: 'Long-Term', icon: FiTrendingUp, text: 'Architect scalable UI library frameworks and progress into a full stack product architect.' }
  ];

  const funFacts = [
    { icon: FiCoffee, title: 'Fuel Source', desc: 'Converts premium local filter coffee directly into React state updates.' },
    { icon: FiClock, title: 'Timezone', desc: 'Highly comfortable syncing workflows with EU, US, and local remote schedules.' },
    { icon: FiCompass, title: 'Inspiration', desc: 'Obsessed with modern minimalistic UI design layouts from Vercel, Linear, and Stripe.' },
    { icon: FiAward, title: 'Curriculum', desc: 'Studying Computer Engineering (GTU) which guides my algorithmic and data systems design.' }
  ];

  return (
    <>
      <Helmet>
        <title>About Prince Gajera | Frontend Developer Journey</title>
        <meta name="description" content="Learn about Prince Gajera's developer story, professional coding milestones, short and long term objectives, and stack competencies." />
      </Helmet>

      <Navbar />

      <main className="bg-bg-dark pt-32 pb-16 text-left relative overflow-hidden font-sans">
        
        {/* Background grids */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
          <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/10 to-transparent" />
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(#6C63FF 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10 space-y-24">
          
          {/* Hero Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <span className="section-label block text-[#E8FF00] font-mono tracking-wider font-bold">// THE PROFILE</span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-text-primary-dark tracking-tight">
              Prince Gajera
            </h1>
            <p className="text-text-secondary-dark text-xs sm:text-sm md:text-base leading-relaxed">
              A chronological overview of my coding foundations, professional targets, and developer philosophy.
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-primary to-[#E8FF00] mx-auto mt-4 rounded-full shadow-[0_0_8px_#E8FF00]" />
          </div>

          {/* Section 1: My Story */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary-dark">
                Building Experiences, Not Just Code
              </h2>
              <div className="text-xs sm:text-sm text-text-secondary-dark space-y-4 leading-relaxed font-sans select-text">
                <p>
                  I am a self-taught Frontend Specialist currently completing my Bachelor's degree in Computer Engineering. My entry into developer operations was sparked by an obsession with clean minimalism and typography.
                </p>
                <p>
                  Over the past two years, I have systematically built portfolios and client ledgers. I believe that frontends should be fluid, responsive, and performance-optimized down to the millisecond.
                </p>
                <p>
                  When building web systems, I combine strict algorithmic structure (learnt through CE curriculums) with clean aesthetic tokens. I aim to write code that scales with zero layout shifts.
                </p>
              </div>
            </div>
            
            <div className="md:col-span-5 select-none">
              <Card className="border border-border-dark bg-[#111118]/60 backdrop-blur-xl rounded-2xl shadow-xl max-w-sm mx-auto hover:border-primary/40 transition-colors duration-300" bodyClassName="p-2">
                <img
                  src="/avatar.png"
                  alt="Prince Gajera Profile"
                  className="w-full h-full object-cover rounded-xl filter grayscale hover:grayscale-0 transition-all duration-500 contrast-110"
                />
              </Card>
            </div>
          </div>

          {/* Section 2: My Journey Timeline */}
          <div className="space-y-12 select-none">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <span className="text-[#E8FF00] font-mono text-xs tracking-wider block">// THE TIMELINE</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary-dark">
                Chronological Milestones
              </h2>
              <p className="text-text-secondary-dark text-xs font-sans">
                My development timeline tracking key learnings, project shipping rates, and milestones.
              </p>
            </div>

            <div className="relative border-l border-[#E8FF00]/20 max-w-2xl mx-auto pl-6 sm:pl-8 space-y-12">
              {timeline.map((t, idx) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group text-left"
                >
                  {/* Circle dot on line */}
                  <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full border border-bg-dark bg-border-dark group-hover:bg-[#E8FF00] group-hover:border-[#E8FF00] transition-all duration-300 flex items-center justify-center shadow-[0_0_8px_rgba(232,255,0,0.15)] group-hover:shadow-[0_0_12px_#E8FF00]">
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-bg-dark transition-colors" />
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#E8FF00] px-2 py-0.5 rounded bg-[#E8FF00]/10 border border-[#E8FF00]/20 shadow-[0_0_10px_rgba(232,255,0,0.05)]">
                      {t.year}
                    </span>
                    <h4 className="font-display font-extrabold text-sm text-text-primary-dark">
                      {t.title}
                    </h4>
                  </div>
                  <p className="text-xs text-text-secondary-dark mt-2 max-w-lg font-sans leading-relaxed">
                    {t.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Section 3: Deep Dive Skills */}
          <SkillsSection />

          {/* Section 4: Focus now */}
          <NowSection />

          {/* Section 5: Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 select-none">
            {goals.map((g) => {
              const Icon = g.icon;
              return (
                <Card key={g.type} className="border border-border-light dark:border-border-dark h-44" bodyClassName="p-6 flex flex-col justify-between h-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark">
                      {g.type} Objective
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-sans text-left mt-4">
                    {g.text}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Section 6: Fun Facts */}
          <div className="space-y-12 select-none">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark text-center">
              Quirky Personal Facts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {funFacts.map((f) => {
                const Icon = f.icon;
                return (
                  <Card key={f.title} className="border border-border-light dark:border-border-dark h-44 group" bodyClassName="p-6 flex flex-col justify-between h-full">
                    <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary w-max group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left space-y-1 mt-4">
                      <h4 className="font-display font-extrabold text-xs text-text-primary-light dark:text-text-primary-dark">
                        {f.title}
                      </h4>
                      <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark font-sans leading-snug">
                        {f.desc}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CTA: Contact Me */}
          <div className="py-12 select-none text-center max-w-xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold text-text-primary-light dark:text-text-primary-dark">
              Looking for a Frontend Developer?
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm font-sans max-w-md mx-auto leading-relaxed">
              If you have an open position on your React team or want to collaborate on a freelance product, let's schedule an interview.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/contact')}
              className="gap-2 group"
            >
              <span>Get in Touch</span>
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

        </div>
      </main>

      <ChatBot />
      <CommandPalette />

      <Footer />
    </>
  );
}
