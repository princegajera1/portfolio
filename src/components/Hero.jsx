import { useState, useEffect, useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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
  const container = useRef();
  const imageRef = useRef();
  
  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Text animations
    tl.fromTo('.hero-text-item', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
    );

    // Image GSAP animations (complex, professional, not AI-looking)
    gsap.fromTo(imageRef.current, 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.7)', delay: 0.2 }
    );

    gsap.to(imageRef.current, {
      y: -15,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.4
    });

  }, { scope: container });

  return (
    <section id="hero" ref={container} className="min-h-[90vh] flex items-center pt-24 pb-12 relative overflow-hidden bg-custom-richBlack">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Left Side - Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          {/* Badge */}
          <div className="hero-text-item inline-flex items-center gap-3 px-4 py-2 rounded-full bg-custom-midnightGreen/20 border border-custom-midnightGreen/40 w-fit mb-8 shadow-sm opacity-0">
            <span className="w-2.5 h-2.5 rounded-full bg-custom-gargoyleGas animate-pulse"></span>
            <span className="text-xs font-mono text-custom-gargoyleGas tracking-widest uppercase font-semibold">Available for work</span>
          </div>

          <h1 className="hero-text-item text-4xl md:text-6xl font-heading font-extrabold tracking-tight mb-4 text-white leading-tight opacity-0">
            Hello, World!<br />
            I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-custom-carrotOrange via-custom-gargoyleGas to-custom-carrotOrange">Gajera Prince</span>
          </h1>

          <div className="hero-text-item text-xl md:text-2xl font-heading font-semibold text-gray-300 mb-4 flex items-center gap-2 opacity-0">
            <span className="text-gray-400">I am a</span>
            <TypeAnimation
              sequence={[
                'Full Stack Developer', 2000,
                'Generative AI Explorer', 2000,
                'Problem Solver', 2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-custom-carrotOrange"
            />
          </div>

          <p className="hero-text-item text-gray-400 text-base md:text-lg mb-8 max-w-xl leading-relaxed font-sans font-light opacity-0">
            I build fast, scalable, and beautifully designed web applications.
            Right now, I'm focused on creating intuitive digital platforms and exploring practical Generative AI.
          </p>

          <div className="hero-text-item flex flex-wrap gap-4 mb-8 opacity-0">
            <Link to="/projects" className="px-6 py-3 rounded-full bg-custom-carrotOrange text-custom-richBlack font-semibold shadow-lg hover:shadow-custom-carrotOrange/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group text-sm md:text-base">
              <span>View Portfolio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href={resumeImg} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-transparent border border-white/20 text-white font-medium hover:bg-white/5 hover:border-white/40 transition-all duration-300 text-sm md:text-base">
              Download Resume
            </a>
          </div>

          {/* Stats with count-up animations */}
          <div className="hero-text-item grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-2xl border-t border-white/10 pt-6 opacity-0">
            <div>
              <p className="text-3xl font-bold text-white mb-1 font-heading">
                <AnimatedCounter value="17+" />
              </p>
              <p className="text-[10px] md:text-xs text-gray-400 font-mono tracking-widest uppercase">Projects</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1 font-heading">
                <AnimatedCounter value="2" />
              </p>
              <p className="text-[10px] md:text-xs text-gray-400 font-mono tracking-widest uppercase">Internships</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1 font-heading">B.E.</p>
              <p className="text-[10px] md:text-xs text-gray-400 font-mono tracking-widest uppercase">Computer Eng.</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1 font-heading">2027</p>
              <p className="text-[10px] md:text-xs text-gray-400 font-mono tracking-widest uppercase">Batch</p>
            </div>
          </div>
        </div>

        {/* Right Side - Professional Premium Image container with GSAP */}
        <div className="flex w-full lg:w-1/2 justify-center items-center relative mt-12 lg:mt-0">
          <div 
            ref={imageRef}
            className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center group opacity-0"
          >
            {/* Elegant Glow instead of cheesy neon */}
            <div className="absolute inset-0 bg-custom-midnightGreen/20 rounded-full blur-[80px] transition-all duration-700 group-hover:bg-custom-carrotOrange/20 group-hover:blur-[100px]"></div>
            
            {/* Minimalist Professional Border Ring */}
            <div className="absolute inset-[-10px] rounded-full border border-custom-midnightGreen/30 shadow-2xl z-0 transition-transform duration-700 group-hover:scale-105"></div>
            <div className="absolute inset-[-25px] rounded-full border border-custom-carrotOrange/10 z-0 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12"></div>
            
            <img 
              src={avatarImg} 
              alt="Prince Gajera" 
              className="w-full h-full object-cover rounded-full z-10 shadow-2xl brightness-95 contrast-105 filter group-hover:brightness-100 transition-all duration-500"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
