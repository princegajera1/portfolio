import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowRight, FiExternalLink, FiGithub, FiFolder,
  FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';
import { 
  SiReact, SiFirebase, SiTailwindcss, SiRedux, 
  SiNodedotjs, SiMongodb, SiOpenai, SiJavascript, SiTypescript 
} from 'react-icons/si';
import useProjects from '../../hooks/useProjects';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import slugify from '../../utils/slugify';

export default function ProjectsSection() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const { projects, loading, error } = useProjects();
  const itemsPerPage = 3;

  const filterTabs = [
    { id: 'all', label: 'All Repos' },
    { id: 'fullstack', label: 'Fullstack' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'ai', label: 'AI / Python' }
  ];

  const getTechIcon = (techName) => {
    const name = techName.toLowerCase();
    if (name.includes('react')) return <SiReact className="text-sky-400" title="React" />;
    if (name.includes('firebase') || name.includes('firestore')) return <SiFirebase className="text-amber-500" title="Firebase" />;
    if (name.includes('tailwind')) return <SiTailwindcss className="text-teal-400" title="Tailwind CSS" />;
    if (name.includes('redux')) return <SiRedux className="text-purple-500" title="Redux Toolkit" />;
    if (name.includes('node')) return <SiNodedotjs className="text-emerald-500" title="Node.js" />;
    if (name.includes('mongo')) return <SiMongodb className="text-green-500" title="MongoDB" />;
    if (name.includes('openai') || name.includes('ai') || name.includes('gpt')) return <SiOpenai className="text-text-primary-dark" title="OpenAI API" />;
    if (name.includes('typescript') || name.includes('ts')) return <SiTypescript className="text-blue-500" title="TypeScript" />;
    if (name.includes('javascript') || name.includes('js')) return <SiJavascript className="text-yellow-400" title="JavaScript" />;
    return <FiFolder className="text-text-secondary-dark" title={techName} />;
  };

  const getSlug = (project) => {
    return project.slug || slugify(project.title);
  };

  // Filter projects dynamically
  const filteredProjects = projects.filter(p => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'frontend') {
      return p.category === 'frontend' || p.tech?.some(t => ['react', 'tailwind', 'html', 'css', 'javascript', 'typescript'].includes(t.toLowerCase()));
    }
    if (activeFilter === 'fullstack') {
      return p.category === 'fullstack';
    }
    if (activeFilter === 'ai') {
      return p.category === 'ai' || p.category === 'tools' || p.tech?.some(t => ['python', 'openai', 'ai', 'fabric.js'].includes(t.toLowerCase()));
    }
    return true;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setCurrentPage(0);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const visibleProjects = filteredProjects.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <section id="projects" className="py-24 bg-bg-light dark:bg-bg-dark border-t border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 select-none text-left">
          <div className="space-y-2">
            <span className="section-label">// 02. WORK</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight font-display">
              Featured Projects
            </h2>
          </div>

          {/* Sticky filter bar */}
          <div className="flex flex-wrap gap-2 bg-white/5 border border-border-light dark:border-border-dark p-1.5 rounded-xl backdrop-blur-md">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeFilter === tab.id
                    ? 'bg-[#E8FF00] text-black shadow font-black'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && <Spinner size="lg" />}
        {error && (
          <div className="py-12 text-center text-red-400 font-mono text-sm">
            Error loading projects: {error}
          </div>
        )}

        {/* Projects Carousel */}
        {!loading && !error && (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPage}-${activeFilter}`}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
              >
                {visibleProjects.map((project) => {
                  const projectSlug = getSlug(project);
                  
                  return (
                    <div
                      key={project.id || project.title}
                      className="col-span-1"
                    >
                      <Card
                        hoverGlow
                        glowColor="secondary"
                        className="h-full flex flex-col justify-between group overflow-hidden border border-border-light dark:border-border-dark p-0 relative min-h-[440px]"
                      >
                        {/* Image container */}
                        <div className="block h-48 w-full overflow-hidden relative">
                          <img
                            src={project.image || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"}
                            alt={project.title}
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 contrast-110 brightness-95 group-hover:scale-102 transition-all duration-700"
                          />
                          {/* Hover detail overlay */}
                          <div 
                            onClick={() => navigate(`/project/${projectSlug}`)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm z-10 cursor-pointer"
                          >
                            <span className="px-4 py-2 border border-[#E8FF00] text-[#E8FF00] font-mono text-xs uppercase tracking-wider font-bold rounded-lg shadow-lg">
                              View Case Study
                            </span>
                          </div>

                          {/* Category Badge overlay */}
                          <div className="absolute top-4 left-4 z-10">
                            <Badge variant="primary" size="sm" className="bg-black/60 backdrop-blur-md uppercase text-[9px]">
                              {project.category || 'React'}
                            </Badge>
                          </div>
                        </div>

                        {/* Text info block */}
                        <div className="p-6 flex flex-col justify-between flex-1 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark">
                          <div className="space-y-3">
                            <h3 className="font-display font-black text-lg text-text-primary-light dark:text-text-primary-dark group-hover:text-[#E8FF00] transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-sans line-clamp-3 leading-relaxed">
                              {project.description}
                            </p>
                          </div>

                          {/* Footer row: Tech Icons + Action Buttons */}
                          <div className="flex items-center justify-between border-t border-border-light dark:border-border-dark pt-4 mt-6">
                            
                            {/* Tech Stack Icons */}
                            <div className="flex items-center gap-2">
                              {project.tech?.slice(0, 4).map((t, tIdx) => (
                                <div key={tIdx} className="w-5 h-5 flex items-center justify-center text-xs">
                                  {getTechIcon(t)}
                                </div>
                              ))}
                              {project.tech?.length > 4 && (
                                <span className="text-[10px] font-mono text-text-secondary-dark font-semibold">
                                  +{project.tech.length - 4}
                                </span>
                              )}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-2 select-none">
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 border border-border-light dark:border-border-dark hover:border-[#E8FF00]/40 text-text-secondary-light dark:text-text-secondary-dark hover:text-[#E8FF00] rounded-lg transition-colors bg-white/5"
                                  title="View Code on GitHub"
                                >
                                  <FiGithub className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 border border-border-light dark:border-border-dark hover:border-[#E8FF00]/40 text-text-secondary-light dark:text-text-secondary-dark hover:text-[#E8FF00] rounded-lg transition-colors bg-white/5"
                                  title="View Live Demo"
                                >
                                  <FiExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>

                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Slider Pagination controls matching screenshot */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 select-none">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="p-2.5 border border-border-light dark:border-border-dark hover:border-[#E8FF00]/40 rounded-xl text-text-secondary-light dark:text-text-secondary-dark hover:text-[#E8FF00] transition-all bg-white/5 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Previous Page"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      className={`h-2 rounded transition-all duration-300 ${
                        currentPage === idx
                          ? 'w-6 bg-[#E8FF00] shadow-[0_0_8px_#E8FF00]'
                          : 'w-2 bg-text-secondary-dark/30 hover:bg-text-secondary-dark/60'
                      }`}
                      aria-label={`Go to page ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className="p-2.5 border border-border-light dark:border-border-dark hover:border-[#E8FF00]/40 rounded-xl text-text-secondary-light dark:text-text-secondary-dark hover:text-[#E8FF00] transition-all bg-white/5 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Next Page"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* View All Projects CTA */}
        <div className="text-center mt-12 select-none">
          <Button
            variant="secondary"
            onClick={() => navigate('/projects')}
            className="gap-2 group"
          >
            <span>View All Projects</span>
            <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

      </div>
    </section>
  );
}
