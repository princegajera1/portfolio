import { useState, useEffect } from 'react';
import ParticleBackground from '../ParticleBackground';
import { getProjects } from '../../firebase/projects';
import { useScrollReveal } from '../../hooks/useGSAP';
import gsap from 'gsap';
import SlidePanel from '../SlidePanel';

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;
  
  // Case Study Slide Panel States
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSlideOpen, setIsSlideOpen] = useState(false);

  useScrollReveal('.scroll-reveal-projects');

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    window.addEventListener('projectsUpdated', fetchProjects);
    return () => {
      window.removeEventListener('projectsUpdated', fetchProjects);
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.project-card', 
        { opacity: 0, y: 40 },
        { 
          opacity: 1, y: 0,
          duration: 0.6, 
          stagger: 0.08, 
          ease: 'power3.out'
        }
      );
    });

    return () => ctx.revert();
  }, [loading, activeCategory, currentPage]);

  const categories = [
    { id: 'all', name: 'All Repos' },
    { id: 'fullstack', name: 'Fullstack' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'ai', name: 'AI / Python' }
  ];

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  const openCaseStudy = (project) => {
    setSelectedProject(project);
    setIsSlideOpen(true);
    if (window.gtag) {
      window.gtag('event', 'view_case_study', {
        'event_category': 'Engagement',
        'event_label': project.title
      });
    }
  };

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  return (
    <section id="projects" className="relative bg-dark overflow-hidden py-24 px-6">
      <ParticleBackground color="#E8FF00" density={50} />

      {/* Background glow highlights */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="scroll-reveal-projects mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 font-sans">
          <div>
            <span className="section-label block mb-2">// 02. work</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white">Featured Projects</h2>
          </div>

          {/* Stacks Tabs Filter */}
          <div className="flex flex-wrap gap-2 justify-center bg-[#111] p-1.5 border border-white/5 font-mono text-[10px] sm:text-xs select-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 transition-all duration-300 font-bold ${
                  activeCategory === cat.id 
                    ? 'bg-primary text-black' 
                    : 'text-gray-400 hover:text-white'
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
            <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
            Loading portfolio index...
          </div>
        ) : (
          /* Asymmetric Bento-Grid Layout wrapper */
          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProjects.map((project, idx) => {
              // Format project number
              const projectNumber = String(indexOfFirstProject + idx + 1).padStart(2, '0');
              const isFeatured = project.featured;

              if (isFeatured) {
                // Featured Project: Full width, horizontal visual bento block
                return (
                  <div 
                    key={project.id}
                    className="project-card col-span-1 md:col-span-2 lg:col-span-3 bg-[#111] border border-white/5 hover:border-primary/30 p-6 flex flex-col lg:flex-row gap-8 relative overflow-hidden group transition-all duration-500 min-h-[380px]"
                  >
                    {/* Large faded index number */}
                    <div className="absolute top-4 right-8 text-7xl sm:text-8xl md:text-9xl font-black font-mono text-primary/5 select-none pointer-events-none">
                      {projectNumber}
                    </div>

                    {/* Screenshot Mockup Container */}
                    <div className="w-full lg:w-1/2 aspect-video lg:aspect-auto lg:h-full min-h-[200px] overflow-hidden bg-[#161616] border border-white/5 relative">
                      <img 
                        src={project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-125 hover:grayscale-0"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent z-10" />
                      <span className="absolute top-4 left-4 z-20 bg-primary text-black font-mono text-[9px] uppercase font-bold tracking-widest px-3 py-1">
                        Featured Work
                      </span>
                    </div>

                    {/* Meta Detail block */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-between py-2">
                      <div className="space-y-4">
                        <h3 className="text-white text-xl sm:text-2xl font-black font-display group-hover:text-primary transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                          {project.description}
                        </p>

                        {project.libraries && (
                          <div className="text-[10px] font-mono text-primary flex items-center gap-1.5 select-text">
                            <span>📦 Libraries:</span>
                            <span className="text-gray-300 bg-[#161616] px-2 py-0.5 border border-white/5 font-bold">
                              {project.libraries}
                            </span>
                          </div>
                        )}

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 select-none">
                          {project.tech.map((tech, i) => (
                            <span key={i} className="bg-white/5 border border-white/5 text-[9px] sm:text-[10px] text-gray-400 font-mono px-2 py-0.5">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Launch Actions */}
                      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 border-t border-white/5 pt-6 font-mono text-xs select-none">
                        <button 
                          onClick={() => openCaseStudy(project)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-gray-300 hover:text-black font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <span>Case Study Details →</span>
                        </button>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
                          {(project.githubUrl || project.github) && (
                            <a 
                              href={project.githubUrl || project.github} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              Codebase
                            </a>
                          )}
                          {(project.liveUrl || project.live) && (
                            <a 
                              href={project.liveUrl || project.live} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline transition-all font-bold ml-auto"
                            >
                              Launch Product ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Standard Project: Bento column block (varying layouts)
              return (
                <div 
                  key={project.id}
                  className="project-card col-span-1 bg-[#111] border border-white/5 hover:border-primary/30 p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-500 min-h-[380px]"
                >
                  {/* Large faded index number */}
                  <div className="absolute top-4 right-6 text-7xl font-black font-mono text-primary/5 select-none pointer-events-none">
                    {projectNumber}
                  </div>

                  <div>
                    {/* Visual Cover Thumbnail */}
                    <div className="w-full aspect-video overflow-hidden bg-[#161616] border border-white/5 relative mb-6">
                      <img 
                        src={project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-125 hover:grayscale-0"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent z-10" />
                    </div>

                    <h3 className="text-white text-base sm:text-lg font-bold font-display group-hover:text-primary transition-colors duration-300 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {project.libraries && (
                      <div className="text-[10px] font-mono text-primary mb-4 flex items-center gap-1.5">
                        <span>📦 Libraries:</span>
                        <span className="text-gray-400 font-bold bg-[#161616] px-2 py-0.5 border border-white/5">
                          {project.libraries}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Tech tag list */}
                    <div className="flex flex-wrap gap-1.5 mb-5 select-none">
                      {project.tech.map((tech, i) => (
                        <span key={i} className="bg-white/5 border border-white/5 text-[9px] sm:text-[10px] text-gray-400 font-mono px-2 py-0.5">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Actions and slides */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 font-mono text-xs select-none">
                      <button 
                        onClick={() => openCaseStudy(project)}
                        className="text-gray-400 hover:text-primary transition-colors font-bold flex items-center gap-1 group/btn"
                      >
                        <span>Case Study</span>
                        <span className="transform translate-y-[1px] transition-transform group-hover/btn:translate-x-1">→</span>
                      </button>

                      <div className="flex items-center gap-3">
                        {(project.githubUrl || project.github) && (
                          <a 
                            href={project.githubUrl || project.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                          >
                            Code
                          </a>
                        )}
                        {(project.liveUrl || project.live) && (
                          <a 
                            href={project.liveUrl || project.live} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-bold"
                          >
                            Launch ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16 select-none font-mono">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 border border-white/10 bg-[#111] flex items-center justify-center text-gray-400 hover:text-white hover:border-primary disabled:opacity-30 transition-all duration-300 active:scale-95 text-sm"
              title="Previous Page"
            >
              &larr;
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-white/5">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`h-2.5 transition-all duration-500 ${
                    currentPage === idx + 1 
                      ? 'bg-primary w-6' 
                      : 'bg-white/20 w-2 hover:bg-white/40'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 border border-white/10 bg-[#111] flex items-center justify-center text-gray-400 hover:text-white hover:border-primary disabled:opacity-30 transition-all duration-300 active:scale-95 text-sm"
              title="Next Page"
            >
              &rarr;
            </button>
          </div>
        )}

      </div>

      {/* Case Study SlidePanel Drawer */}
      {selectedProject && (
        <SlidePanel 
          isOpen={isSlideOpen} 
          onClose={() => setIsSlideOpen(false)} 
          title={selectedProject.title}
        >
          <div className="space-y-6 font-sans text-gray-300 leading-relaxed text-sm">
            {/* Visual Thumbnail */}
            <div className="w-full aspect-video overflow-hidden rounded-none bg-surface border border-white/10">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-full object-cover filter grayscale contrast-125"
              />
            </div>

            <div>
              <h4 className="text-primary font-mono text-[10px] uppercase font-bold tracking-widest mb-1 select-none">Project Overview</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {selectedProject.problem && (
              <div>
                <h4 className="text-white font-mono text-[10px] uppercase font-bold tracking-widest mb-1 select-none">📋 The Engineering Challenge</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {selectedProject.problem}
                </p>
              </div>
            )}

            {selectedProject.solution && (
              <div>
                <h4 className="text-primary font-mono text-[10px] uppercase font-bold tracking-widest mb-1 select-none">⚡ Technical Solution</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {selectedProject.solution}
                </p>
              </div>
            )}

            {selectedProject.challenges && (
              <div>
                <h4 className="text-white font-mono text-[10px] uppercase font-bold tracking-widest mb-1 select-none">🛠️ Obstacles & Performance Engineering</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {selectedProject.challenges}
                </p>
              </div>
            )}

            {(selectedProject.results || selectedProject.businessImpact) && (
              <div>
                <h4 className="text-primary font-mono text-[10px] uppercase font-bold tracking-widest mb-1 select-none">📊 Business Impact & Results</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {selectedProject.results} {selectedProject.businessImpact}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-gray-500 font-mono text-[10px] uppercase font-bold tracking-widest mb-2 select-none">Stack Integration</h4>
              <div className="flex flex-wrap gap-1.5 select-none">
                {selectedProject.tech.map((tech, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/5 text-[9px] sm:text-[10px] text-gray-400 font-mono px-2.5 py-1">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch CTA buttons inside drawer */}
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/5 font-mono text-xs select-none">
              {(selectedProject.githubUrl || selectedProject.github) && (
                <a 
                  href={selectedProject.githubUrl || selectedProject.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white flex items-center gap-2 transition-all"
                >
                  Repository Code
                </a>
              )}
              {(selectedProject.liveUrl || selectedProject.live) && (
                <a 
                  href={selectedProject.liveUrl || selectedProject.live} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-primary hover:bg-white text-black font-bold transition-all ml-auto hover:shadow-lg hover:shadow-primary/20"
                >
                  Launch Product ↗
                </a>
              )}
            </div>
          </div>
        </SlidePanel>
      )}

    </section>
  );
}
