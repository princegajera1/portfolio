"use client";

import React, { useEffect, useRef } from "react";
import { MapPin, Briefcase, GraduationCap, Award } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { TechMarquee } from "./TechMarquee";
import { calculateTotalExperience } from "@/utils/experienceCalc";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const About: React.FC = () => {
  const { portfolioData } = usePortfolioData();
  const sectionRef = useRef<HTMLDivElement>(null);
  const clipContainerRef = useRef<HTMLDivElement>(null);
  const expValRef = useRef<HTMLParagraphElement>(null);
  const projValRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!portfolioData) return;

    // 1. Clip path wipe reveal transition from left
    if (clipContainerRef.current) {
      gsap.fromTo(
        clipContainerRef.current,
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: false,
          },
        }
      );
    }

    // 2. Parallax About image movement (moves at 0.5x speed)
    gsap.to(".about-parallax-img", {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // 3. Stats Counter Animation using standard GSAP interpolation on ScrollTrigger
    const parseNumber = (val: string) => parseInt(val.replace(/\D/g, ""), 10) || 0;
    const calculatedExp = calculateTotalExperience(portfolioData.experience);
    const isYears = calculatedExp.label === "Exp Years";
    const targetExp = parseFloat(calculatedExp.value.replace("+", "")) || 0;
    const targetProj = parseNumber(portfolioData.about.projectsDone);

    const countObj = { exp: 0, proj: 0 };

    gsap.to(countObj, {
      exp: targetExp,
      proj: targetProj,
      duration: 2.0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#about-stats-container",
        start: "top 85%",
        once: true,
      },
      onUpdate: () => {
        if (expValRef.current) {
          const currentExpVal = isYears
            ? (countObj.exp % 1 === 0 ? countObj.exp.toFixed(0) : countObj.exp.toFixed(1))
            : Math.floor(countObj.exp).toString();
          expValRef.current.textContent = `${currentExpVal}+`;
        }
        if (projValRef.current) projValRef.current.textContent = `${Math.floor(countObj.proj)}+`;
      },
    });

    // Stagger slide elements inside About content
    gsap.fromTo(
      ".about-reveal-el",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-grid-content",
          start: "top 75%",
        },
      }
    );
  }, [portfolioData]);

  if (!portfolioData) return null;

  const avatarLink = portfolioData.about.avatarUrl || "/avatar.png";

  return (
    <section
      id="about"
      ref={sectionRef}
      className="pt-24 pb-0 relative bg-transparent overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-[10%] left-[-5%] w-[35%] h-[35%] rounded-full bg-[#6366f1]/5 blur-[120px] pointer-events-none" />

      {/* Styled Inner Container with Custom Clip Wipes */}
      <div
        ref={clipContainerRef}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-black mb-4 flex items-center text-white">
            <span className="text-[#00f0ff] font-mono font-bold mr-3 text-lg sm:text-xl">01.</span>
            About Me
            <div className="h-[1px] bg-white/10 flex-grow ml-6"></div>
          </h2>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start about-grid-content">
          {/* Left Side: Animated profile photo with glowing border ring */}
          <div className="lg:col-span-5 flex justify-center relative group about-reveal-el opacity-0">
            <div className="relative w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] rounded-2xl overflow-hidden shadow-2xl p-2.5 bg-white/[0.02] border border-white/10 group-hover:border-[#6366f1]/40 transition-colors duration-500">
              {/* Outer pulsing ring in cards */}
              <div className="absolute inset-[-4px] rounded-2xl border border-[#00f0ff]/20 animate-pulse pointer-events-none" />
              <div className="absolute inset-[-12px] rounded-2xl border border-[#8b5cf6]/10 animate-pulse pointer-events-none [animation-delay:1s]" />

              <div className="w-full h-[120%] overflow-hidden rounded-xl relative">
                <img
                  src={avatarLink}
                  alt="Gajera Prince Profile"
                  className="w-full h-full object-cover about-parallax-img absolute bottom-[-15%] filter grayscale hover:grayscale-0 contrast-105 duration-700 transition-all scale-[1.08]"
                />
                {/* Visual Glass gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent opacity-80" />
              </div>

              {/* Corner tech indicators */}
              <div className="absolute bottom-6 left-6 right-6 z-20 glass p-4 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                <span className="font-mono text-[10px] text-gray-300 uppercase tracking-widest font-bold">
                  B.E. Computer Engineering @ GTU
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Bio text & interactive details */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-gray-400 about-reveal-el opacity-0">
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
              Engineering web architectures with precision, focus & speed.
            </h3>

            <p className="text-sm sm:text-base leading-relaxed font-light font-sans">
              {portfolioData.about.bio}
            </p>

            <blockquote className="border-l-2 border-[#00f0ff] pl-4 py-1.5 italic font-light text-gray-300 bg-white/[0.01] rounded-r-lg text-sm sm:text-base leading-relaxed">
              &quot;I craft responsive backends in Node and high-fidelity frontends in React. My focus is delivering production-ready, beautiful user experiences.&quot;
            </blockquote>

            {/* Timed Counter Stats Group */}
            <div
              id="about-stats-container"
              className="grid grid-cols-3 gap-4 py-6 border-y border-white/5 font-heading select-none mt-4"
            >
              <div>
                <p
                  ref={projValRef}
                  className="text-3xl sm:text-4xl font-black text-white text-gradient"
                >
                  0+
                </p>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">PROJECTS DONE</p>
              </div>
              <div>
                <p
                  ref={expValRef}
                  className="text-3xl sm:text-4xl font-black text-white text-gradient"
                >
                  0+
                </p>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">
                  {calculateTotalExperience(portfolioData.experience).label}
                </p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-[#8b5cf6] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#8b5cf6] to-[#a855f7]">
                  {portfolioData.contact?.location ? portfolioData.contact.location.split(",")[0].trim() : "Ahmedabad"}
                </p>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">LOCATION</p>
              </div>
            </div>

            {/* Quick Education Timeline */}
            <div className="pt-4">
              <h4 className="text-xs font-mono font-bold tracking-[0.25em] text-[#8b5cf6] uppercase mb-4">
                Education & Achievements
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl border border-white/5 hover:border-[#00f0ff]/20 transition-all duration-300 flex gap-3.5 items-start">
                  <GraduationCap className="text-[#00f0ff] shrink-0 mt-0.5" size={20} />
                  <div>
                    <h5 className="font-heading font-bold text-white text-sm">B.E. Computer Engineering</h5>
                    <p className="text-[10px] font-mono text-gray-500 uppercase mt-0.5">GTU | 2023 - 2027</p>
                  </div>
                </div>
                <div className="glass p-4 rounded-xl border border-white/5 hover:border-[#8b5cf6]/20 transition-all duration-300 flex gap-3.5 items-start">
                  <Award className="text-[#8b5cf6] shrink-0 mt-0.5" size={20} />
                  <div>
                    <h5 className="font-heading font-bold text-white text-sm">Generative AI Specialist</h5>
                    <p className="text-[10px] font-mono text-gray-500 uppercase mt-0.5">Prompt Engineering & LLMs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continuous horizontal scrolling tech stack pills (infinite marquee) */}
      <TechMarquee techPills={portfolioData.about.techPills} />
    </section>
  );
};

export default About;
