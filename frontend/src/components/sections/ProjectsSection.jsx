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
        { opacity: 0, scale: 0.9, y: 30 },
        { 
          opacity: 1, scale: 1, y: 0,
          duration: 0.6, 
          stagger: 0.06, 
          ease: 'back.out(1.2)'
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
    <section id="projects" className="relative bg-dark overflow-hidden py-16 sm:py-20 px-6">
      <ParticleBackground color="#6C63FF" density={90} />

      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="scroll-reveal-projects mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 font-sans">
          <div>
            <p className="text-secondary font-mono text-xs uppercase tracking-[0.25em] mb-2 select-none">&lt; Repositories & Products /&gt;</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white">Featured Work</h2>
          </div>

          {/* Stacks Tabs Filter */}
          <div className="flex flex-wrap gap-2 justify-center bg-[#13132a] p-1.5 rounded-xl border border-white/5 font-mono text-[10px] sm:text-xs select-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
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
            <div className="w-8 h-8 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
            Loading portfolio index...
          </div>
        ) : (
          /* Cards Grid */
          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProjects.map((project) => (
              <div 
                key={project.id}
                className="project-card bg-[#13132a]/30 border border-white/5 overflow-hidden rounded-2xl hover:border-secondary/45 hover:shadow-[0_0_20px_rgba(0,212,255,0.04)] transition-all duration-500 flex flex-col h-full group"
              >
                {/* Visual Cover Thumbnail */}
                <div className="h-44 sm:h-48 overflow-hidden relative bg-surface select-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent z-10" />
                  <img 
                    src={project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {project.featured && (
                    <span className="absolute top-4 right-4 z-20 bg-accent text-white font-mono text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(255,107,157,0.4)]">
                      Featured
                    </span>
                  )}
                </div>

                {/* Card description details */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 font-sans">
                  <h3 className="text-white text-base sm:text-lg font-bold font-display group-hover:text-secondary transition-colors duration-300 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4 flex-1 line-clamp-2 sm:line-clamp-3">
                    {project.description}
                  </p>

                  {/* Render dynamic sub-libraries if they exist */}
                  {project.libraries && (
                    <div className="text-[10px] font-mono text-secondary mb-4 flex items-center gap-1.5 select-text">
                      <span>📦 Libraries:</span>
                      <span className="text-gray-400 font-bold bg-[#0d0d1a] px-2 py-0.5 rounded border border-white/5">
                        {project.libraries}
                      </span>
                    </div>
                  )}

                  {/* Technology badging tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5 select-none">
                    {project.tech.map((tech, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/5 text-[9px] sm:text-[10px] text-gray-400 font-mono px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Case Study Access Trigger */}
                  <button 
                    onClick={() => openCaseStudy(project)}
                    className="mb-4 py-2 border border-[#7C6FFF]/25 hover:border-secondary text-gray-400 hover:text-white rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-300 w-full bg-[#13132a]/30 active:scale-95 flex items-center justify-center gap-2 select-none hover:shadow-[0_0_15px_rgba(0,229,255,0.06)]"
                  >
                    <span>📋 View Case Study & Impact</span>
                  </button>

                  {/* External Launch Links */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5 font-mono text-xs select-none">
                    {(project.githubUrl || project.github) && (
                      <a 
                        href={project.githubUrl || project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors group/link"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        Code
                      </a>
                    )}
                    {project.documentationUrl && (
                      <a 
                        href={project.documentationUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-accent hover:underline transition-all"
                        title="Documentation / Paper Link"
                      >
                        📄 Doc
                      </a>
                    )}
                    {project.videoUrl && (
                      <a 
                        href={project.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#FF8500] hover:underline transition-all"
                        title="Video Demonstration Link"
                      >
                        🎥 Demo
                      </a>
                    )}
                    {(project.liveUrl || project.live) && (
                      <a 
                        href={project.liveUrl || project.live} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-secondary hover:underline transition-all group/link ml-auto"
                      >
                        Launch
                        <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12 select-none font-mono">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl border border-white/5 bg-[#13132a]/65 flex items-center justify-center text-gray-400 hover:text-white hover:border-secondary/40 disabled:opacity-30 disabled:hover:border-white/5 transition-all duration-300 active:scale-95 text-sm"
              title="Previous Page"
            >
              &larr;
            </button>
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[#13132a]/40 border border-white/5 rounded-xl">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    currentPage === idx + 1 
                      ? 'bg-secondary w-7 shadow-[0_0_10px_#00e5ff]' 
                      : 'bg-white/20 w-2.5 hover:bg-white/40'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-xl border border-white/5 bg-[#13132a]/65 flex items-center justify-center text-gray-400 hover:text-white hover:border-secondary/40 disabled:opacity-30 disabled:hover:border-white/5 transition-all duration-300 active:scale-95 text-sm"
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
            {/* Display Visual Thumbnail */}
            <div className="w-full h-44 sm:h-48 overflow-hidden rounded-xl bg-surface border border-white/5">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="text-secondary font-mono text-[10px] uppercase font-bold tracking-widest mb-1 select-none">Project Overview</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {selectedProject.problem && (
              <div>
                <h4 className="text-accent font-mono text-[10px] uppercase font-bold tracking-widest mb-1 select-none">📋 The Engineering Challenge</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {selectedProject.problem}
                </p>
              </div>
            )}

            {selectedProject.solution && (
              <div>
                <h4 className="text-success font-mono text-[10px] uppercase font-bold tracking-widest mb-1 select-none">⚡ Technical Solution</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {selectedProject.solution}
                </p>
              </div>
            )}

            {selectedProject.challenges && (
              <div>
                <h4 className="text-primary font-mono text-[10px] uppercase font-bold tracking-widest mb-1 select-none">🛠️ Obstacles & Performance Engineering</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {selectedProject.challenges}
                </p>
              </div>
            )}

            {(selectedProject.results || selectedProject.businessImpact) && (
              <div>
                <h4 className="text-secondary font-mono text-[10px] uppercase font-bold tracking-widest mb-1 select-none">📊 Business Impact & Results</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {selectedProject.results} {selectedProject.businessImpact}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-[#a0aec0] font-mono text-[10px] uppercase font-bold tracking-widest mb-2 select-none">Stack Integration</h4>
              <div className="flex flex-wrap gap-1.5 select-none">
                {selectedProject.tech.map((tech, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/5 text-[9px] sm:text-[10px] text-gray-400 font-mono px-2.5 py-1 rounded-lg">
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
                  className="px-4 py-2.5 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl text-gray-300 hover:text-white flex items-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  Repository Code
                </a>
              )}
              {(selectedProject.liveUrl || selectedProject.live) && (
                <a 
                  href={selectedProject.liveUrl || selectedProject.live} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-primary hover:bg-[#6c5eff] rounded-xl text-white flex items-center gap-1.5 transition-all ml-auto hover:shadow-lg hover:shadow-primary/20"
                >
                  Launch Product
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </SlidePanel>
      )}

    </section>
  );
}
