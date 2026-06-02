import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Typed from 'typed.js';
import ParticleBackground from '../ParticleBackground';
import { useHeroAnimation } from '../../hooks/useGSAP';
import { getProjects } from '../../firebase/projects';
import { useToast } from '../../context/ToastContext';

export default function HeroSection() {
  const navigate = useNavigate();
  const toast = useToast();
  const typedRef = useRef(null);
  const [projectsCount, setProjectsCount] = useState(19);
  const [resumeUrl, setResumeUrl] = useState('/resume.pdf');
  useHeroAnimation();

  // Dynamic Coding Experience Auto-calculation (Starts from September 2023)
  const getCodingExp = () => {
    const start = new Date('2023-09-01');
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return `${Math.floor(diffYears)}+ Yrs`;
  };

  const trackCTAClick = (label) => {
    if (window.gtag) {
      window.gtag('event', 'click_cta', {
        'event_category': 'Engagement',
        'event_label': label
      });
    }
  };

  useEffect(() => {
    const savedResume = localStorage.getItem('resume_url');
    if (savedResume) {
      if (savedResume.startsWith('blob:')) {
        localStorage.removeItem('resume_url');
        localStorage.removeItem('prince_resume_metadata');
        setResumeUrl('/resume.pdf');
      } else {
        setResumeUrl(savedResume);
      }
    } else {
      setResumeUrl('/resume.pdf');
    }

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

    const handleStorageChange = () => {
      fetchCount();
      const savedResume = localStorage.getItem('resume_url');
      if (savedResume) {
        setResumeUrl(savedResume);
      } else {
        setResumeUrl('/resume.pdf');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('projectsUpdated', handleStorageChange);

    // Dynamic professional roles typing
    const typed = new Typed(typedRef.current, {
      strings: [
        'Senior Full Stack Engineer',
        'React & Vite Expert', 
        'Firebase Cloud Architect',
        'Interactive UI/UX Designer',
        'Algorithmic Problem Solver'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
      backDelay: 2000,
    });

    const ctx = gsap.context(() => {
      const shapes = document.querySelectorAll('.float-shape');
      shapes.forEach((shape, index) => {
        gsap.to(shape, {
          y: `${(index % 2 === 0 ? -1 : 1) * (12 + index * 4)}px`,
          x: `${(index % 3 === 0 ? 1 : -1) * (8 + index * 3)}px`,
          rotate: index % 2 === 0 ? 90 : -90,
          duration: 5 + index * 1.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      });

      gsap.to('.hero-floating-tag', {
        y: -8,
        duration: 3.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });

      gsap.set('.hero-robot-container', { rotation: '3deg' });
      gsap.to('.hero-robot-container', {
        y: '-18px',
        rotation: '1deg',
        scale: 1.01,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    });

    return () => {
      typed.destroy();
      ctx.revert();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('projectsUpdated', handleStorageChange);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-dark overflow-hidden pt-36 pb-20 lg:py-0">
      {/* Background canvas animations */}
      <ParticleBackground color="#7c6fff" density={120} />
      
      {/* Mesh gradients backing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative linear frames */}
      <div className="float-shape absolute top-24 left-[10%] w-14 h-14 border border-[#7C6FFF]/20 rotate-45 rounded-xl pointer-events-none hidden sm:block shadow-[0_0_15px_rgba(124,111,255,0.03)]" />
      <div className="float-shape absolute bottom-28 right-[12%] w-12 h-12 border border-[#00e5ff]/20 rounded-full pointer-events-none hidden sm:block shadow-[0_0_15px_rgba(0,229,255,0.03)]" />

      <div className="max-w-7xl w-full mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left narrative content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="hero-tagline hero-floating-tag font-mono text-xs text-secondary tracking-[0.25em] uppercase mb-1 flex items-center gap-2 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_#00e5ff] flex-shrink-0" />
            &lt; Enterprise Software Architect /&gt;
          </div>
          
          <h1 className="hero-name font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] text-white py-1">
            Prince Gajera
          </h1>
          
          <div className="hero-role text-base sm:text-lg md:text-xl font-mono text-gray-400 min-h-[30px] select-none">
            Specialized as an <span ref={typedRef} className="text-secondary font-bold" />
          </div>
          
          <p className="hero-bio text-gray-500 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed font-sans select-text">
            Designing high-performance web products that balance rapid computing power with state-of-the-art interactive aesthetics. From modular React architectures in Vite to secure serverless systems on Google Firebase — I craft clean code that scales to millions.
          </p>
 
          {/* Action-centric callouts for recruiters and leads */}
          <div className="hero-cta flex flex-wrap gap-3.5 justify-center lg:justify-start items-center select-none pt-4">
            <a 
              href="#projects" 
              onClick={() => trackCTAClick('hero_explore_projects')}
              className="px-7 py-3.5 bg-primary hover:bg-[#6c5eff] text-white rounded-xl text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,111,255,0.45)] hover:-translate-y-0.5 active:scale-95 shadow-md shadow-primary/20"
            >
              Explore Portfolio
            </a>
            
            <a 
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                trackCTAClick('hero_cv_download');
                if (resumeUrl === '#' || !resumeUrl) {
                  e.preventDefault();
                  toast.info("Preparing optimized CV PDF metadata... Please upload in the statistics tab.");
                  return;
                }
              }}
              className="px-7 py-3.5 border border-[#00e5ff]/40 hover:border-secondary text-secondary hover:text-white rounded-xl text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-secondary/5 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,229,255,0.12)]"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Download Resume</span>
            </a>
            
            <a 
              href="#contact" 
              onClick={() => trackCTAClick('hero_schedule_call')}
              className="px-7 py-3.5 border border-white/5 hover:border-primary text-gray-400 hover:text-white rounded-xl text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-primary/5 hover:-translate-y-0.5 active:scale-95"
            >
              Hire Me Directly
            </a>
          </div>

          {/* Recruiter specific analytics row */}
          <div className="hero-cta flex justify-between items-center w-full max-w-lg border-t border-white/5 pt-8 select-none text-center font-mono">
            <div className="flex-1">
              <div className="text-2xl sm:text-3xl font-black text-primary tracking-tight">{projectsCount}+</div>
              <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">REPOS BUILT</div>
            </div>
            <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-4 flex-shrink-0" />
            <div className="flex-1 text-center">
              <div className="text-2xl sm:text-3xl font-black text-primary tracking-tight">{getCodingExp()}</div>
              <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">CODING EXP</div>
            </div>
            <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-4 flex-shrink-0" />
            <div className="flex-1 text-center">
              <div className="text-2xl sm:text-3xl font-black text-primary tracking-tight">100%</div>
              <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">CLEAN CODE</div>
            </div>
          </div>
        </div>

        {/* Right side floating glass frame robot avatar */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative select-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-secondary/5 rounded-full blur-[80px] pointer-events-none z-0" />
          
          <div className="hero-robot-container relative z-10 w-64 sm:w-80 md:w-96 lg:w-full max-w-[350px] aspect-[3/4] p-3 rounded-[32px] border border-white/5 bg-[#13132a]/30 shadow-[0_0_50px_rgba(0,0,0,0.6),_0_0_40px_rgba(124,111,255,0.08)] backdrop-blur-xl">
            <img 
              src="/robot.png" 
              alt="Prince Gajera Generative AI Developer Avatar Logo"
              className="w-full h-full object-contain rounded-2xl filter drop-shadow-[0_10px_30px_rgba(0,229,255,0.15)]"
              loading="eager"
            />
            
            {/* Hidden admin access eye trigger */}
            <div
              onClick={() => navigate('/admin/login')}
              className="absolute cursor-pointer"
              style={{
                top: '23%',
                left: '26%',
                width: '48%',
                height: '18%',
                zIndex: 40
              }}
              title="Secure System Gateway"
            />

            <div className="absolute -bottom-4 left-1/4 w-2.5 h-2.5 bg-secondary/35 rounded-full animate-ping" />
            <div className="absolute top-1/4 -right-2 w-1.5 h-1.5 bg-accent/25 rounded-full animate-pulse" />
          </div>
        </div>

      </div>
    </section>
  );
}
