import { motion } from 'framer-motion';
import { FiBookOpen, FiCpu, FiAward, FiMapPin, FiActivity, FiTerminal } from 'react-icons/fi';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function EducationSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <section id="education" className="py-24 bg-[#0A0A0F]/90 border-t border-border-dark relative overflow-hidden select-none">
      
      {/* Visual cyber glow decoration */}
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#CCFF00]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-16 text-center select-none">
          <p className="text-[#CCFF00] font-mono text-xs uppercase tracking-[0.25em] mb-2">&lt; EDUCATION /&gt;</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-text-primary-dark tracking-tight">
            Academic History
          </h2>
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-[#CCFF00] mx-auto mt-4 rounded-full" />
        </div>

        {/* Timeline Grid Wrapper */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="space-y-6"
        >
          {/* BE Main Card (Full Width) */}
          <motion.div variants={cardVariants}>
            <Card className="bg-[#111118]/60 backdrop-blur-xl border-l-4 border-l-[#CCFF00] border-y-border-dark border-r-border-dark hover:border-r-[#CCFF00]/30 hover:border-y-[#CCFF00]/30 transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative group overflow-hidden">
              
              {/* Decorative Tech Decal */}
              <span className="absolute bottom-2 right-4 font-mono text-[8px] text-white/5 select-none font-bold group-hover:text-white/10 transition-colors">
                SYS.EDU.CORE_NODE // B.E.
              </span>

              {/* Terminal-Style Top Header Bar */}
              <div className="flex items-center justify-between border-b border-border-dark/60 pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00]/20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping" />
                  </span>
                  <span className="text-[9px] font-mono text-text-secondary-dark uppercase tracking-widest">// ACADEMIC_STATUS: ACTIVE</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/30" />
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/30" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Left Column (Meta & Description) */}
                <div className="space-y-4 max-w-2xl text-left flex-1">
                  <div className="flex items-center gap-3 select-none flex-wrap">
                    <span className="text-[10px] font-mono text-[#CCFF00] font-bold uppercase tracking-wider bg-[#CCFF00]/10 px-2 py-0.5 rounded border border-[#CCFF00]/20">
                      2023 – Present
                    </span>
                    <Badge variant="primary" size="sm" className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-[9px] font-mono font-bold">
                      ONGOING
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-text-primary-dark text-lg sm:text-xl font-bold font-display leading-tight flex items-center gap-2 group-hover:text-primary transition-colors">
                      <FiCpu className="text-[#CCFF00] w-5 h-5 flex-shrink-0" />
                      B.E. in Computer Engineering
                    </h3>
                    <h4 className="text-cyan-400 font-semibold text-xs sm:text-sm font-sans select-none flex items-center gap-1.5 pl-7">
                      <FiTerminal className="w-3.5 h-3.5" />
                      SAL Engineering and Technical Institute (Affiliated to GTU)
                    </h4>
                  </div>
                  
                  <p className="text-text-secondary-dark text-xs sm:text-sm leading-relaxed pl-7 border-l-2 border-border-dark/60 mt-3 py-1">
                    Currently pursuing B.E. in Computer Engineering. Developing core foundational software engineering expertise across algorithmic logic, object-oriented concepts, relational database schemas, and clean repository structures.
                  </p>
                </div>
                
                {/* Right Column (Subjects list & CGPA meter) */}
                <div className="flex flex-col justify-between select-none min-w-[200px] md:min-w-[260px] border-t md:border-t-0 md:border-l border-border-dark/40 pt-5 md:pt-0 md:pl-6 gap-6">
                  <div className="space-y-3 text-left">
                    <p className="text-[9px] font-mono text-text-secondary-dark uppercase tracking-widest block w-full flex items-center gap-1.5">
                      <FiActivity className="text-[#CCFF00] w-3 h-3" />
                      CORE CURRICULUM
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Computer Engineering", "C++", "Java", "Python", "SQL", "Git"].reverse().map((tech, idx) => (
                        <Badge 
                          key={idx} 
                          className="bg-white/5 hover:bg-primary/10 hover:border-primary/30 text-[9px] sm:text-[10px] text-gray-400 hover:text-primary font-mono px-2.5 py-1 rounded border border-white/5 transition-all duration-300 cursor-default"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* GTU Academic Progress & CPI */}
                  <div className="space-y-3 pt-4 border-t border-border-dark/60 mt-auto text-left">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                      <span className="text-text-secondary-dark uppercase tracking-wider flex items-center gap-1.5">
                        <FiAward className="text-[#CCFF00] w-3.5 h-3.5" />
                        CURRENT CPI (GTU)
                      </span>
                      <span className="text-[#CCFF00] bg-[#CCFF00]/10 px-1.5 py-0.5 rounded border border-[#CCFF00]/20">8.42 / 10.0</span>
                    </div>
                    <div className="w-full h-2 bg-surface-dark/80 rounded-full overflow-hidden p-[2px] border border-border-dark/80">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-[#CCFF00] rounded-full shadow-[0_0_8px_rgba(204,255,0,0.6)]" 
                        style={{ width: '84.2%' }} 
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-mono text-text-secondary-dark mt-1">
                      <span>STAGE: SEM_6</span>
                      <span className="text-white/60">6 / 8 SEMESTERS COMPLETED</span>
                    </div>
                  </div>
                </div>
              </div>

            </Card>
          </motion.div>

          {/* Twin cards grid (HSC & SSC) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* HSC Card */}
            <motion.div variants={cardVariants}>
              <Card 
                className="bg-[#111118]/60 backdrop-blur-xl border border-border-dark hover:border-[#CCFF00]/30 transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.5)] h-full group relative overflow-hidden"
                bodyClassName="p-6 h-full flex flex-col justify-between"
              >
                {/* Decorative Tech Decal */}
                <span className="absolute bottom-2 right-4 font-mono text-[8px] text-white/5 select-none font-bold">
                  NODE_ID // HSC
                </span>

                <div>
                  {/* System Header */}
                  <div className="flex items-center justify-between border-b border-border-dark/60 pb-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
                      <span className="text-[9px] font-mono text-text-secondary-dark uppercase tracking-wider">// LEVEL: HSC_ACADEMICS</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#CCFF00] font-bold uppercase tracking-wider bg-[#CCFF00]/10 px-2 py-0.5 rounded border border-[#CCFF00]/20">
                      2021 – 2023
                    </span>
                  </div>

                  <h3 className="text-text-primary-dark text-base sm:text-lg font-bold font-display mb-1 text-left flex items-center gap-2 group-hover:text-primary transition-colors">
                    <FiBookOpen className="text-primary w-4.5 h-4.5" />
                    HSC (Science)
                  </h3>
                  <h4 className="text-cyan-400 font-semibold text-xs sm:text-sm mb-3 font-sans text-left flex items-center gap-1.5 pl-6.5">
                    <FiMapPin className="w-3.5 h-3.5 text-text-secondary-dark" />
                    Amreli, Gujarat
                  </h4>
                  <p className="text-text-secondary-dark text-xs sm:text-sm leading-relaxed mb-4 text-left pl-6.5 border-l border-border-dark/40">
                    Completed higher secondary education in the science stream with a strong focus on mathematics, physics, and computer science.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pl-6.5 mb-6 text-left">
                    {["Physics", "Chemistry", "Mathematics", "Computer Science"].map((sub, idx) => (
                      <span key={idx} className="bg-white/5 hover:bg-white/10 text-[9px] font-mono text-gray-400 px-2 py-0.5 rounded border border-white/5 select-none transition-colors">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="space-y-2 mt-auto pt-4 border-t border-border-dark/60">
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold pl-1">
                    <span className="text-text-secondary-dark uppercase tracking-wider flex items-center gap-1">
                      <FiAward className="text-[#CCFF00] w-3.5 h-3.5" />
                      AGGREGATE GRADE
                    </span>
                    <span className="text-[#CCFF00] bg-[#CCFF00]/10 px-1.5 py-0.5 rounded border border-[#CCFF00]/20">66.46%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-dark/80 rounded-full overflow-hidden p-[2px] border border-border-dark/80">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-[#CCFF00] rounded-full shadow-[0_0_8px_rgba(204,255,0,0.6)]" 
                      style={{ width: '66.46%' }} 
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* SSC Card */}
            <motion.div variants={cardVariants}>
              <Card 
                className="bg-[#111118]/60 backdrop-blur-xl border border-border-dark hover:border-[#CCFF00]/30 transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.5)] h-full group relative overflow-hidden"
                bodyClassName="p-6 h-full flex flex-col justify-between"
              >
                {/* Decorative Tech Decal */}
                <span className="absolute bottom-2 right-4 font-mono text-[8px] text-white/5 select-none font-bold">
                  NODE_ID // SSC
                </span>

                <div>
                  {/* System Header */}
                  <div className="flex items-center justify-between border-b border-border-dark/60 pb-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                      <span className="text-[9px] font-mono text-text-secondary-dark uppercase tracking-wider">// LEVEL: SSC_ACADEMICS</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#CCFF00] font-bold uppercase tracking-wider bg-[#CCFF00]/10 px-2 py-0.5 rounded border border-[#CCFF00]/20">
                      2019 – 2021
                    </span>
                  </div>

                  <h3 className="text-text-primary-dark text-base sm:text-lg font-bold font-display mb-1 text-left flex items-center gap-2 group-hover:text-primary transition-colors">
                    <FiBookOpen className="text-primary w-4.5 h-4.5" />
                    SSC
                  </h3>
                  <h4 className="text-cyan-400 font-semibold text-xs sm:text-sm mb-3 font-sans text-left flex items-center gap-1.5 pl-6.5">
                    <FiMapPin className="w-3.5 h-3.5 text-text-secondary-dark" />
                    Amreli, Gujarat
                  </h4>
                  <p className="text-text-secondary-dark text-xs sm:text-sm leading-relaxed mb-4 text-left pl-6.5 border-l border-border-dark/40">
                    Completed secondary school certificate curriculum with excellent grades in mathematics and science.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pl-6.5 mb-6 text-left">
                    {["Mathematics", "Science", "English", "Social Studies"].map((sub, idx) => (
                      <span key={idx} className="bg-white/5 hover:bg-white/10 text-[9px] font-mono text-gray-400 px-2 py-0.5 rounded border border-white/5 select-none transition-colors">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="space-y-2 mt-auto pt-4 border-t border-border-dark/60">
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold pl-1">
                    <span className="text-text-secondary-dark uppercase tracking-wider flex items-center gap-1">
                      <FiAward className="text-[#CCFF00] w-3.5 h-3.5" />
                      AGGREGATE GRADE
                    </span>
                    <span className="text-[#CCFF00] bg-[#CCFF00]/10 px-1.5 py-0.5 rounded border border-[#CCFF00]/20">69.95%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-dark/80 rounded-full overflow-hidden p-[2px] border border-border-dark/80">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-[#CCFF00] rounded-full shadow-[0_0_8px_rgba(204,255,0,0.6)]" 
                      style={{ width: '69.95%' }} 
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
