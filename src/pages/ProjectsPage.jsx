import React, { useEffect } from 'react';
import { ExternalLink, Github, Star, ArrowLeft, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ProjectsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.page-header', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo('.project-card', 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="py-24 relative min-h-screen bg-custom-richBlack">
      <Helmet>
        <title>All Projects | Gajera Prince</title>
        <meta name="description" content="A complete list of all projects built by Gajera Prince." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-custom-carrotOrange hover:text-white transition-colors mb-8 group font-mono tracking-widest text-sm uppercase">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="mb-12 page-header opacity-0">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">
            All Projects
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg font-light">
            A comprehensive archive of things I've built, engineered with precision and focus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project, index) => {
            const themes = [
              { border: 'border-custom-midnightGreen/30 hover:border-custom-midnightGreen/80', shadow: 'hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]', text: 'text-custom-midnightGreen', glow: 'bg-custom-midnightGreen/20', ring: 'ring-custom-midnightGreen/20 group-hover:ring-custom-midnightGreen/60', hoverText: 'group-hover:text-custom-midnightGreen', btnHover: 'hover:bg-custom-midnightGreen hover:text-white hover:border-custom-midnightGreen hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]' },
              { border: 'border-custom-carrotOrange/30 hover:border-custom-carrotOrange/80', shadow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]', text: 'text-custom-carrotOrange', glow: 'bg-custom-carrotOrange/20', ring: 'ring-custom-carrotOrange/20 group-hover:ring-custom-carrotOrange/60', hoverText: 'group-hover:text-custom-carrotOrange', btnHover: 'hover:bg-custom-carrotOrange hover:text-white hover:border-custom-carrotOrange hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]' },
              { border: 'border-custom-gargoyleGas/30 hover:border-custom-gargoyleGas/80', shadow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]', text: 'text-custom-gargoyleGas', glow: 'bg-custom-gargoyleGas/20', ring: 'ring-custom-gargoyleGas/20 group-hover:ring-custom-gargoyleGas/60', hoverText: 'group-hover:text-custom-gargoyleGas', btnHover: 'hover:bg-custom-gargoyleGas hover:text-white hover:border-custom-gargoyleGas hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]' },
            ];
            const theme = themes[index % 3];

            return (
            <div
              key={project.id}
              className={`project-card glass rounded-xl p-6 flex flex-col h-full relative group overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-3 border ${theme.border} ${theme.shadow} ${
                project.featured ? 'bg-white/[0.05]' : 'bg-custom-richBlack/60'
              } opacity-0`}
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${theme.glow} rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-[2] blur-xl opacity-40 group-hover:opacity-100`}></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-2 bg-custom-richBlack/80 rounded-lg ${theme.text} ring-1 ${theme.ring} transition-all shadow-sm`}>
                  {project.featured ? <Star size={24} fill="currentColor" strokeWidth={1.5} /> : <div className="w-6 h-6 border-2 border-current rounded opacity-50 flex items-center justify-center font-mono text-xs">P</div>}
                </div>
                <div className="flex space-x-2">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 text-gray-400 transition-all duration-300 px-2 py-1 rounded-md bg-custom-richBlack/50 border border-white/10 hover:-translate-y-1 ${theme.btnHover}`} aria-label="GitHub Link">
                      <Github size={14} strokeWidth={2} />
                      <span className="text-xs font-semibold tracking-wide uppercase">Code</span>
                    </a>
                  )}
                  {project.demo && project.demo !== '#' && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 text-gray-400 transition-all duration-300 px-2 py-1 rounded-md bg-custom-richBlack/50 border border-white/10 hover:-translate-y-1 ${theme.btnHover}`} aria-label="Live Demo Link">
                      <Globe size={14} strokeWidth={2} />
                      <span className="text-xs font-semibold tracking-wide uppercase">Live Demo</span>
                    </a>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-heading font-bold text-gray-100 mb-3 group-hover-text-gradient transition-all duration-300 relative z-10">
                {project.title}
              </h3>
              
              <p className="text-gray-400 text-sm flex-grow mb-6 leading-relaxed relative z-10 font-light">
                {project.description}
              </p>

              <div className="mt-auto relative z-10">
                <ul className="flex flex-wrap gap-2 text-xs font-mono">
                  {project.tech.map((tech, i) => (
                    <li key={i} className={`px-2 py-1 rounded font-medium shadow-sm transition-all duration-300 bg-custom-richBlack/50 ${theme.text} border ${theme.border}`}>
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
