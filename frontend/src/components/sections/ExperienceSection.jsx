import { useState, useEffect } from 'react';
import ParticleBackground from '../ParticleBackground';
import { getExperience } from '../../firebase/experience';
import { useScrollReveal } from '../../hooks/useGSAP';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  useScrollReveal('.scroll-reveal-exp');

  useEffect(() => {
    const fetchExp = async () => {
      const data = await getExperience();
      setExperiences(data);
      setLoading(false);
    };
    fetchExp();
  }, []);

  useEffect(() => {
    if (loading) return;

    // Standard high-end recalculation refresh once dynamically loaded cards paint
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    const ctx = gsap.context(() => {
      // Timeline dots scaling reveals
      gsap.fromTo('.timeline-node', 
        { opacity: 0, scale: 0 },
        { 
          opacity: 1, scale: 1, 
          duration: 0.5, 
          stagger: 0.08, 
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 85%'
          }
        }
      );

      // Stagger slide timeline cards
      gsap.fromTo('.timeline-card', 
        { opacity: 0, x: (i) => window.innerWidth > 768 ? (i % 2 === 0 ? -30 : 30) : -20 },
        { 
          opacity: 1, x: 0, 
          duration: 0.7, 
          stagger: 0.12, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 85%'
          }
        }
      );
    });

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [loading]);

  return (
    <section id="experience" className="relative bg-dark overflow-hidden py-16 sm:py-20 px-6">
      {/* Dynamic Cyan Particle background galaxy */}
      <ParticleBackground color="#00D4FF" density={90} />

      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="scroll-reveal-exp mb-12 text-center select-none">
          <p className="text-secondary font-mono text-xs uppercase tracking-[0.25em] mb-2">&lt; Timeline /&gt;</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white">Experience</h2>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500 font-mono text-xs uppercase tracking-widest gap-4 select-none">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Assembling history...
          </div>
        ) : (
          /* Timeline core */
          <div className="timeline-container relative border-l border-white/10 ml-4 md:ml-0 md:mx-auto md:border-l-0 md:flex md:flex-col md:items-center">
            
            {/* Center connecting line for large viewports */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-primary via-secondary to-accent" />

            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={exp.id} 
                  className={`relative mb-12 md:mb-16 w-full flex flex-col md:flex-row md:justify-between items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  
                  {/* Glowing Tree bullet node */}
                  <div className="timeline-node absolute left-[-21px] top-6 md:left-1/2 md:-translate-x-1/2 md:top-6 w-10 h-10 rounded-xl bg-surface-2 border border-white/10 flex items-center justify-center z-20 transition-all duration-300 hover:border-primary">
                    <span className={`w-2 h-2 rounded-full ${
                      exp.current 
                        ? 'bg-secondary animate-pulse shadow-[0_0_8px_#00D4FF]' 
                        : 'bg-primary'
                    }`} />
                  </div>

                  <div className="hidden md:block w-[45%]" />

                  {/* Visual card */}
                  <div className="timeline-card w-full md:w-[45%] ml-8 md:ml-0 bg-surface-2 border border-white/5 p-5 sm:p-6 rounded-2xl relative hover:border-primary/30 transition-colors duration-300">
                    <div className={`absolute top-6 w-3 h-3 rotate-45 bg-surface-2 border border-white/5 border-r-0 border-t-0 hidden md:block ${
                      isEven ? 'right-[-7px] border-l-0 border-b-0 border-r border-t' : 'left-[-7px]'
                    }`} />

                    <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                      <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider select-none">
                        {exp.company.includes('Shreeji') ? (() => {
                          const start = new Date('2026-04-15');
                          const now = new Date();
                          let diff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
                          if (now.getDate() < start.getDate()) {
                            diff--;
                          }
                          const completedMonths = Math.max(1, diff);
                          return `April 15, 2026 – Present (${completedMonths} ${completedMonths === 1 ? 'Month' : 'Months'} completed)`;
                        })() : exp.duration}
                      </span>
                      {exp.company.includes('Shreeji') && (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/20 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.15)]">
                          CURRENT
                        </span>
                      )}
                      {exp.company.includes('Prodigy') && (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-secondary/10 text-secondary border border-secondary/20 shadow-[0_0_8px_rgba(0,212,255,0.15)]">
                          COMPLETED
                        </span>
                      )}
                      {exp.company.includes('SAL Engineering') && (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 shadow-[0_0_8px_rgba(108,99,255,0.15)]">
                          ONGOING
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-white text-base sm:text-lg font-bold font-display leading-tight mb-1">
                      {exp.role}
                    </h3>
                    <h4 className="text-secondary font-semibold text-xs sm:text-sm mb-4 font-sans select-none">
                      {exp.company}
                    </h4>
                    
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-5">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 select-none">
                      {exp.technologies.map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="bg-white/5 text-[9px] sm:text-[10px] text-gray-400 font-mono px-2 py-0.5 rounded border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Education Subsection */}
        <div className="scroll-reveal-exp mt-24 mb-20">
          <div className="text-center mb-12 select-none">
            <p className="text-secondary font-mono text-xs uppercase tracking-[0.25em] mb-2">&lt; Academics /&gt;</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">Education</h2>
          </div>

          <div className="space-y-6">
            {/* Ongoing B.E. Degree Card - Premium Full Width */}
            <div className="bg-surface-2 border border-white/5 p-6 sm:p-8 rounded-2xl relative hover:border-primary/30 transition-all duration-300 shadow-[0_0_20px_rgba(108,99,255,0.03)] flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 max-w-2xl text-left">
                <div className="flex justify-between items-start flex-wrap gap-2 select-none">
                  <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block">2023 – Present</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 shadow-[0_0_8px_rgba(108,99,255,0.15)]">
                    ONGOING
                  </span>
                </div>
                <h3 className="text-white text-lg sm:text-xl font-bold font-display leading-tight">
                  B.E. in Computer Engineering
                </h3>
                <h4 className="text-secondary font-semibold text-xs sm:text-sm font-sans select-none">
                  SAL Engineering and Technical Institute (Affiliated to GTU)
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  Currently pursuing B.E. in Computer Engineering. Developing core foundational software engineering expertise across algorithmic logic, object-oriented concepts, relational database schemas, and clean repository structures.
                </p>
              </div>
              
              <div className="flex flex-wrap md:flex-col gap-2 justify-start items-start md:items-end select-none min-w-[150px]">
                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block md:text-right w-full mb-1">Core curriculum</p>
                {["Computer Engineering", "C++", "Java", "Python", "SQL", "Git"].map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="bg-white/5 text-[9px] sm:text-[10px] text-gray-400 font-mono px-2.5 py-1 rounded border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Twin Grid for HSC & SSC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* HSC Card */}
              <div className="bg-surface-2 border border-white/5 p-6 rounded-2xl relative hover:border-secondary/30 transition-all duration-300">
                <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block mb-2">2021 – 2023</span>
                <h3 className="text-white text-base sm:text-lg font-bold font-display mb-1">HSC (Science)</h3>
                <h4 className="text-secondary font-semibold text-xs sm:text-sm mb-4 font-sans">Amreli, Gujarat</h4>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4">
                  Completed higher secondary education in the science stream with a strong focus on mathematics, physics, and computer science.
                </p>
                <div className="font-mono text-xs text-accent font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Score: 66.46%
                </div>
              </div>

              {/* SSC Card */}
              <div className="bg-surface-2 border border-white/5 p-6 rounded-2xl relative hover:border-secondary/30 transition-all duration-300">
                <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block mb-2">2019 – 2021</span>
                <h3 className="text-white text-base sm:text-lg font-bold font-display mb-1">SSC</h3>
                <h4 className="text-secondary font-semibold text-xs sm:text-sm mb-4 font-sans">Amreli, Gujarat</h4>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4">
                  Completed secondary school certificate curriculum with excellent grades in mathematics and science.
                </p>
                <div className="font-mono text-xs text-accent font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Score: 69.95%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="scroll-reveal-exp mt-20">
          <div className="text-center mb-12 select-none">
            <p className="text-secondary font-mono text-xs uppercase tracking-[0.25em] mb-2">&lt; Credentials /&gt;</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">Certifications</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Python 101 for Data Science", provider: "IBM Cognitive Class", tech: "Python / Data Science" },
              { title: "Communication Skills", provider: "TCS iON", tech: "Soft Skills" },
              { title: "Interview Skills", provider: "TCS iON", tech: "Professional Skills" },
              { title: "Generative AI Internship", provider: "Prodigy InfoTech", tech: "AI / Machine Learning" },
              { title: "Business Etiquette", provider: "TCS iON", tech: "Corporate Culture" },
              { title: "Cyber Security Awareness", provider: "ISEA, Government of India", tech: "Cyber Security" }
            ].map((cert, idx) => (
              <div 
                key={idx} 
                className="bg-surface border border-white/5 p-5 rounded-xl hover:border-primary/40 hover:shadow-[0_0_15px_rgba(108,99,255,0.03)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-primary uppercase tracking-wider block font-semibold">{cert.provider}</span>
                  <h3 className="text-white text-xs sm:text-sm font-bold font-display leading-snug">{cert.title}</h3>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[9px] text-gray-500">
                  {cert.tech}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
