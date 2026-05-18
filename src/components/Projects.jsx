import { useRef } from 'react';
import { ExternalLink, Github, ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projectsData } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const displayProjects = projectsData.filter(p => p.featured).slice(0, 3);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });

    tl.fromTo('.projects-header', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo('.project-card', 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, 
      "-=0.2"
    );
  }, { scope: sectionRef });

  return (
    <section id="projects" ref={sectionRef} className="py-14 relative bg-custom-richBlack">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 projects-header opacity-0">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 flex items-center">
              <span className="text-custom-carrotOrange mr-2">03.</span> Featured Work
              <div className="h-[1px] bg-white/10 flex-grow ml-6 hidden sm:block"></div>
            </h2>
            <p className="text-gray-400 text-lg font-light">
              A selection of my recent work, built with modern web technologies.
            </p>
          </div>
          
          <Link to="/projects" className="hidden md:flex items-center text-custom-gargoyleGas hover:text-white font-mono tracking-widest text-xs uppercase group transition-colors">
            View Full Archive 
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => {
            const themes = [
              { border: 'border-custom-midnightGreen/30 hover:border-custom-midnightGreen/80', shadow: 'hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]', text: 'text-custom-midnightGreen', glow: 'bg-custom-midnightGreen/20', ring: 'ring-custom-midnightGreen/20 group-hover:ring-custom-midnightGreen/60', hoverText: 'group-hover:text-custom-midnightGreen', btnHover: 'hover:bg-custom-midnightGreen hover:text-white hover:border-custom-midnightGreen hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]' },
              { border: 'border-custom-carrotOrange/30 hover:border-custom-carrotOrange/80', shadow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]', text: 'text-custom-carrotOrange', glow: 'bg-custom-carrotOrange/20', ring: 'ring-custom-carrotOrange/20 group-hover:ring-custom-carrotOrange/60', hoverText: 'group-hover:text-custom-carrotOrange', btnHover: 'hover:bg-custom-carrotOrange hover:text-white hover:border-custom-carrotOrange hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]' },
              { border: 'border-custom-gargoyleGas/30 hover:border-custom-gargoyleGas/80', shadow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]', text: 'text-custom-gargoyleGas', glow: 'bg-custom-gargoyleGas/20', ring: 'ring-custom-gargoyleGas/20 group-hover:ring-custom-gargoyleGas/60', hoverText: 'group-hover:text-custom-gargoyleGas', btnHover: 'hover:bg-custom-gargoyleGas hover:text-white hover:border-custom-gargoyleGas hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]' },
            ];
            const theme = themes[index % 3];

            return (
            <div
              key={project.id}
              className={`project-card glass rounded-2xl p-6 md:p-8 flex flex-col h-full relative group overflow-hidden transition-all duration-500 hover:-translate-y-3 cursor-pointer border ${theme.border} ${theme.shadow} bg-custom-richBlack/60 opacity-0`}
            >
              {/* Premium Glow Effect */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${theme.glow} rounded-bl-full -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-[2.5] blur-xl opacity-40 group-hover:opacity-100`}></div>

              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="p-3 bg-custom-richBlack/80 rounded-xl ring-1 ring-white/5 shadow-inner">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-heading font-bold text-xl ${theme.text}`}>
                    {project.title.charAt(0)}
                  </div>
                </div>
                <div className="flex space-x-3">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 text-gray-400 transition-all duration-300 px-3 py-1.5 rounded-lg bg-custom-richBlack/50 border border-white/10 hover:-translate-y-1 ${theme.btnHover}`} aria-label="GitHub Link">
                      <Github size={16} strokeWidth={2} />
                      <span className="text-xs font-semibold tracking-wide uppercase">Code</span>
                    </a>
                  )}
                  {project.demo && project.demo !== '#' && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 text-gray-400 transition-all duration-300 px-3 py-1.5 rounded-lg bg-custom-richBlack/50 border border-white/10 hover:-translate-y-1 ${theme.btnHover}`} aria-label="Live Demo Link">
                      <Globe size={16} strokeWidth={2} />
                      <span className="text-xs font-semibold tracking-wide uppercase">Live Demo</span>
                    </a>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-heading font-bold text-white mb-4 group-hover-text-gradient transition-all duration-300 relative z-10">
                {project.title}
              </h3>
              
              <p className="text-gray-400 text-base leading-relaxed mb-8 flex-grow relative z-10 font-light">
                {project.description}
              </p>

              <div className="mt-auto relative z-10 pt-4 border-t border-white/5">
                <ul className="flex flex-wrap gap-2.5 text-xs font-mono">
                  {project.tech.map((tech, i) => (
                    <li key={i} className={`px-3 py-1.5 rounded-md font-medium tracking-wide transition-colors bg-custom-richBlack/50 ${theme.text} border ${theme.border}`}>
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )})}
        </div>
        
        <div className="mt-12 text-center md:hidden project-card opacity-0">
          <Link to="/projects" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-custom-carrotOrange/10 text-custom-carrotOrange border border-custom-carrotOrange/30 font-semibold tracking-wide hover:bg-custom-carrotOrange hover:text-custom-richBlack transition-all duration-300">
            View All Projects 
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
