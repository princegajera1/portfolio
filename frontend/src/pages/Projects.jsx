import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiExternalLink, FiGithub, FiFolder, FiChevronDown, FiAlertCircle } from 'react-icons/fi';
import { 
  SiReact, SiFirebase, SiTailwindcss, SiRedux, 
  SiNodedotjs, SiMongodb, SiOpenai, SiJavascript, SiTypescript 
} from 'react-icons/si';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChatBot from '../components/ChatBot/ChatBot';
import CommandPalette from '../components/CommandPalette/CommandPalette';
import useProjects from '../hooks/useProjects';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import slugify from '../utils/slugify';
import useAnalytics from '../hooks/useAnalytics';

export default function Projects() {
  const { projects, loading, error } = useProjects();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'featured'
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/projects');
  }, [trackPageView]);

  const filterTabs = [
    { id: 'all', label: 'All Projects' },
    { id: 'react', label: 'React' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'firebase', label: 'Firebase' },
    { id: 'ai', label: 'AI SaaS' }
  ];

  const getTechIcon = (techName) => {
    const name = techName.toLowerCase();
    if (name.includes('react')) return <SiReact className="text-sky-400" title="React" />;
    if (name.includes('firebase') || name.includes('firestore')) return <SiFirebase className="text-amber-500" title="Firebase" />;
    if (name.includes('tailwind')) return <SiTailwindcss className="text-teal-400" title="Tailwind CSS" />;
    if (name.includes('redux')) return <SiRedux className="text-purple-500" title="Redux" />;
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

  // Perform search, filter, and sort
  const processedProjects = useMemo(() => {
    let list = [...projects];

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech?.some(t => t.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'react') {
        list = list.filter(p => p.tech?.some(t => t.toLowerCase().includes('react')) || p.category === 'frontend');
      } else if (activeFilter === 'fullstack') {
        list = list.filter(p => p.category === 'fullstack');
      } else if (activeFilter === 'firebase') {
        list = list.filter(p => p.tech?.some(t => t.toLowerCase().includes('firebase')) || p.category === 'firebase');
      } else if (activeFilter === 'ai') {
        list = list.filter(p => p.category === 'ai' || p.tech?.some(t => t.toLowerCase().includes('openai')));
      }
    }

    // 3. Sorting Options
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'featured') {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [projects, search, activeFilter, sortBy]);

  const displayedProjects = processedProjects.slice(0, visibleCount);

  return (
    <>
      <Helmet>
        <title>Projects Portfolio | Prince Gajera Storefront Showcase</title>
        <meta name="description" content="Explore e-commerce storefronts, invoice ledger dashboards, real-time chatbots, and custom developer tools shipped by Prince Gajera." />
      </Helmet>

      <Navbar />

      <main className="bg-bg-dark pt-32 pb-16 text-left relative overflow-hidden font-sans">
        
        {/* Background grids */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(#6C63FF 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 space-y-12">
          
          {/* Page Header */}
          <div className="space-y-4 text-center max-w-xl mx-auto">
            <span className="section-label block">// THE STOREFRONT</span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Projects Shipped
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm leading-relaxed">
              Explore dynamic e-commerce, cloud databases, ledger logs, and OpenAI-backed conversational assistant tools.
            </p>
          </div>

          {/* Sticky-like Control Bar: Search + Filter + Sort */}
          <Card className="border border-border-light dark:border-border-dark bg-white/50 dark:bg-[#111118]/50 backdrop-blur-xl rounded-xl z-20" bodyClassName="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80 flex items-center border border-border-light dark:border-border-dark focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary rounded-lg px-3 bg-white/5 h-10 transition-all">
              <FiSearch className="w-4 h-4 text-text-secondary-dark mr-2" />
              <input
                type="text"
                placeholder="Search projects by name or technology..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(6);
                }}
                className="flex-1 bg-transparent border-none outline-none text-xs text-text-primary-dark placeholder-text-secondary-dark font-mono"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1 bg-white/5 border border-border-light dark:border-border-dark p-1 rounded-lg">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setVisibleCount(6);
                  }}
                  className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded transition-all ${
                    activeFilter === tab.id
                      ? 'bg-primary text-black shadow'
                      : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary-dark font-bold">
                Sort By
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none h-10 pl-3 pr-8 bg-white/5 border border-border-light dark:border-border-dark focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider text-text-primary-dark outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="featured">Featured First</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary-dark pointer-events-none" />
              </div>
            </div>

          </Card>

          {/* Loading / Error States */}
          {loading && <Spinner size="lg" />}
          {error && (
            <div className="py-24 text-center text-red-400 font-mono text-sm flex items-center justify-center gap-2">
              <FiAlertCircle className="w-5 h-5" />
              <span>Failed to fetch projects: {error}</span>
            </div>
          )}

          {/* Projects Gallery Grid */}
          {!loading && !error && (
            <div className="space-y-12">
              {displayedProjects.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {displayedProjects.map((project) => {
                      const projectSlug = getSlug(project);
                      return (
                        <motion.div
                          key={project.id || project.title}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col justify-between"
                        >
                          <Card
                            hoverGlow
                            glowColor="secondary"
                            className="border border-border-light dark:border-border-dark group overflow-hidden relative h-full"
                            bodyClassName="p-0 h-full flex flex-col justify-between"
                          >
                            {/* Card Image */}
                            <div className="relative h-48 overflow-hidden select-none">
                              <img
                                src={project.image || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"}
                                alt={project.title}
                                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 contrast-110 brightness-95 group-hover:scale-102 transition-all duration-700"
                              />
                              <div
                                onClick={() => navigate(`/project/${projectSlug}`)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm z-10 cursor-pointer"
                              >
                                <span className="px-4 py-2 border border-primary text-primary font-mono text-xs uppercase tracking-wider font-bold rounded-lg shadow-lg">
                                  View Details
                                </span>
                              </div>
                              <div className="absolute top-4 left-4 z-10">
                                <Badge variant="primary" size="sm" className="bg-black/60 backdrop-blur-md uppercase text-[9px]">
                                  {project.category || 'React'}
                                </Badge>
                              </div>
                            </div>

                            {/* Card Details */}
                            <div className="p-6 flex flex-col justify-between h-52">
                              <div className="space-y-2.5">
                                <h3 className="font-display font-black text-base sm:text-lg text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors">
                                  {project.title}
                                </h3>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-sans line-clamp-2 leading-relaxed">
                                  {project.description}
                                </p>
                              </div>

                              {/* Footer details row */}
                              <div className="flex items-center justify-between border-t border-border-light dark:border-border-dark pt-3.5 mt-5">
                                
                                {/* Tech Icons */}
                                <div className="flex items-center gap-1.5 select-none">
                                  {project.tech?.slice(0, 4).map((t, tIdx) => (
                                    <div key={tIdx} className="w-4.5 h-4.5 flex items-center justify-center text-xs">
                                      {getTechIcon(t)}
                                    </div>
                                  ))}
                                  {project.tech?.length > 4 && (
                                    <span className="text-[9px] font-mono text-text-secondary-dark font-semibold">
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
                                      className="p-1.5 border border-border-light dark:border-border-dark hover:border-primary/40 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary rounded-lg transition-colors bg-white/5"
                                      title="GitHub Repository"
                                    >
                                      <FiGithub className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                  {project.liveUrl && (
                                    <a
                                      href={project.liveUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 border border-border-light dark:border-border-dark hover:border-primary/40 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary rounded-lg transition-colors bg-white/5"
                                      title="Live Demo"
                                    >
                                      <FiExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>

                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="py-24 text-center select-none font-mono text-xs text-text-secondary-dark flex flex-col items-center justify-center gap-2">
                  <FiAlertCircle className="w-6 h-6 text-text-secondary-dark" />
                  <span>No projects match your current filters. Try resetting search parameters.</span>
                </div>
              )}

              {/* Load More Pagination */}
              {processedProjects.length > visibleCount && (
                <div className="text-center pt-6 select-none">
                  <Button
                    variant="secondary"
                    onClick={() => setVisibleCount(prev => prev + 6)}
                  >
                    Load More Projects
                  </Button>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <ChatBot />
      <CommandPalette />

      <Footer />
    </>
  );
}
