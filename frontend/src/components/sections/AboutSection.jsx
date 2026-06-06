import { useEffect, useState } from 'react';
import ParticleBackground from '../ParticleBackground';
import { useScrollReveal } from '../../hooks/useGSAP';
import { getExperience } from '../../firebase/experience';

export default function AboutSection() {
  useScrollReveal('.scroll-reveal-about');
  const [internshipMonths, setInternshipMonths] = useState(2);
  const [internshipCount, setInternshipCount] = useState(2);

  // Dynamic Coding Experience Auto-calculation (Starts from September 2023)
  const getCodingExp = () => {
    const start = new Date('2023-09-01');
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return `${Math.floor(diffYears)}+ Yrs`;
  };

  useEffect(() => {
    const fetchAndCalculateInternships = async () => {
      try {
        const data = await getExperience();
        if (data && data.length) {
          const interns = data.filter(e => e.role.toLowerCase().includes('intern'));
          setInternshipCount(interns.length);

          let totalMonths = 0;
          interns.forEach(e => {
            if (e.current || e.company.includes('Shreeji')) {
              const start = new Date('2026-04-15');
              const now = new Date();
              let diff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
              if (now.getDate() < start.getDate()) {
                diff--;
              }
              const ongoing = Math.max(1, diff);
              totalMonths += ongoing;
            } else if (e.company.includes('Prodigy')) {
              totalMonths += 1;
            } else {
              totalMonths += 1;
            }
          });
          setInternshipMonths(totalMonths);
        }
      } catch (e) {
        console.error("Error fetching internships in AboutSection:", e);
      }
    };
    fetchAndCalculateInternships();
  }, []);

  const skillChips = [
    { name: 'React.js', category: 'frontend' },
    { name: 'JavaScript (ES6+)', category: 'frontend' },
    { name: 'Vite', category: 'frontend' },
    { name: 'Tailwind CSS', category: 'frontend' },
    { name: 'GSAP Animations', category: 'frontend' },
    { name: 'Java / Python', category: 'backend' },
    { name: 'Node.js & Express', category: 'backend' },
    { name: 'Firebase Serverless', category: 'backend' },
    { name: 'REST APIs', category: 'backend' },
    { name: 'Git & GitHub', category: 'tools' },
    { name: 'SQL / Firestore', category: 'backend' }
  ];

  return (
    <section id="about" className="relative bg-dark overflow-hidden pt-24 pb-20 px-6">
      <ParticleBackground color="#E8FF00" density={50} />
      
      {/* Off-grid asymmetric glow overlays */}
      <div className="absolute top-[10%] right-[-5%] w-[450px] h-[450px] bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[5%] left-[-10%] w-[350px] h-[350px] bg-primary/3 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="scroll-reveal-about mb-16 text-center md:text-left select-none">
          <span className="section-label block mb-2">// 01. profile</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white pb-1">Professional Story</h2>
        </div>

        {/* Narrative & Polaroid Layout — Off-grid intentional asymmetry */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Polaroid Style Photo Frame - Rotated 1.5deg */}
          <div className="scroll-reveal-about md:col-span-5 flex justify-center md:justify-start order-2 md:order-1 z-10">
            <div 
              className="relative p-4 pb-12 bg-[#f4ebd0] text-[#1A1A1A] shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:rotate-0 hover:scale-[1.03] select-none border border-white/10"
              style={{
                width: '280px',
                transform: 'rotate(-2deg)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {/* Photo placeholder frame */}
              <div className="relative w-full aspect-square bg-[#222] overflow-hidden border border-black/10">
                <img 
                  src="/robot.png" 
                  alt="Prince Polaroid Frame Portrait"
                  className="w-full h-full object-cover filter sepia brightness-95 contrast-125"
                />
              </div>
              
              {/* Handwritten style caption */}
              <div className="mt-4 text-center text-xs tracking-wide font-black uppercase text-[#1a1a1a]/70">
                Prince Gajera // {new Date().getFullYear()}
              </div>

              {/* Tape visual effect */}
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/20 backdrop-blur-[1px] rotate-[-5deg] border-x border-dashed border-black/5"
                style={{ mixBlendMode: 'overlay' }}
              />
            </div>
          </div>

          {/* Genuine Narrative Story — Asymmetrical offset layout */}
          <div className="scroll-reveal-about md:col-span-7 space-y-6 text-gray-300 order-1 md:order-2 md:-ml-8 md:-translate-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-white font-display leading-tight">
              A computer engineering student bridging modular databases and responsive layout visual logic.
            </h3>
            
            <div className="space-y-4 text-sm sm:text-base leading-relaxed font-sans text-gray-400">
              <p>
                I started coding at 17 by breaking my high school's website trying to change my grades. Ever since that spark, I've been obsessed with how systems work under the hood. Today, I spend my time building modular React structures, designing database architectures, and engineering custom layouts that load in milliseconds.
              </p>
              
              <p>
                I am currently in my third year of <strong className="text-white font-semibold">B.E. in Computer Engineering</strong> at SAL Engineering and Technical Institute. Alongside my studies, I build commercial databases (like tire inventory platforms for Chandrakant Traders) and high-performance visual storefronts.
              </p>

              {/* The "Currently" Tracker */}
              <div className="font-mono text-xs text-gray-300 border-l border-primary/40 pl-4 py-2 mt-4 select-text">
                <span className="text-primary font-bold">Currently:</span> Diving deep into performance optimization, WebGL animations, and serverless edge functions.
              </div>
            </div>

            {/* Micro badges row */}
            <div className="flex flex-wrap gap-2 pt-2 select-none justify-center md:justify-start">
              {[
                `🎓 SAL GTU Student`, 
                `💼 ${internshipMonths} Months Experience`, 
                `📍 Gujarat, India`
              ].map((badge, idx) => (
                <span key={idx} className="px-3 py-1.5 text-[10px] font-mono font-bold bg-[#111] border border-white/5 text-gray-300">
                  {badge}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Skill Chips Grid with subtle hover animations (No progress bars!) */}
        <div className="scroll-reveal-about pt-8 border-t border-white/10">
          <p className="section-label block mb-6 text-center md:text-left">// Core Toolkit</p>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {skillChips.map((chip, index) => (
              <div
                key={index}
                className="px-4 py-2.5 bg-[#111] border border-white/5 text-gray-300 text-xs sm:text-sm font-mono transition-all duration-300 hover:border-primary hover:text-white hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(232,255,0,0.1)] select-none cursor-default"
              >
                <span className="text-primary mr-1.5">•</span>
                {chip.name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
