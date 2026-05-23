import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Typed from 'typed.js';
import ParticleBackground from '../ParticleBackground';
import { useHeroAnimation } from '../../hooks/useGSAP';
import { getProjects } from '../../firebase/projects';

import { useToast } from '../../context/ToastContext';

export default function HeroSection() {
  const toast = useToast();
  const typedRef = useRef(null);
  const [projectsCount, setProjectsCount] = useState(19);
  const [resumeUrl, setResumeUrl] = useState('#');
  useHeroAnimation();

  // Dynamic Coding Experience Auto-calculation
  const getCodingExp = () => {
    const start = new Date('2023-09-01');
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return `${Math.floor(diffYears)}+ Yrs`;
  };

  useEffect(() => {
    // Check for uploaded resume
    const savedResume = localStorage.getItem('resume_url');
    if (savedResume) {
      if (savedResume.startsWith('blob:')) {
        localStorage.removeItem('resume_url');
        localStorage.removeItem('prince_resume_metadata');
        setResumeUrl('#');
      } else {
        setResumeUrl(savedResume);
      }
    }

    // Fetch total projects dynamically
    const fetchCount = async () => {
      try {
        const list = await getProjects();
        if (list && list.length) {
          setProjectsCount(list.length);
        }
      } catch (e) {
        console.error("Error fetching projects count in Hero:", e);
      }
    };
    fetchCount();

    // Listen for custom updates
    const handleStorageChange = () => {
      const saved = localStorage.getItem('prince_projects');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProjectsCount(parsed.length);
        } catch (e) {}
      }
      const savedResume = localStorage.getItem('resume_url');
      if (savedResume) {
        setResumeUrl(savedResume);
      } else {
        setResumeUrl('#');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('projectsUpdated', handleStorageChange);

    // Role Typewriter Effect
    const typed = new Typed(typedRef.current, {
      strings: [
        'Full Stack Developer',
        'React Specialist', 
        'Firebase Expert',
        'UI/UX Enthusiast',
        'Problem Solver'
      ],
      typeSpeed: 60,
      backSpeed: 40,
      loop: true,
      backDelay: 1800,
    });

    // Animate floating background shapes
    const shapes = document.querySelectorAll('.float-shape');
    shapes.forEach((shape, index) => {
      gsap.to(shape, {
        y: `${(index % 2 === 0 ? -1 : 1) * (15 + index * 5)}px`,
        x: `${(index % 3 === 0 ? 1 : -1) * (10 + index * 4)}px`,
        rotate: index % 2 === 0 ? 180 : -180,
        duration: 6 + index * 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    });

    // Smooth Infinite Floating & Breathing Animation for the tilted 3D Robot Card (3-5deg range)
    gsap.set('.hero-robot-container', { rotation: '4deg' });
    gsap.to('.hero-robot-container', {
      y: '-25px',
      rotation: '2.5deg',
      scale: 1.02,
      duration: 4.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    return () => {
      typed.destroy();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('projectsUpdated', handleStorageChange);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-dark overflow-hidden py-24 lg:py-0">
      {/* Dynamic Purple/Blue Background Particle canvas */}
      <ParticleBackground color="#6C63FF" density={110} />
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating neon outlines */}
      <div className="float-shape absolute top-24 left-[8%] w-16 h-16 border border-primary/20 rotate-45 rounded-lg pointer-events-none hidden sm:block" 
           style={{ boxShadow: '0 0 15px rgba(108, 99, 255, 0.03)' }} />
      <div className="float-shape absolute bottom-28 right-[10%] w-12 h-12 border border-secondary/20 rounded-full pointer-events-none hidden sm:block"
           style={{ boxShadow: '0 0 15px rgba(0, 212, 255, 0.03)' }} />
      <div className="float-shape absolute top-1/3 right-[15%] w-8 h-8 border border-accent/25 rotate-12 rounded pointer-events-none hidden md:block" />
      <div className="float-shape absolute bottom-1/3 left-[12%] w-10 h-10 border border-primary/10 rotate-90 rounded-md pointer-events-none hidden md:block" />

      {/* Split Screen Master Grid Content */}
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Column - Narrative & Typography */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="hero-tagline font-mono text-xs sm:text-sm text-secondary tracking-widest uppercase mb-1">
            &lt; Hello, World! /&gt; — I'm
          </div>
          
          <h1 className="hero-name font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent select-text py-2"
              style={{ textShadow: '0 0 40px rgba(108,99,255,0.18)' }}>
            Prince Gajera
          </h1>
          
          <div className="hero-role text-lg sm:text-xl md:text-2xl font-mono text-gray-400 min-h-[36px] select-none">
            Working as a <span ref={typedRef} className="text-secondary font-bold" />
          </div>
          
          <p className="hero-bio text-gray-500 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed font-sans animate-fade-in">
            I build high-end things for the web. From crafting fluid visual interfaces in React to designing structured serverless architectures in Firebase — I focus on performance, clean code, and dynamic details.
          </p>

          <div className="hero-cta flex flex-wrap gap-3 justify-center lg:justify-start items-center select-none pt-4">
            <a 
              href="#projects" 
              className="px-6 py-3.5 bg-primary hover:bg-primary/80 text-white rounded-xl text-xs sm:text-sm font-semibold tracking-wide
                         transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95"
            >
              Explore Projects
            </a>
            <button 
              onClick={() => {
                if (resumeUrl === '#' || !resumeUrl) {
                  toast.info("No resume uploaded yet! Please upload a PDF in the admin panel Stats tab.");
                  return;
                }
                if (resumeUrl.startsWith('blob:')) {
                  localStorage.removeItem('resume_url');
                  localStorage.removeItem('prince_resume_metadata');
                  setResumeUrl('#');
                  toast.error("The resume file has expired. Please upload a new PDF in the admin panel.");
                  return;
                }
                
                try {
                  const newWindow = window.open();
                  if (newWindow) {
                    newWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Prince Gajera - Resume</title>
                          <style>
                            body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #0b0f19; }
                            iframe { border: none; width: 100%; height: 100%; }
                          </style>
                        </head>
                        <body>
                          <iframe src="${resumeUrl}"></iframe>
                        </body>
                      </html>
                    `);
                    newWindow.document.close();
                  } else {
                    toast.error("Popup blocked! Please allow popups to view the resume.");
                  }
                } catch (e) {
                  console.error(e);
                  toast.error("Error opening PDF viewer.");
                }
              }}
              className="px-6 py-3.5 border border-secondary/40 hover:border-secondary text-secondary hover:text-white 
                         rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-secondary/5 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
            >
              <span>View CV</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <a 
              href="#contact" 
              className="px-6 py-3.5 border border-white/10 hover:border-primary text-gray-300 hover:text-white 
                         rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-primary/5 hover:-translate-y-0.5 active:scale-95"
            >
              Get In Touch
            </a>
          </div>

          {/* Dynamic Stats Row with vertical dividers | and balanced spacing */}
          <div className="hero-cta flex justify-between items-center w-full max-w-md border-t border-white/5 pt-10 select-none text-center lg:text-left font-mono">
            <div className="flex-1">
              <div className="text-lg sm:text-2xl font-extrabold text-primary">{projectsCount}+</div>
              <div className="text-[9px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wider">REPOS BUILT</div>
            </div>
            <span className="text-white/10 font-light mx-2 sm:mx-4 select-none">|</span>
            <div className="flex-1 text-center">
              <div className="text-lg sm:text-2xl font-extrabold text-primary">{getCodingExp()}</div>
              <div className="text-[9px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wider">CODING EXP</div>
            </div>
            <span className="text-white/10 font-light mx-2 sm:mx-4 select-none">|</span>
            <div className="flex-1 text-center lg:text-right">
              <div className="text-lg sm:text-2xl font-extrabold text-primary">100%</div>
              <div className="text-[9px] sm:text-xs text-gray-500 mt-1 uppercase tracking-wider">COMMITMENT</div>
            </div>
          </div>
        </div>

        {/* Right Side Column - Floating 3D Robot with Purple/Cyan Glowing border frame */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative select-none">
          {/* Large soft cyan glow backing */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-secondary/10 rounded-full blur-[80px] pointer-events-none z-0" />
          
          <div className="hero-robot-container relative z-10 w-64 sm:w-80 md:w-96 lg:w-full max-w-[360px] aspect-[3/4] p-3 rounded-[32px] border-2 border-primary/20 bg-surface-2/40 shadow-[0_0_30px_rgba(108,99,255,0.18),_0_0_60px_rgba(0,212,255,0.12)] backdrop-blur-sm">
            <img 
              src="/robot.png" 
              alt="Prince's 3D Robot Avatar"
              className="w-full h-full object-contain rounded-2xl filter drop-shadow-[0_10px_30px_rgba(0,212,255,0.15)]"
            />
            {/* Ambient small particles floating near the robot */}
            <div className="absolute -bottom-4 left-1/4 w-2 h-2 bg-secondary/30 rounded-full animate-ping" />
            <div className="absolute top-1/4 -right-2 w-1.5 h-1.5 bg-accent/25 rounded-full animate-pulse" />
          </div>
        </div>

      </div>
    </section>
  );
}
