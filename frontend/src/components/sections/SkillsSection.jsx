import { useState, useEffect } from 'react';
import ParticleBackground from '../ParticleBackground';
import { getSkills } from '../../firebase/skills';
import { useScrollReveal } from '../../hooks/useGSAP';
import AntiGravityField from '../AntiGravityField';

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  useScrollReveal('.scroll-reveal-skills');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchSkills();

    window.addEventListener('skillsUpdated', fetchSkills);
    return () => {
      window.removeEventListener('skillsUpdated', fetchSkills);
    };
  }, []);

  // Filter skills by category
  const frontendSkills = skills.filter(s => s.category === 'frontend');
  const backendSkills  = skills.filter(s => s.category === 'backend' || s.category === 'fullstack');
  const toolsSkills    = skills.filter(s => s.category === 'tools');

  // Helper to determine active experience context based on skill power level
  const getSkillContext = (level) => {
    if (level >= 88) return '3+ Yrs';
    if (level >= 75) return '2+ Yrs';
    return '1+ Yr';
  };

  // Helper to duplicate arrays to make them scroll infinitely
  const prepareMarqueeItems = (arr) => {
    if (!arr || arr.length === 0) return [];
    // Repeat the array elements to fill the scrolling track completely
    return [...arr, ...arr, ...arr, ...arr];
  };

  return (
    <section id="skills" className="relative bg-dark overflow-hidden py-24 px-6">
      {/* Marquee Animation Stylesheet */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marquee-left 35s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marquee-right 35s linear infinite;
        }
        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      <ParticleBackground color="#E8FF00" density={40} />

      <div className="absolute bottom-1/4 left-[10%] w-96 h-96 bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="scroll-reveal-skills mb-16 text-center md:text-left select-none">
          <span className="section-label block mb-2">// 03. stack</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white">Skills &amp; Technology</h2>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 font-mono text-xs uppercase tracking-widest gap-4 select-none">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Compiling skillset...
          </div>
        ) : (
          <div className="space-y-10 py-4 overflow-hidden relative">
            
            {/* ROW 1: Frontend (Slides Left) */}
            {frontendSkills.length > 0 && (
              <div className="relative w-full overflow-hidden py-2 border-y border-white/5 bg-[#111]/30">
                <div className="animate-marquee-left gap-4 flex">
                  <AntiGravityField>
                    {prepareMarqueeItems(frontendSkills).map((skill, index) => (
                      <div 
                        key={`${skill.id}-fe-${index}`}
                        className="px-6 py-4 bg-[#111] border border-white/5 hover:border-primary/40 text-gray-300 font-mono text-sm flex items-center gap-4 shrink-0 transition-all select-none hover:text-white"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#E8FF00]" />
                        <span className="font-bold">{skill.name}</span>
                        <span className="text-[10px] text-gray-500 bg-[#161616] px-2 py-0.5 border border-white/5 font-black uppercase">
                          {getSkillContext(skill.level)}
                        </span>
                      </div>
                    ))}
                  </AntiGravityField>
                </div>
              </div>
            )}

            {/* ROW 2: Backend (Slides Right) */}
            {backendSkills.length > 0 && (
              <div className="relative w-full overflow-hidden py-2 border-b border-white/5 bg-[#111]/30">
                <div className="animate-marquee-right gap-4 flex">
                  <AntiGravityField>
                    {prepareMarqueeItems(backendSkills).map((skill, index) => (
                      <div 
                        key={`${skill.id}-be-${index}`}
                        className="px-6 py-4 bg-[#111] border border-white/5 hover:border-primary/40 text-gray-300 font-mono text-sm flex items-center gap-4 shrink-0 transition-all select-none hover:text-white"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#EDEDED] shadow-[0_0_8px_#FFFFFF]" />
                        <span className="font-bold">{skill.name}</span>
                        <span className="text-[10px] text-gray-500 bg-[#161616] px-2 py-0.5 border border-white/5 font-black uppercase">
                          {getSkillContext(skill.level)}
                        </span>
                      </div>
                    ))}
                  </AntiGravityField>
                </div>
              </div>
            )}

            {/* ROW 3: Tools & DevOps (Slides Left) */}
            {toolsSkills.length > 0 && (
              <div className="relative w-full overflow-hidden py-2 border-b border-white/5 bg-[#111]/30">
                <div className="animate-marquee-left gap-4 flex">
                  <AntiGravityField>
                    {prepareMarqueeItems(toolsSkills).map((skill, index) => (
                      <div 
                        key={`${skill.id}-tools-${index}`}
                        className="px-6 py-4 bg-[#111] border border-white/5 hover:border-primary/40 text-gray-300 font-mono text-sm flex items-center gap-4 shrink-0 transition-all select-none hover:text-white"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#E8FF00]" />
                        <span className="font-bold">{skill.name}</span>
                        <span className="text-[10px] text-gray-500 bg-[#161616] px-2 py-0.5 border border-white/5 font-black uppercase">
                          {getSkillContext(skill.level)}
                        </span>
                      </div>
                    ))}
                  </AntiGravityField>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
