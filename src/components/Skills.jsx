import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, MonitorPlay, Layers, Wrench, Sparkles, Database } from 'lucide-react';
import { skillsData } from '../data/skills';

gsap.registerPlugin(ScrollTrigger);

const categoryIcons = {
  "Languages": Code2,
  "Web Tech": MonitorPlay,
  "Frameworks": Layers,
  "Tools": Wrench,
  "AI & Emerging": Sparkles,
  "Databases": Database
};

const Skills = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });

    tl.fromTo('.skills-header', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo('.skills-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, 
      "-=0.3"
    );
  }, { scope: sectionRef });

  return (
    <section id="skills" ref={sectionRef} className="py-14 relative bg-custom-richBlack">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 skills-header opacity-0">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 flex items-center">
            <span className="text-custom-carrotOrange mr-2">02.</span> Technical Skills
            <div className="h-[1px] bg-white/10 flex-grow ml-6"></div>
          </h2>
          <p className="text-gray-400 max-w-2xl text-lg font-light">
            The programming languages, frameworks, and tools I use every day to build software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((skillGroup, index) => {
            const themes = [
              { ring: 'ring-custom-midnightGreen', text: 'text-custom-midnightGreen', bg: 'bg-custom-midnightGreen/10', border: 'border-custom-midnightGreen/30' },
              { ring: 'ring-custom-carrotOrange', text: 'text-custom-carrotOrange', bg: 'bg-custom-carrotOrange/10', border: 'border-custom-carrotOrange/30' },
              { ring: 'ring-custom-gargoyleGas', text: 'text-custom-gargoyleGas', bg: 'bg-custom-gargoyleGas/10', border: 'border-custom-gargoyleGas/30' },
              { ring: 'ring-pink-500', text: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30' }
            ];
            const theme = themes[index % 4];
            const IconComponent = categoryIcons[skillGroup.category] || Code2;

            return (
            <div
              key={skillGroup.category}
              className="skills-card glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-3 cursor-pointer relative overflow-hidden group bg-custom-richBlack/60 shadow-lg opacity-0"
            >
              <div className={`absolute -right-10 -top-10 w-32 h-32 ${theme.bg} rounded-full blur-[40px] group-hover:scale-[2.5] transition-transform duration-700`}></div>
              
              <div className="flex items-center space-x-4 mb-6 relative z-10">
                <div className={`p-3 rounded-xl bg-custom-richBlack/80 ring-1 ${theme.border} text-white shadow-sm`}>
                  <IconComponent size={24} className={theme.text} />
                </div>
                <h3 className="text-xl font-heading font-bold text-white group-hover:text-gray-200 transition-colors">{skillGroup.category}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2 relative z-10">
                {skillGroup.items.map((skill, i) => (
                  <span 
                    key={i} 
                    className={`px-3 py-1.5 bg-custom-richBlack/50 border border-white/10 rounded-lg text-sm text-gray-300 font-medium transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:bg-custom-richBlack hover:shadow-[0_0_15px_currentColor] hover:${theme.text} hover:${theme.border}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
