import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { Helmet } from 'react-helmet-async';

const ProjectsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-24 relative min-h-screen">
      <Helmet>
        <title>All Projects | Gajera Prince</title>
        <meta name="description" content="A complete list of all projects built by Gajera Prince." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-accent-indigo hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">
            All Projects
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            A comprehensive list of things I've built, ranging from small scripts to full-stack applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project, index) => {
            const themes = [
              { border: 'border-accent-cyan/15 hover:border-accent-cyan/60', shadow: 'hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]', text: 'text-accent-cyan', glow: 'bg-accent-cyan/10', ring: 'ring-white/10 group-hover:ring-accent-cyan/50', hoverText: 'group-hover:text-accent-cyan' },
              { border: 'border-accent-indigo/15 hover:border-accent-indigo/60', shadow: 'hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]', text: 'text-accent-indigo', glow: 'bg-accent-indigo/10', ring: 'ring-white/10 group-hover:ring-accent-indigo/50', hoverText: 'group-hover:text-accent-indigo' },
              { border: 'border-accent-purple/15 hover:border-accent-purple/60', shadow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]', text: 'text-accent-purple', glow: 'bg-accent-purple/10', ring: 'ring-white/10 group-hover:ring-accent-purple/50', hoverText: 'group-hover:text-accent-purple' },
              { border: 'border-pink-500/15 hover:border-pink-500/60', shadow: 'hover:shadow-[0_0_25px_rgba(244,114,182,0.25)]', text: 'text-pink-500', glow: 'bg-pink-500/10', ring: 'ring-white/10 group-hover:ring-pink-500/50', hoverText: 'group-hover:text-pink-500' },
            ];
            const theme = themes[index % 4];

            return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`glass rounded-xl p-6 flex flex-col h-full relative group overflow-hidden cursor-pointer transition-all duration-300 border ${theme.border} ${theme.shadow} ${
                project.featured ? 'bg-white/[0.07]' : ''
              }`}
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-24 h-24 ${theme.glow} rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-150`}></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-2 bg-white/5 rounded-lg ${theme.text} ring-1 ${theme.ring} transition-all`}>
                  {project.featured ? <Star size={24} fill="currentColor" strokeWidth={1.5} /> : <div className="w-6 h-6 border-2 border-current rounded opacity-50 flex items-center justify-center font-mono text-xs">P</div>}
                </div>
                <div className="flex space-x-3">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className={`text-gray-400 ${theme.hoverText} transition-colors`} aria-label="GitHub Link">
                      <Github size={20} strokeWidth={1.5} />
                    </a>
                  )}
                  {project.demo && project.demo !== '#' && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`text-gray-400 ${theme.hoverText} transition-colors`} aria-label="External Link">
                      <ExternalLink size={20} strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>

              <h3 className={`text-xl font-heading font-semibold text-gray-100 mb-3 ${theme.hoverText} transition-colors relative z-10`}>
                {project.title}
              </h3>
              
              <p className="text-gray-400 text-sm flex-grow mb-6 leading-relaxed relative z-10">
                {project.description}
              </p>

              <div className="mt-auto relative z-10">
                <ul className="flex flex-wrap gap-2 text-xs font-mono">
                  {project.tech.map((tech, i) => (
                    <li key={i} className={`px-2 py-1 rounded font-medium shadow-sm transition-all duration-300 ${theme.bg} ${theme.text} border ${theme.border}`}>
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
