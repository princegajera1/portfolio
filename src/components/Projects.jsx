import { motion } from 'framer-motion';
import { ExternalLink, Github, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projects';

const Projects = () => {
  // Sort by featured first, then get top 6
  const displayProjects = [...projectsData]
    .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
    .slice(0, 6);

  return (
    <section id="projects" className="py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 flex items-center">
              <span className="text-accent-indigo mr-2">03.</span> Some Things I've Built
              <div className="hidden md:block h-[1px] bg-white/10 w-32 ml-6"></div>
            </h2>
            <p className="text-gray-400 max-w-2xl">
              A showcase of my top 6 recent projects. I've built various web applications and tools.
            </p>
          </div>
          
          <Link to="/projects" className="hidden md:flex items-center text-accent-indigo hover:text-white transition-colors group">
            View all projects
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
 
        {/* Top Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => {
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass rounded-2xl p-8 flex flex-col h-full relative group overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 border ${theme.border} ${theme.shadow}`}
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${theme.glow} rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150`}></div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`p-3 bg-white/5 rounded-xl ${theme.text} ring-1 ${theme.ring} transition-all`}>
                  {project.featured ? <Star size={28} fill="currentColor" strokeWidth={1.5} /> : <div className="w-7 h-7 border-2 border-current rounded opacity-50 flex items-center justify-center font-mono text-sm">P</div>}
                </div>
                <div className="flex space-x-4">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className={`text-gray-400 ${theme.hoverText} transition-colors`} aria-label="GitHub Link">
                    <Github size={22} strokeWidth={1.5} />
                  </a>
                  {project.demo && project.demo !== '#' && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className={`text-gray-400 ${theme.hoverText} transition-colors`} aria-label="External Link">
                      <ExternalLink size={22} strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>

              <h3 className={`text-2xl font-heading font-bold text-white mb-4 ${theme.hoverText} transition-colors relative z-10`}>
                {project.title}
              </h3>
              
              <p className="text-gray-400 text-base flex-grow mb-8 leading-relaxed relative z-10">
                {project.description}
              </p>

              <div className="mt-auto relative z-10">
                <ul className="flex flex-wrap gap-2 text-xs font-mono">
                  {project.tech.map((tech, i) => (
                    <li key={i} className={`px-3 py-1.5 rounded-md font-medium tracking-wide shadow-sm transition-all duration-300 ${theme.bg} ${theme.text} border ${theme.border}`}>
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/projects" className="relative px-8 py-4 rounded-xl border border-accent-indigo/30 text-white font-medium hover:bg-accent-indigo/10 hover:border-accent-indigo/60 transition-all duration-300 flex items-center gap-2 group shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <span className="relative z-10">View All Projects</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
