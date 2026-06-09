import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiArrowRight, FiDownload, FiMail, FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi';
import { SiReact, SiFirebase, SiTypescript, SiTailwindcss } from 'react-icons/si';
import { useLenis } from '../../context/LenisContext';
import useGitHub from '../../hooks/useGitHub';
import useSettings from '../../hooks/useSettings';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';

export default function HeroSection() {
  const navigate = useNavigate();
  const { loading: githubLoading, stats } = useGitHub();
  const { settings } = useSettings();
  const { scrollY } = useLenis();

  // Scroll-linked parallax transforms
  const orbY1 = useTransform(scrollY, [0, 600], [0, -80]);
  const orbY2 = useTransform(scrollY, [0, 600], [0, -40]);
  const avatarY = useTransform(scrollY, [0, 600], [0, 60]);
  const textY = useTransform(scrollY, [0, 600], [0, 30]);
  
  // Mouse parallax spring values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(x, springConfig);
  const dy = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Map mouse movement to -20px to 20px
    x.set((mouseX / width) * 40);
    y.set((mouseY / height) * 40);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = settings?.resumeUrl || '/resume.pdf';
    link.download = 'Prince_Gajera_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center bg-bg-light dark:bg-bg-dark overflow-hidden pt-28 pb-16 lg:py-0 select-none"
    >
      {/* Background Layer: Grid and blurring gradient orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        
        {/* CSS grid dot pattern fading from center */}
        <div 
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(#6C63FF 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 70%)'
          }}
        />

        {/* 3 Large slowly oscillating blurred gradient orbs */}
        <motion.div
          style={{ y: orbY1 }}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5"
        />
        <motion.div
          style={{ y: orbY2 }}
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 20, -40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-secondary/10 blur-[140px] dark:bg-secondary/5"
        />
        <motion.div
          animate={{
            x: [0, 20, -10, 0],
            y: [0, 10, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-pink-500/5 blur-[120px]"
        />
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headings & Narrative */}
        <motion.div
          style={{ y: textY }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
        >
          {/* Status Badge */}
          {settings?.openToWork && (
            <motion.div variants={itemVariants}>
              <Badge variant="success" className="gap-2 px-3 py-1 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
                Open to Full-time &amp; Freelance Opportunities
              </Badge>
            </motion.div>
          )}

          {/* Headline Display */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-4xl sm:text-6xl md:text-7.5xl font-extrabold tracking-tight leading-[0.95] text-text-primary-light dark:text-text-primary-dark">
              Hi, I'm <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{settings?.name || 'Prince Gajera'}</span>
            </h1>
            <div className="font-display text-lg sm:text-2xl font-semibold text-text-secondary-light dark:text-text-secondary-dark mt-2">
              Frontend Developer &amp; React Engineer
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants} 
            className="text-text-secondary-light dark:text-text-secondary-dark max-w-xl text-xs sm:text-sm md:text-base leading-relaxed font-sans"
          >
            {settings?.bio || "Building Modern, Fast, and Scalable Web Applications with React, Firebase, and cutting-edge frontend technologies."}
          </motion.p>

          {/* CTA Buttons Row */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-wrap gap-4 justify-center lg:justify-start items-center pt-2 w-full"
          >
            <Button
              variant="primary"
              onClick={() => navigate('/projects')}
              className="gap-2 group"
            >
              <span>View Projects</span>
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="secondary"
              onClick={handleDownloadResume}
              className="gap-2"
            >
              <FiDownload className="w-4 h-4" />
              <span>Resume</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/contact')}
              className="gap-2"
            >
              <FiMail className="w-4 h-4" />
              <span>Contact</span>
            </Button>
          </motion.div>

          {/* Social Proof Stats Bar */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-lg border-t border-border-light dark:border-border-dark pt-6 mt-4 flex items-center justify-between font-mono"
          >
            {githubLoading ? (
              <Spinner size="sm" />
            ) : (
              <>
                <div className="flex-1 text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-extrabold text-primary dark:text-text-primary-dark">
                    {stats.reposCount || 19}+
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                    Repositories
                  </div>
                </div>
                <div className="w-[1px] h-8 bg-border-light dark:bg-border-dark mx-4" />
                <div className="flex-1 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold text-primary dark:text-text-primary-dark">
                    {stats.totalStars || 5}+
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                    Total Stars
                  </div>
                </div>
                <div className="w-[1px] h-8 bg-border-light dark:bg-border-dark mx-4" />
                <div className="flex-1 text-center lg:text-right">
                  <div className="text-xl sm:text-2xl font-extrabold text-primary dark:text-text-primary-dark">
                    {stats.commitsCount || 260}+
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                    Commits
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Social Links Row */}
          <motion.div variants={itemVariants} className="flex gap-4 pt-2">
            <a href={settings?.socialLinks?.github || "https://github.com/princegajera1"} target="_blank" rel="noopener noreferrer" className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
              <FiGithub className="w-5 h-5" />
            </a>
            <a href={settings?.socialLinks?.linkedin || "https://www.linkedin.com/in/gajera-prince/"} target="_blank" rel="noopener noreferrer" className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a href={settings?.socialLinks?.twitter || "https://x.com/GajeraPrin20670"} target="_blank" rel="noopener noreferrer" className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
              <FiTwitter className="w-5 h-5" />
            </a>
            <a href={settings?.socialLinks?.instagram || "https://www.instagram.com/gajera6902/"} target="_blank" rel="noopener noreferrer" className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
              <FiInstagram className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column: Premium Frame with Mouse Parallax and Orbiting Icons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ x: dx, y: dy, translateY: avatarY }}
          className="lg:col-span-5 flex justify-center lg:justify-end relative"
        >
          {/* Ambient Glow behind frame */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 blur-[60px] pointer-events-none" />

          <div className="relative w-64 sm:w-80 md:w-96 lg:w-full max-w-[340px] aspect-[4/5]">
            
            {/* Outer Conic Rotating Border Frame */}
            <div className="absolute inset-0 rounded-2xl p-[2.5px] bg-gradient-to-r from-primary via-secondary to-pink-500 animate-spin-slow shadow-2xl" />

            {/* Inner Frame Container */}
            <div className="absolute inset-[2.5px] bg-bg-light dark:bg-bg-dark rounded-[14px] overflow-hidden group">
              <img
                src={settings?.avatarUrl || "/avatar.png"}
                alt="Prince Gajera Profile"
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 contrast-110 brightness-95 hover:scale-105 transition-all duration-700"
              />

              {/* Secure Eye Trigger for Admin Login */}
              <div 
                onClick={() => navigate('/admin-login')}
                className="absolute top-[20%] left-[25%] w-[50%] h-[15%] cursor-pointer z-20 opacity-0"
                title="System Gateway"
              />

              {/* Bottom Glass Overlay Card */}
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-left z-10 flex flex-col gap-0.5">
                <span className="font-display font-extrabold text-sm text-white">
                  Prince Gajera
                </span>
                <span className="font-mono text-[9px] text-secondary font-bold uppercase tracking-wider">
                  Frontend Specialist
                </span>
              </div>
            </div>

            {/* Orbiting / Floating Tech Badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -left-4 p-3 bg-bg-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl z-20"
              title="React"
            >
              <SiReact className="w-5 h-5 text-sky-400 animate-spin-slow" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-4 -right-4 p-3 bg-bg-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl z-20"
              title="Firebase"
            >
              <SiFirebase className="w-5 h-5 text-amber-500" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-1/2 -right-6 p-3 bg-bg-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl z-20"
              title="TypeScript"
            >
              <SiTypescript className="w-5 h-5 text-blue-500" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="absolute bottom-1/3 -left-6 p-3 bg-bg-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl z-20"
              title="Tailwind CSS"
            >
              <SiTailwindcss className="w-5 h-5 text-teal-400" />
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
