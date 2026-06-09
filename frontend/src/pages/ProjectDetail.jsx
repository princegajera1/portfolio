import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiExternalLink, FiGithub, FiCpu, FiAlertCircle, FiCheck, FiFolder } from 'react-icons/fi';
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

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects();
  const { trackPageView } = useAnalytics();

  // Scroll to top and track page view on slug change
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(`/project/${slug}`);
  }, [slug, trackPageView]);

  const project = useMemo(() => {
    return projects.find(p => p.slug === slug || slugify(p.title) === slug);
  }, [projects, slug]);

  const relatedProjects = useMemo(() => {
    if (!project) return [];
    return projects
      .filter(p => p.id !== project.id && (p.category === project.category || p.tech?.some(t => project.tech?.includes(t))))
      .slice(0, 3);
  }, [projects, project]);

  const getSlug = (item) => {
    return item.slug || slugify(item.title);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-bg-dark flex flex-col justify-center items-center p-6 text-center">
          <FiAlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <h2 className="text-2xl font-display font-black text-text-primary-dark mb-2">
            Project Not Found
          </h2>
          <p className="text-text-secondary-dark text-xs sm:text-sm font-sans mb-6">
            The project portfolio details you requested could not be resolved.
          </p>
          <Button variant="secondary" onClick={() => navigate('/projects')}>
            Back to Projects Portfolio
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.seoTitle || `${project.title} | Case Study`}</title>
        <meta name="description" content={project.description} />
      </Helmet>

      <Navbar />

      <main className="bg-bg-dark pt-28 pb-16 text-left relative overflow-hidden font-sans">
        
        {/* Background grids */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] z-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(#6C63FF 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-1/2 right-[10%] w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="max-w-5xl mx-auto px-6 sm:px-12 relative z-10 space-y-16">
          
          {/* Back Action */}
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors select-none"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>BACK TO PROJECTS GALLERY</span>
          </Link>

          {/* Hero Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-border-light dark:border-border-dark pb-12 relative">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3 select-none">
                <Badge variant="primary" size="sm" className="uppercase text-[9px] tracking-widest px-2 py-0.5">
                  {project.category || 'React Storefront'}
                </Badge>
                <span className="font-mono text-[9px] text-primary/60 tracking-wider">
                  // CASE_STUDY_ID: {slug?.toUpperCase()?.replace(/-/g, '_')}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
                {project.title}
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-base leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-wrap gap-3 select-none justify-start lg:justify-end">
              {project.githubUrl && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(project.githubUrl, '_blank')}
                  className="gap-2 hover:shadow-glow transition-all"
                >
                  <FiGithub className="w-4 h-4" />
                  <span>Repository</span>
                </Button>
              )}
              {project.liveUrl && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.open(project.liveUrl, '_blank')}
                  className="gap-2 hover:shadow-glow-secondary transition-all"
                >
                  <FiExternalLink className="w-4 h-4" />
                  <span>Live Storefront</span>
                </Button>
              )}
            </div>
          </div>

          {/* Pro Mockup Browser Frame */}
          <div className="relative border border-border-light dark:border-border-dark rounded-2xl overflow-hidden shadow-2xl bg-surface-light dark:bg-[#111118]/80 select-none group">
            {/* Browser Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark bg-muted-light dark:bg-muted-dark/40 font-mono text-[10px] text-text-secondary-light dark:text-text-secondary-dark">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60 animate-pulse" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-[9px] font-bold text-text-secondary-light dark:text-text-secondary-dark/70 tracking-wider">
                  PREVIEW://{project.title.toLowerCase().replace(/\s+/g, '-')}.local
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-[8px] bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5 font-bold">
                  COMPILED: OK
                </span>
                <span className="text-[9px] font-semibold text-text-secondary-light dark:text-text-secondary-dark/50">
                  RELIABILITY: 99.98%
                </span>
              </div>
            </div>
            
            <div className="aspect-video w-full overflow-hidden bg-bg-dark/50">
              <img
                src={project.image || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80"}
                alt={`${project.title} Mockup Preview`}
                className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out transform scale-100 group-hover:scale-[1.01]"
              />
            </div>
          </div>

          {/* Section 1: Case Study Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 border border-border-light dark:border-border-dark bg-white/5 dark:bg-[#111118]/40 hover:border-primary/20 transition-all duration-300 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-red-500/10 text-red-400">
                  <FiAlertCircle className="w-5 h-5" />
                </div>
                <h3 className="font-display font-extrabold text-base text-text-primary-light dark:text-text-primary-dark">
                  The Customer Challenge
                </h3>
              </div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm leading-relaxed select-text font-sans">
                {project.problem || 'No challenge description was provided. The project solves core layout lag and handles database state operations.'}
              </p>
            </Card>
            
            <Card className="p-6 border border-border-light dark:border-border-dark bg-white/5 dark:bg-[#111118]/40 hover:border-secondary/20 transition-all duration-300 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-secondary/10 text-secondary">
                  <FiCpu className="w-5 h-5" />
                </div>
                <h3 className="font-display font-extrabold text-base text-text-primary-light dark:text-text-primary-dark">
                  The Technical Solution
                </h3>
              </div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm leading-relaxed select-text font-sans">
                {project.solution || 'Built a clean React layout linked to Firestore serverless databases, using localized hooks and state-managed pagination.'}
              </p>
            </Card>
          </div>

          {/* Section 2: Technical Stack */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Technology Architecture
              </h3>
              <span className="font-mono text-[9px] text-text-secondary-dark">
                {project.tech?.length || 0} MODULES LOADED
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 select-none">
              {project.tech?.map((t) => (
                <Card key={t} className="p-4 border border-border-light dark:border-border-dark flex items-center gap-3 hover:border-primary/30 dark:hover:border-primary/40 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5 bg-white/5 dark:bg-[#111118]/30">
                  <div className="text-lg">
                    {getTechIcon(t)}
                  </div>
                  <span className="font-mono text-xs font-bold text-text-primary-light dark:text-text-primary-dark uppercase">
                    {t}
                  </span>
                </Card>
              ))}
            </div>
          </div>

          {/* Section 5: Key Learnings */}
          <div className="space-y-6 text-left border-t border-border-light dark:border-border-dark pt-12">
            <h3 className="font-display font-extrabold text-base text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Core Engineering Learnings
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                "Designing clean separation of concern patterns between state triggers and data calls.",
                "Writing granular database rules validations in Firestore to block unauthorized mutations.",
                "Optimizing assets using WebP formats and preloads, reducing initial loadings."
              ].map((learning, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-border-light/50 dark:border-border-dark/30 bg-white/5 dark:bg-black/5 font-sans relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary group-hover:bg-secondary transition-colors" />
                  <div className="p-1 rounded-md bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                    <FiCheck className="w-3.5 h-3.5 stroke-[3px]" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-mono text-[9px] text-text-secondary-dark tracking-wide uppercase">
                      SYSTEM_INTEGRATION_LOG // 0{idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark leading-snug">
                      {learning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="space-y-6 border-t border-border-light dark:border-border-dark pt-12">
              <h3 className="font-display font-extrabold text-base text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Related Work
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((p) => {
                  const pSlug = getSlug(p);
                  return (
                    <Link
                      key={p.title}
                      to={`/project/${pSlug}`}
                      className="block group"
                    >
                      <Card 
                        className="border border-border-light dark:border-border-dark hover:border-primary/30 dark:hover:border-primary/45 transition-all duration-300 bg-white/5 dark:bg-[#111118]/60 hover:shadow-glow backdrop-blur-sm relative overflow-hidden cursor-pointer h-44"
                        bodyClassName="p-5 flex flex-col justify-between h-full"
                      >
                        <div className="space-y-2 text-left">
                          <h4 className="font-display font-extrabold text-sm text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors truncate">
                            {p.title}
                          </h4>
                          <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark font-sans line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-border-light dark:border-border-dark pt-3 mt-4 text-[9px] font-mono">
                          <span className="text-primary font-bold uppercase">{p.category || 'React'}</span>
                          <span className="text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary font-semibold transition-colors">View Case Study →</span>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom CTA Block */}
          <div className="text-center py-6 select-none max-w-lg mx-auto space-y-4 border-t border-border-light dark:border-border-dark pt-12">
            <h3 className="font-display font-extrabold text-sm text-text-primary-light dark:text-text-primary-dark">
              Want to see this project in action?
            </h3>
            <div className="flex gap-4 justify-center">
              {project.githubUrl && (
                <Button
                  variant="secondary"
                  onClick={() => window.open(project.githubUrl, '_blank')}
                  className="gap-2"
                >
                  <FiGithub className="w-4 h-4" />
                  <span>GitHub</span>
                </Button>
              )}
              {project.liveUrl && (
                <Button
                  variant="primary"
                  onClick={() => window.open(project.liveUrl, '_blank')}
                  className="gap-2"
                >
                  <FiExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </Button>
              )}
            </div>
          </div>

        </div>
      </main>

      <ChatBot />
      <CommandPalette />

      <Footer />
    </>
  );
}
