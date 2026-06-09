import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SiHtml5, SiCss3, SiJavascript, SiTypescript, 
  SiReact, SiRedux, SiTailwindcss, SiMui,
  SiNodedotjs, SiExpress, SiPython, SiFirebase, 
  SiMongodb, SiMysql, SiGit, SiGithub, 
  SiVercel, SiDocker, SiFigma, SiVisualstudiocode 
} from 'react-icons/si';
import { TbBrandFramer, TbApi, TbBrain, TbShieldLock, TbChartDots } from 'react-icons/tb';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'database', label: 'Database' },
    { id: 'tools', label: 'Tools' },
    { id: 'ai', label: 'AI' }
  ];

  const skills = [
    // FRONTEND
    { name: 'HTML5', level: 'Proficient', pct: 90, icon: SiHtml5, color: '#E34F26', category: 'frontend' },
    { name: 'CSS3', level: 'Proficient', pct: 90, icon: SiCss3, color: '#1572B6', category: 'frontend' },
    { name: 'JavaScript', level: 'Proficient', pct: 90, icon: SiJavascript, color: '#F7DF1E', category: 'frontend' },
    { name: 'TypeScript', level: 'Comfortable', pct: 70, icon: SiTypescript, color: '#3178C6', category: 'frontend' },
    { name: 'React.js', level: 'Proficient', pct: 90, icon: SiReact, color: '#61DAFB', category: 'frontend' },
    { name: 'Redux Toolkit', level: 'Learning', pct: 45, icon: SiRedux, color: '#764ABC', category: 'frontend' },
    { name: 'Tailwind CSS', level: 'Proficient', pct: 90, icon: SiTailwindcss, color: '#06B6D4', category: 'frontend' },
    { name: 'Framer Motion', level: 'Comfortable', pct: 70, icon: TbBrandFramer, color: '#0055FF', category: 'frontend' },
    { name: 'GSAP', level: 'Comfortable', pct: 70, icon: 'GSAP', color: '#88CE02', category: 'frontend' },
    { name: 'Material UI', level: 'Comfortable', pct: 70, icon: SiMui, color: '#007FFF', category: 'frontend' },

    // BACKEND
    { name: 'Node.js', level: 'Learning', pct: 45, icon: SiNodedotjs, color: '#339933', category: 'backend' },
    { name: 'Express.js', level: 'Learning', pct: 45, icon: SiExpress, color: '#FFFFFF', category: 'backend' },
    { name: 'REST APIs', level: 'Comfortable', pct: 70, icon: TbApi, color: '#CCFF00', category: 'backend' },
    { name: 'Python', level: 'Learning', pct: 45, icon: SiPython, color: '#3776AB', category: 'backend' },

    // DATABASE & CLOUD
    { name: 'Firebase', level: 'Proficient', pct: 90, icon: SiFirebase, color: '#FFCA28', category: 'database' },
    { name: 'MongoDB', level: 'Learning', pct: 45, icon: SiMongodb, color: '#47A248', category: 'database' },
    { name: 'SQL', level: 'Learning', pct: 45, icon: SiMysql, color: '#4479A1', category: 'database' },

    // TOOLS & DEPLOYMENT
    { name: 'Git', level: 'Comfortable', pct: 70, icon: SiGit, color: '#F05032', category: 'tools' },
    { name: 'GitHub', level: 'Comfortable', pct: 70, icon: SiGithub, color: '#FFFFFF', category: 'tools' },
    { name: 'Vercel', level: 'Comfortable', pct: 70, icon: SiVercel, color: '#FFFFFF', category: 'tools' },
    { name: 'Docker', level: 'Learning', pct: 45, icon: SiDocker, color: '#2496ED', category: 'tools' },
    { name: 'Figma', level: 'Learning', pct: 45, icon: SiFigma, color: '#F24E1E', category: 'tools' },
    { name: 'VS Code', level: 'Proficient', pct: 90, icon: SiVisualstudiocode, color: '#007ACC', category: 'tools' },

    // AI & EMERGING
    { name: 'Generative AI', level: 'Comfortable', pct: 70, icon: TbBrain, color: '#CCFF00', category: 'ai' },
    { name: 'Web Crypto API', level: 'Learning', pct: 45, icon: TbShieldLock, color: '#00FFFF', category: 'ai' },
    { name: 'Machine Learning', level: 'Learning', pct: 45, icon: TbChartDots, color: '#FF6B6B', category: 'ai' }
  ];

  const filteredSkills = activeTab === 'all' 
    ? skills 
    : skills.filter(s => s.category === activeTab);

  const PAGE_SIZE = 8;
  const totalPages = Math.ceil(filteredSkills.length / PAGE_SIZE);

  // Reset pagination state when filtering tab changes
  useEffect(() => {
    setCurrentPage(0);
    setDirection(0);
  }, [activeTab]);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
    }
  };

  const paginatedSkills = filteredSkills.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const getBadgeClass = (level) => {
    if (level === 'Proficient') return 'bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]/20';
    if (level === 'Comfortable') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    return 'bg-white/5 text-gray-400 border-white/5';
  };

  // Slide transitions for pages
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : dir < 0 ? -100 : 0,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: 'easeOut' }
    },
    exit: (dir) => ({
      x: dir < 0 ? 100 : dir > 0 ? -100 : 0,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeIn' }
    })
  };

  return (
    <section id="skills" className="py-24 bg-[#0A0A0F]/90 border-t border-border-dark select-none relative overflow-hidden">
      
      {/* Visual cyber glow decoration */}
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-[#CCFF00]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 select-none text-left"
        >
          <div className="space-y-2">
            <span className="section-label text-[#CCFF00] font-mono tracking-[0.2em] font-bold">// 03. STACK</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary-dark tracking-tight">
              Skills &amp; Technology
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1 bg-[#111118]/80 border border-border-dark p-1.5 rounded-xl backdrop-blur-md relative">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-black z-10'
                    : 'text-text-secondary-dark hover:text-white'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeSkillTab"
                    className="absolute inset-0 bg-[#CCFF00] rounded-lg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-20">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Skills Slider Wrapper with dynamic container size */}
        <div className="relative overflow-hidden min-h-[350px] md:min-h-[340px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${activeTab}_page_${currentPage}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {paginatedSkills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div key={skill.name}>
                    <Card
                      hoverGlow
                      className="p-6 border border-border-dark bg-[#111118]/40 backdrop-blur-xl group text-left flex flex-col justify-between h-40 rounded-2xl transition-all duration-300 hover:border-[#CCFF00]/30 shadow-lg"
                    >
                      {/* Icon + Level Row */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="transition-transform duration-300 group-hover:scale-110">
                          {typeof Icon === 'string' ? (
                            <span className="font-mono font-black text-lg tracking-tight select-none" style={{ color: skill.color }}>
                              {Icon}
                            </span>
                          ) : (
                            <Icon 
                              className="w-8 h-8" 
                              style={{ color: skill.color }} 
                            />
                          )}
                        </div>
                        <Badge className={`border px-2.5 py-0.5 text-[9px] uppercase font-mono font-bold ${getBadgeClass(skill.level)}`}>
                          {skill.level}
                        </Badge>
                      </div>

                      {/* Skill Name & Info */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <div className="font-display font-extrabold text-sm sm:text-base text-text-primary-dark">
                            {skill.name}
                          </div>
                          <span className="font-mono text-[9px] text-text-secondary-dark uppercase tracking-wider">
                            {skill.category}
                          </span>
                        </div>

                        {/* Animated Progress Bar */}
                        <div className="mt-3.5 h-1.5 w-full bg-[#1A1A24] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-primary to-[#CCFF00] rounded-full"
                          />
                        </div>
                      </div>

                    </Card>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-center gap-4 mt-12 select-none">
            <div className="flex items-center gap-6">
              <button 
                onClick={handlePrev} 
                disabled={currentPage === 0}
                className="w-10 h-10 rounded-xl bg-[#111118]/80 border border-border-dark/60 flex items-center justify-center text-text-secondary-dark hover:text-[#CCFF00] hover:border-[#CCFF00]/40 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                title="Previous Page"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>

              {/* Glowing Paginate Dots */}
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentPage ? 1 : -1);
                      setCurrentPage(idx);
                    }}
                    className={`transition-all duration-300 ${
                      currentPage === idx 
                        ? 'w-6 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]' 
                        : 'w-2 h-2 rounded-full bg-white/10 hover:bg-white/30'
                    }`}
                    title={`Page ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={handleNext} 
                disabled={currentPage === totalPages - 1}
                className="w-10 h-10 rounded-xl bg-[#111118]/80 border border-border-dark/60 flex items-center justify-center text-text-secondary-dark hover:text-[#CCFF00] hover:border-[#CCFF00]/40 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                title="Next Page"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-[8px] font-mono text-text-secondary-dark uppercase tracking-widest mt-1">
              Showing {currentPage * PAGE_SIZE + 1} - {Math.min((currentPage + 1) * PAGE_SIZE, filteredSkills.length)} of {filteredSkills.length} Core Skills
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
