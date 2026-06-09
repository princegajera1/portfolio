import { motion } from 'framer-motion';
import { FiBookOpen, FiCode, FiBriefcase, FiCheck } from 'react-icons/fi';
import Card from '../ui/Card';

export default function NowSection() {
  const cards = [
    {
      title: 'Currently Learning',
      icon: FiBookOpen,
      color: 'from-violet-500 to-indigo-500',
      items: ['Redux Toolkit & State Splitting', 'Node.js & Express REST APIs', 'MongoDB Database Schemes', 'System Scalability Design']
    },
    {
      title: 'Currently Building',
      icon: FiCode,
      color: 'from-cyan-500 to-blue-500',
      items: ['Full-Stack Job Portal (MERN)', 'Premium Recruiter Portfolio', 'Interactive AI Assistant Chatbot', 'Clean Architecture Libraries']
    },
    {
      title: 'Looking For',
      icon: FiBriefcase,
      color: 'from-emerald-500 to-teal-500',
      items: ['Frontend Developer Roles', 'Remote Engineering Positions', 'Open Source Collaborations', 'Enterprise SaaS Positions']
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 90, damping: 20 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section id="now" className="py-20 bg-bg-light/50 dark:bg-[#0A0A0F]/50 border-t border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="section-label">// DYNAMIC TARGETS</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            What I'm Focused On Now
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm font-sans leading-relaxed">
            A snapshot of my active development dashboard: skills under construction, active features, and employment ambitions.
          </p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} variants={cardVariants}>
                <Card 
                  className="border border-border-light dark:border-border-dark hover:border-primary/30 transition-all duration-300 h-full"
                  bodyClassName="p-6 h-full"
                >
                  
                  {/* Card Header with Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-lg shadow-black/10`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-extrabold text-base text-text-primary-light dark:text-text-primary-dark">
                      {card.title}
                    </h3>
                  </div>

                  {/* Bullet list items */}
                  <ul className="space-y-4">
                    {card.items.map((item, itemIdx) => (
                      <motion.li
                        key={item}
                        variants={itemVariants}
                        className="flex items-start gap-3 text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark"
                      >
                        <div className="p-0.5 rounded-full bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                          <FiCheck className="w-3 h-3 stroke-[3px]" />
                        </div>
                        <span className="text-left leading-snug">{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                </Card>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
