import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBookOpen, FiCode, FiAward } from 'react-icons/fi';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

export default function AboutSection() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const statCards = [
    { icon: FiBookOpen, title: '2+ Years', label: 'Learning Code', color: 'primary' },
    { icon: FiCode, title: '19+ Built', label: 'Projects Shipped', color: 'secondary' },
    { icon: FiAward, title: '16+ Stack', label: 'Technologies Used', color: 'primary' }
  ];

  const skillBadges = [
    'React.js', 'Firebase', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Framer Motion', 'Node.js', 'MongoDB'
  ];

  return (
    <section id="about" className="py-24 bg-bg-light dark:bg-bg-dark border-t border-border-light dark:border-border-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Profile Photo + Floating stats cards */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex justify-center relative select-none"
        >
          {/* Main graphic container */}
          <div className="relative w-64 sm:w-80 aspect-[4/5] bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-2 shadow-2xl">
            <img
              src="/avatar.png"
              alt="Prince Gajera Timeline Profile"
              className="w-full h-full object-cover rounded-xl filter grayscale hover:grayscale-0 transition-all duration-500 contrast-110 brightness-95"
            />
          </div>

          {/* Floating stat card 1: Top-Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute -top-6 -left-6 z-20"
          >
            <Card 
              className="bg-white/70 dark:bg-[#111118]/70 border border-white/10 shadow-xl rounded-xl"
              bodyClassName="p-3 !py-2.5 flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <FiBookOpen className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight flex-shrink-0">
                <div className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark font-mono">2+ Years</div>
                <div className="text-[9px] text-text-secondary-light dark:text-text-secondary-dark">Active Learning</div>
              </div>
            </Card>
          </motion.div>

          {/* Floating stat card 2: Bottom-Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="absolute -bottom-6 -right-6 z-20"
          >
            <Card 
              className="bg-white/70 dark:bg-[#111118]/70 border border-white/10 shadow-xl rounded-xl"
              bodyClassName="p-3 !py-2.5 flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary flex-shrink-0">
                <FiCode className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight flex-shrink-0">
                <div className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark font-mono">19+ Built</div>
                <div className="text-[9px] text-text-secondary-light dark:text-text-secondary-dark">Projects Shipped</div>
              </div>
            </Card>
          </motion.div>

          {/* Floating stat card 3: Middle-Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute top-1/2 -left-12 z-20"
          >
            <Card 
              className="bg-white/70 dark:bg-[#111118]/70 border border-white/10 shadow-xl rounded-xl"
              bodyClassName="p-3 !py-2.5 flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 flex-shrink-0">
                <FiAward className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight flex-shrink-0">
                <div className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark font-mono">16+ Techs</div>
                <div className="text-[9px] text-text-secondary-light dark:text-text-secondary-dark">In Stack</div>
              </div>
            </Card>
          </motion.div>

        </motion.div>

        {/* Right Column: Bio Narrative */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="lg:col-span-7 space-y-6 text-left"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <span className="section-label">// ABOUT ME</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Passionate Developer on a Mission to Build Great Products
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4 text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-sans select-text">
            <p>
              My journey into frontend engineering started with a core curiosity for creating visual experiences. I enjoy translating complex UI/UX designs into pixel-perfect, interactive React interfaces.
            </p>
            <p>
              I specialize in harnessing modern bundlers like Vite, building responsive layouts with Tailwind CSS, animating elements using Framer Motion, and integrating robust database logic via Firebase.
            </p>
            <p>
              What drives me is building clean codebases that perform at scale, guaranteeing fast page loads, technical SEO visibility, and smooth micro-interactions that wow users.
            </p>
          </motion.div>

          {/* Animated Tags Row */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 pt-2">
            {skillBadges.map((badge) => (
              <Badge key={badge} variant="neutral" size="sm" className="font-semibold">
                {badge}
              </Badge>
            ))}
          </motion.div>

          {/* Read Full Story Button */}
          <motion.div variants={itemVariants} className="pt-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/about')}
              className="gap-2 group"
            >
              <span>Read Full Story</span>
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
