import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Typed from 'typed.js';
import ParticleBackground from '../ParticleBackground';
import { useHeroAnimation } from '../../hooks/useGSAP';
import { getProjects } from '../../firebase/projects';
import { useToast } from '../../context/ToastContext';
import { db, isFirebaseConfigured } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function HeroSection() {
  const navigate = useNavigate();
  const toast = useToast();
  const typedRef = useRef(null);
  const bgRef = useRef(null);
  const [projectsCount, setProjectsCount] = useState(12);
  const [resumeUrl, setResumeUrl] = useState('/resume.pdf');
  useHeroAnimation();

  // Dynamic Coding Experience Auto-calculation (Starts from September 2023)
  const getCodingExp = () => {
    const start = new Date('2023-09-01');
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return `${Math.floor(diffYears)}+ Years`;
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

    const fetchResume = async () => {
      try {
        const savedResume = localStorage.getItem('resume_url');
        if (savedResume) {
          if (savedResume.startsWith('blob:')) {
            localStorage.removeItem('resume_url');
            localStorage.removeItem('prince_resume_metadata');
            setResumeUrl('/resume.pdf');
          } else {
            setResumeUrl(savedResume);
          }
        }
        
        if (isFirebaseConfigured && db) {
          const docSnap = await getDoc(doc(db, 'settings', 'resume'));
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && data.url) {
              setResumeUrl(data.url);
              localStorage.setItem('resume_url', data.url);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching active resume PDF:", err);
      }
    };
    fetchResume();

    const handleStorageChange = () => {
      fetchCount();
      fetchResume();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('projectsUpdated', handleStorageChange);

    // Dynamic professional roles typing - Restricted to 1-2 phrases
    const typed = new Typed(typedRef.current, {
      strings: [
        'Full Stack Developer',
        'React Specialist'
      ],
      typeSpeed: 60,
      backSpeed: 40,
      loop: true,
      backDelay: 3000,
    });

    const ctx = gsap.context(() => {
      // Parallax ONLY on hero background elements
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }

      // Soft layout rotation adjustments
      gsap.set('.hero-profile-container', { rotation: '-1.5deg' });
      gsap.to('.hero-profile-container', {
        y: '-10px',
        rotation: '1.5deg',
        duration: 5,
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
    <section id="home" className="relative min-h-screen flex items-center bg-dark overflow-hidden pt-32 pb-16 lg:py-0">
      {/* Background elements container (for parallax scroll effect) */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none select-none">
        <ParticleBackground color="#E8FF00" density={50} />
        
        {/* Soft grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#E8FF00 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Ambient glow backing */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary/5 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left narrative content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="hero-tagline font-mono text-[10px] sm:text-xs text-primary tracking-[0.2em] uppercase mb-1 flex items-center gap-2 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#E8FF00]" />
            &lt; Redefining Web Aesthetics /&gt;
          </div>
          
          <h1 className="hero-name font-display text-4xl sm:text-6xl md:text-7.5xl font-black tracking-tight leading-[0.9] text-white">
            Prince Gajera
          </h1>
          
          <div className="hero-role text-base sm:text-lg md:text-xl font-mono text-gray-400 min-h-[30px] select-none">
            Specialized as a <span ref={typedRef} className="text-primary font-bold" />
          </div>
          
          <p className="hero-bio text-gray-400 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed font-sans select-text">
            I don't just write code — I engineer experiences. Balancing sub-second database execution with pixel-perfect visual engineering to build high-performance web products that scale seamlessly.
          </p>
 
          {/* Action-centric CTA Buttons (Custom Styled) */}
          <div className="hero-cta flex flex-wrap gap-4 justify-center lg:justify-start items-center select-none pt-4">
            <a 
              href="#projects" 
              onClick={() => trackCTAClick('hero_explore_projects')}
              className="px-8 py-4 bg-primary text-black rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(232,255,0,0.3)] hover:-translate-y-0.5 active:scale-95 animate-glow"
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
              className="px-8 py-4 border border-primary/20 hover:border-primary text-white hover:text-primary rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 hover:bg-primary/5 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Download CV</span>
            </a>
            
            <a 
              href="#contact" 
              onClick={() => trackCTAClick('hero_schedule_call')}
              className="px-8 py-4 border border-white/10 hover:border-white text-gray-400 hover:text-white rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 hover:bg-white/5 hover:-translate-y-0.5 active:scale-95"
            >
              Hire Me
            </a>
          </div>

          {/* Recruiter specific analytics row (Dynamic & Specific Numbers) */}
          <div className="hero-cta flex justify-between items-center w-full max-w-lg border-t border-white/10 pt-8 select-none text-center font-mono">
            <div className="flex-1">
              <div className="text-2xl sm:text-3xl font-black text-primary tracking-tight">{projectsCount}+</div>
              <div className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">Projects Shipped</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10 mx-4 flex-shrink-0" />
            <div className="flex-1 text-center">
              <div className="text-2xl sm:text-3xl font-black text-primary tracking-tight">{getCodingExp()}</div>
              <div className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">Active Coding</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10 mx-4 flex-shrink-0" />
            <div className="flex-1 text-center">
              <div className="text-2xl sm:text-3xl font-black text-primary tracking-tight">100%</div>
              <div className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">Human Crafted</div>
            </div>
          </div>
        </div>

        {/* Right side Profile Photo Frame (Irregular clip path & tilt - Fixed Corners) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative select-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/5 rounded-full blur-[80px] pointer-events-none z-0" />
          
          <div className="hero-profile-container relative z-10 w-64 sm:w-80 md:w-96 lg:w-full max-w-[340px] aspect-[4/5] bg-transparent">
            {/* Irregular geometric clip-path framing wrapper */}
            <div 
              className="relative w-full h-full bg-[#111] overflow-hidden p-1.5"
              style={{
                clipPath: 'polygon(6% 0%, 100% 8%, 94% 100%, 0% 92%)'
              }}
            >
              {/* Inner container to hold image and match the frame padding */}
              <div className="relative w-full h-full bg-[#1c1c1c] overflow-hidden">
                <img 
                  src="/robot.png" 
                  alt="Prince Gajera Profile"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 filter grayscale contrast-125 brightness-90 hover:grayscale-0"
                  loading="eager"
                />

                {/* Hidden admin access eye trigger (perfectly mapped to the container) */}
                <div
                  onClick={() => navigate('/admin/login')}
                  className="absolute cursor-pointer animate-pulse"
                  style={{
                    top: '25%',
                    left: '25%',
                    width: '50%',
                    height: '20%',
                    zIndex: 40
                  }}
                  title="Secure System Gateway"
                />
              </div>
            </div>
            
            {/* Visual borders matching the clip-path */}
            <div 
              className="absolute inset-0 border border-primary/20 pointer-events-none z-30"
              style={{
                clipPath: 'polygon(6% 0%, 100% 8%, 94% 100%, 0% 92%)'
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
