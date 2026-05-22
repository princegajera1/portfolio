"use client";

import React, { useEffect, useRef } from "react";
import { ArrowDown, Code, Sparkles, Terminal, FileText } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { splitTextIntoSpans, makeMagnetic } from "@/utils/gsapHelpers";
import { useLenis } from "@studio-freight/react-lenis";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { calculateTotalExperience } from "@/utils/experienceCalc";

if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin, ScrollTrigger);
}

const Hero3DBackground = dynamic(() => import("./Hero3DBackground"), {
  ssr: false,
});

const Hero: React.FC = () => {
  const { portfolioData } = usePortfolioData();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const bgParallaxRef = useRef<HTMLDivElement>(null);
  const btnWorkRef = useRef<HTMLButtonElement>(null);
  const btnResumeRef = useRef<HTMLAnchorElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!portfolioData) return;

    // 1. Split Text Letter-by-Letter Reveal
    if (titleRef.current) {
      const chars = splitTextIntoSpans(titleRef.current);
      gsap.fromTo(
        chars,
        { opacity: 0, y: 50, rotateX: -30 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.04, duration: 1.0, ease: "back.out(1.7)", delay: 0.3 }
      );
    }

    // 2. Section entrance scale reveal: scale(1.1) -> scale(1)
    gsap.fromTo(
      ".hero-content-wrapper",
      { scale: 1.06, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "power4.out" }
    );

    // 3. Subtitle Typewriter Effect using GSAP TextPlugin
    if (subtitleRef.current) {
      const words = portfolioData.hero.subtitleText.split(",").map((s) => s.trim());
      const typeTimeline = gsap.timeline({ repeat: -1 });

      words.forEach((word) => {
        typeTimeline
          .to(subtitleRef.current, {
            text: word,
            duration: 1.4,
            ease: "none",
            delay: 0.4,
          })
          .to(subtitleRef.current, {
            duration: 1.5, // Static pause
          })
          .to(subtitleRef.current, {
            text: "",
            duration: 0.6,
            ease: "none",
          });
      });
    }

    // 4. Orbiting floating tech icons slow rotate
    gsap.to(".tech-orbit-react", {
      rotation: 360,
      duration: 25,
      repeat: -1,
      ease: "none",
    });
    gsap.to(".tech-orbit-node", {
      rotation: -360,
      duration: 35,
      repeat: -1,
      ease: "none",
    });
    gsap.to(".tech-orbit-js", {
      rotation: 360,
      duration: 45,
      repeat: -1,
      ease: "none",
    });

    // 5. Floating geometric shapes in background
    gsap.utils.toArray<HTMLElement>(".floating-shape").forEach((shape) => {
      gsap.to(shape, {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        rotation: "random(-180, 180)",
        duration: "random(5, 8)",
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    // 6. Parallax Background Scroll (moves 0.2x)
    if (bgParallaxRef.current) {
      gsap.to(bgParallaxRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Floating pulsing ring around photo
    gsap.to(".avatar-glowing-ring", {
      scale: 1.08,
      duration: 3.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
 
    const cleanupWork = makeMagnetic(btnWorkRef.current, 0.2);
    const cleanupResume = makeMagnetic(btnResumeRef.current, 0.2);
 
    return () => {
      if (cleanupWork) cleanupWork();
      if (cleanupResume) cleanupResume();
    };
  }, [portfolioData]);

  const handleViewWork = () => {
    const element = document.getElementById("projects");
    if (element) {
      if (lenis) {
        lenis.scrollTo(element, { offset: -80, duration: 1.4 });
      } else {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth",
        });
      }
    }
  };

  if (!portfolioData) return null;

  const resumeLink = portfolioData.hero.resumeUrl || "/resume.jpg";
  const avatarLink = portfolioData.about.avatarUrl || "/avatar.png";

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center pt-28 pb-16 relative overflow-hidden bg-transparent z-10"
    >
      {/* 3D R3F Particle Background */}
      <Hero3DBackground />

      {/* Parallax Ambient Orb */}
      <div
        ref={bgParallaxRef}
        className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-[#8b5cf6]/10 blur-[130px] top-[10%] right-[5%] z-0 pointer-events-none"
      />
      <div className="absolute w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-[#00f0ff]/8 blur-[130px] bottom-[15%] left-[5%] z-0 pointer-events-none" />

      {/* Scattered Floating Geometric Shapes */}
      <div className="absolute top-[20%] left-[15%] w-3 h-3 border border-white/20 rounded-full floating-shape pointer-events-none" />
      <div className="absolute top-[65%] left-[45%] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white/10 floating-shape pointer-events-none" />
      <div className="absolute top-[35%] right-[40%] w-2 h-2 bg-white/10 rounded-sm floating-shape pointer-events-none" />
      <div className="absolute bottom-[25%] right-[20%] w-4 h-4 border border-[#8b5cf6]/30 rounded-full floating-shape pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 hero-content-wrapper opacity-0">
        {/* Left: Text & CTA Content */}
        <div className="w-full lg:w-3/5 flex flex-col justify-center text-left">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 w-fit mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
            <span className="text-[10px] font-mono text-gray-400 tracking-[0.25em] uppercase font-bold">
              Available for Freelance & Internships
            </span>
          </div>

          {/* Core Headline SplitText */}
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-7xl font-heading font-black tracking-tight mb-4 text-white leading-[1.08] perspective-1000"
          >
            {portfolioData.hero.title}
          </h1>

          {/* Typewriter Subtitle */}
          <div className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white/80 mb-6 flex items-center gap-2">
            <span className="text-gray-500 font-light">I&apos;m a</span>
            <span ref={subtitleRef} className="text-[#00f0ff] relative drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              {/* GSAP TextPlugin replaces this dynamically */}
            </span>
            <span className="w-[3px] h-[1.1em] bg-[#00f0ff] inline-block animate-blink"></span>
          </div>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-10 max-w-xl leading-relaxed font-sans font-light">
            Crafting state-of-the-art web architectures with robust backends and premium Awwwards-standard interactions. Specializing in React, Next.js, Node, and Generative AI pipelines.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-12 sm:items-center">
            <button
              ref={btnWorkRef}
              onClick={handleViewWork}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#6366f1] text-[#0a0a0f] font-heading font-bold text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-300 flex items-center justify-center gap-3 relative group"
            >
              <span>View My Work</span>
              <Sparkles size={16} className="text-[#0a0a0f]" />
            </button>
 
            <a
              ref={btnResumeRef}
              href={resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-transparent border border-white/10 text-white font-heading font-bold text-sm uppercase tracking-wider hover:bg-white/5 hover:border-white/30 transition-all duration-300 text-center flex items-center justify-center gap-2.5 group"
            >
              <Terminal size={16} className="text-[#8b5cf6]" />
              <span>Download Resume</span>
              <FileText size={16} className="text-white/60 group-hover:text-[#00f0ff] transition-colors" />
            </a>
          </div>

          {/* Tiny Fast Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg border-t border-white/5 pt-8 text-left font-mono">
            <div>
              <p className="text-2xl font-bold text-white">{portfolioData.about.projectsDone}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Projects Done</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {calculateTotalExperience(portfolioData.experience).value}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                {calculateTotalExperience(portfolioData.experience).label}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#8b5cf6]">Ahmedabad</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Location</p>
            </div>
          </div>
        </div>

        {/* Right: Premium Pulsing Avatar + Orbiting Tech Icons */}
        <div className="w-full lg:w-2/5 flex justify-center items-center relative py-12">
          <div
            ref={photoContainerRef}
            className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] flex items-center justify-center"
          >
            {/* Glowing blur orb */}
            <div className="absolute inset-0 bg-[#00f0ff]/10 rounded-full blur-[80px] z-0" />

            {/* Pulsing Concentric Glowing Rings */}
            <div className="absolute inset-[-12px] rounded-full border border-[#00f0ff]/20 z-0 avatar-glowing-ring" />
            <div className="absolute inset-[-24px] rounded-full border border-[#8b5cf6]/10 z-0 avatar-glowing-ring [animation-delay:1.5s]" />

            {/* Profile Avatar Image */}
            <div className="w-full h-full rounded-full border border-white/10 p-2 overflow-hidden bg-white/[0.02] z-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <img
                src={avatarLink}
                alt="Gajera Prince"
                className="w-full h-full object-cover rounded-full filter grayscale-[30%] contrast-[105%] transition-all duration-700 hover:scale-[1.02]"
              />
            </div>

            {/* Orbiting tech icon badges */}
            {/* React Icon */}
            <div className="absolute -top-3 left-4 w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0a0a0f] to-[#12121e] border border-white/10 z-20 flex items-center justify-center shadow-2xl pointer-events-none select-none animate-float">
              <svg className="w-6 h-6 tech-orbit-react fill-transparent stroke-[#00f0ff]" viewBox="0 0 24 24" strokeWidth="1.5">
                <circle cx="12" cy="12" r="2" />
                <ellipse rx="10" ry="4" transform="translate(12 12) rotate(0)" />
                <ellipse rx="10" ry="4" transform="translate(12 12) rotate(60)" />
                <ellipse rx="10" ry="4" transform="translate(12 12) rotate(120)" />
              </svg>
            </div>

            {/* Node Icon */}
            <div className="absolute bottom-6 -left-6 w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0a0a0f] to-[#12121e] border border-white/10 z-20 flex items-center justify-center shadow-2xl pointer-events-none select-none animate-float-delayed">
              <span className="font-heading font-black text-xs text-[#8b5cf6] tech-orbit-node">JS</span>
            </div>

            {/* JS / Code Icon */}
            <div className="absolute top-1/3 -right-6 w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0a0a0f] to-[#12121e] border border-white/10 z-20 flex items-center justify-center shadow-2xl pointer-events-none select-none animate-float">
              <Terminal className="w-5 h-5 text-[#00f0ff] tech-orbit-js" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
