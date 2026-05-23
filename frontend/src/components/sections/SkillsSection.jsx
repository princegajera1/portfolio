import { useState, useEffect } from 'react';
import ParticleBackground from '../ParticleBackground';
import { getSkills } from '../../firebase/skills';
import { useScrollReveal } from '../../hooks/useGSAP';
import gsap from 'gsap';

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
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

    // Listen for custom real-time skills update events!
    window.addEventListener('skillsUpdated', fetchSkills);
    return () => {
      window.removeEventListener('skillsUpdated', fetchSkills);
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    // Trigger skills fill animation
    gsap.fromTo('.progress-fill', 
      { width: '0%' },
      { 
        width: (i, el) => el.getAttribute('data-level') + '%', 
        duration: 1.2, 
        ease: 'power3.out', 
        stagger: 0.04,
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 85%'
        }
      }
    );

    // Stagger slide skills cards
    gsap.fromTo('.skill-card', 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, y: 0, 
        duration: 0.5, 
        stagger: 0.04, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 85%'
        }
      }
    );
  }, [loading, activeCategory]);

  const categories = [
    { id: 'all', name: 'All Stack' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend & DB' },
    { id: 'tools', name: 'Tools & DevOps' }
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="relative bg-dark overflow-hidden pt-6 pb-16 sm:pt-8 sm:pb-20 px-6">
      {/* Pink Background Particle canvas */}
      <ParticleBackground color="#FF6B9D" density={90} />

      <div className="absolute bottom-1/4 left-[10%] w-96 h-96 bg-accent/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="scroll-reveal-skills mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-accent font-mono text-xs uppercase tracking-[0.25em] mb-2 select-none">&lt; Technologies /&gt;</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white">Skills & Core Tech</h2>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center bg-surface-2 p-1.5 rounded-xl border border-white/5 font-mono text-[10px] sm:text-xs select-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === cat.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500 font-mono text-xs uppercase tracking-widest gap-4 select-none">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Compiling skillset...
          </div>
        ) : (
          /* Pro-Level Glowing Cyber Grid */
          <div className="skills-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => {
              // Custom neon theme colors based on skill proficiency
              const isExpert = skill.level >= 88;
              const isAdvanced = skill.level >= 75;
              
              const themeColor = isExpert 
                ? 'shadow-[0_0_15px_rgba(255,95,158,0.12)] border-accent/25 hover:border-accent/60' 
                : isAdvanced 
                  ? 'shadow-[0_0_15px_rgba(0,229,255,0.12)] border-secondary/25 hover:border-secondary/60' 
                  : 'shadow-[0_0_15px_rgba(124,111,255,0.12)] border-primary/25 hover:border-primary/60';
              
              const textGlow = isExpert 
                ? 'text-accent shadow-[0_0_8px_rgba(255,95,158,0.3)] bg-accent/5 border-accent/10' 
                : isAdvanced 
                  ? 'text-secondary shadow-[0_0_8px_rgba(0,229,255,0.3)] bg-secondary/5 border-secondary/10' 
                  : 'text-primary shadow-[0_0_8px_rgba(124,111,255,0.3)] bg-primary/5 border-primary/10';

              const badgeText = isExpert 
                ? 'EXPERT' 
                : isAdvanced 
                  ? 'ADVANCED' 
                  : 'INTERMEDIATE';

              return (
                <div 
                  key={skill.id}
                  className={`skill-card bg-[#0d0d1a]/85 border backdrop-blur-md p-6 sm:p-7 rounded-2xl ${themeColor} transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between h-[130px] group`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-white font-bold text-sm sm:text-base font-display flex items-center gap-2.5 select-none transition-colors duration-300 group-hover:text-white">
                      <span className={`w-2 h-2 rounded-full ${
                        isExpert ? 'bg-accent shadow-[0_0_8px_#FF5F9E]' : isAdvanced ? 'bg-secondary shadow-[0_0_8px_#00E5FF]' : 'bg-primary shadow-[0_0_8px_#7C6FFF]'
                      }`} />
                      {skill.name}
                    </span>
                    
                    {/* Glowing Monospace Proficiency tag */}
                    <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-black border tracking-wider select-none ${textGlow}`}>
                      {badgeText}
                    </span>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center text-[10px] font-mono select-none">
                      <span className="text-gray-500">POWER LEVEL</span>
                      <span className={`font-bold ${isExpert ? 'text-accent' : isAdvanced ? 'text-secondary' : 'text-primary'}`}>{skill.level}%</span>
                    </div>
                    
                    {/* Glowing Core progress gauge bar */}
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                      <div 
                        className={`progress-fill h-full rounded-full transition-all duration-1000 ${
                          isExpert ? 'bg-gradient-to-r from-accent to-pink-500 shadow-[0_0_10px_#FF5F9E]' : isAdvanced ? 'bg-gradient-to-r from-secondary to-blue-500 shadow-[0_0_10px_#00E5FF]' : 'bg-gradient-to-r from-primary to-indigo-500 shadow-[0_0_10px_#7C6FFF]'
                        }`}
                        data-level={skill.level}
                        style={{ width: '0%' }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}


      </div>
    </section>
  );
}
