import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import avatarImg from '../pages/img.jpg';
import resumeImg from '../pages/resume.jpg';

const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = parseInt(value, 10);
    if (isNaN(target)) {
      setCount(value);
      return;
    }
    const end = target;
    if (start === end) return;

    const incrementTime = Math.max(Math.floor(duration / end), 25);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  const suffix = typeof value === 'string' && value.includes('+') ? '+' : '';
  return <span>{count}{suffix}</span>;
};

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <section id="hero" className="min-h-[85vh] flex items-center pt-24 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side - Text Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-1/2 flex flex-col justify-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 w-fit mb-6 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
            <span className="text-xs font-mono text-accent-cyan tracking-wider uppercase font-semibold">Available for new opportunities</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight mb-4 text-white leading-none">
            Hello, World!<br />
            I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-indigo to-accent-purple drop-shadow-sm">Gajera Prince</span>
          </motion.h1>

          <motion.div variants={itemVariants} className="text-2xl md:text-3xl font-heading font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <span>I am a</span>
            <TypeAnimation
              sequence={[
                'Full Stack Developer',
                2000,
                'Generative AI Explorer',
                2000,
                'Problem Solver',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-white font-mono border-r-2 border-white pr-1 animate-pulse"
            />
          </motion.div>

          <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl mb-6 max-w-xl leading-relaxed font-sans">
            I build exceptional and accessible digital experiences for the web. 
            Currently focused on building accessible, human-centered products and exploring the world of Generative AI.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
            <Link to="/projects" className="relative px-8 py-4 rounded-full bg-gradient-to-r from-accent-cyan to-accent-indigo text-white font-medium shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 flex items-center gap-2 group overflow-hidden">
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
              <span className="relative z-10">View My Work</span>
            </Link>
            <a href={resumeImg} target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full bg-white text-dark font-bold hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              My Resume
            </a>
          </motion.div>

          {/* Stats with count-up animations */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-2xl border-t border-white/10 pt-6">
            <div>
              <p className="text-4xl font-bold text-white mb-1 drop-shadow-md">
                <AnimatedCounter value="17+" />
              </p>
              <p className="text-sm text-gray-400 font-mono tracking-wide">Projects</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1 drop-shadow-md">
                <AnimatedCounter value="2" />
              </p>
              <p className="text-sm text-gray-400 font-mono tracking-wide">Internships</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1 drop-shadow-md">B.E.</p>
              <p className="text-sm text-gray-400 font-mono tracking-wide">Computer Eng.</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1 drop-shadow-md">2027</p>
              <p className="text-sm text-gray-400 font-mono tracking-wide">Batch</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Responsive Symmetrical and Beautiful Chibi Avatar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex w-full lg:w-1/2 justify-center items-center relative h-[320px] md:h-[400px] lg:h-[500px] mt-6 lg:mt-0"
        >
          <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] flex items-center justify-center">
            {/* Background Glows with Symmetrical sizing */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/15 via-accent-indigo/15 to-transparent rounded-full blur-[60px] md:blur-[70px] animate-pulse"></div>
            
            {/* Symmetrical glowing neon frame border circle */}
            <div className="absolute inset-0 rounded-full border-4 border-accent-indigo/35 shadow-[0_0_40px_rgba(99,102,241,0.3)] lg:shadow-[0_0_50px_rgba(99,102,241,0.35)] z-0"></div>
            
            {/* The Image with Symmetrical Sizing */}
            <img 
              src={avatarImg} 
              alt="Prince Gajera Cute Chibi Robot" 
              className="w-full h-full object-cover rounded-full z-10 hover:scale-105 hover:-rotate-1 transition-all duration-500 cursor-pointer"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
