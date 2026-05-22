"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { Layers, Terminal, Wrench } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillCircleProps {
  name: string;
  level: number;
  categoryColor: string;
}

const SkillCircle: React.FC<SkillCircleProps> = ({ name, level, categoryColor }) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - level / 100);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Animate circular progress rings on scroll
      if (circleRef.current) {
        gsap.fromTo(
          circleRef.current,
          { strokeDashoffset: circumference },
          {
            strokeDashoffset: offset,
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 92%",
              once: true,
            },
          }
        );
      }

      // Animate text level counts
      const levelObj = { val: 0 };
      gsap.to(levelObj, {
        val: level,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 92%",
          once: true,
        },
        onUpdate: () => {
          if (textRef.current) {
            textRef.current.textContent = `${Math.floor(levelObj.val)}%`;
          }
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [level, circumference, offset]);

  // 3D Hover Tilt Effect using GSAP rotateX/Y
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = x - xc;
    const dy = y - yc;

    // Tilt limit to 10 degrees
    const tiltX = (dy / yc) * -10;
    const tiltY = (dx / xc) * 10;

    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 800,
      scale: 1.03,
      borderColor: "rgba(99, 102, 241, 0.3)",
      boxShadow: "0 20px 40px -15px rgba(0, 240, 255, 0.15)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      borderColor: "rgba(255, 255, 255, 0.03)",
      boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.4)",
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 select-none group w-full cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-[#00f0ff]/5 to-[#8b5cf6]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
      />

      {/* SVG Ring Progress */}
      <div
        className="relative w-20 h-20 flex items-center justify-center mb-4 z-10"
        style={{ transform: "translateZ(20px)" }}
      >
        <svg className="w-full h-full transform -rotate-90">
          {/* Base track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="5"
            fill="transparent"
          />
          {/* Active progress */}
          <circle
            ref={circleRef}
            cx="40"
            cy="40"
            r={radius}
            stroke="url(#skillsGrad)"
            strokeWidth="5.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
          />
        </svg>
        {/* Dynamic percentage label inside ring */}
        <span
          ref={textRef}
          className="absolute font-mono font-black text-sm text-white"
        >
          0%
        </span>
      </div>

      {/* Skill name */}
      <h4
        className="font-heading font-bold text-gray-200 group-hover:text-white transition-colors text-sm text-center tracking-wider z-10"
        style={{ transform: "translateZ(10px)" }}
      >
        {name}
      </h4>
    </div>
  );
};

const Skills: React.FC = () => {
  const { portfolioData } = usePortfolioData();
  const [activeTab, setActiveTab] = useState("frontend");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Categorize dynamically
  const categories = [
    { id: "frontend", label: "Frontend", icon: Layers },
    { id: "backend", label: "Backend", icon: Terminal },
    { id: "tools", label: "Tools & Others", icon: Wrench },
  ];

  // Setup tab container slider animation
  useEffect(() => {
    if (!portfolioData) return;
    gsap.fromTo(
      ".skills-grid-container > div",
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          ScrollTrigger.refresh();
        },
      }
    );
  }, [activeTab, portfolioData]);

  if (!portfolioData) {
    return (
      <section id="skills" ref={sectionRef} className="pt-12 pb-8 relative bg-transparent min-h-screen flex items-center justify-center">
        <div className="text-white font-mono">Loading Skills...</div>
      </section>
    );
  }

  // Filter skills matching active tab
  const activeSkills = portfolioData.skills.filter((s) => s.category === activeTab);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="pt-12 pb-8 relative bg-transparent"
    >
      {/* Shared Gradient for Progress Rings */}
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="skillsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-black mb-4 flex items-center text-white">
            <span className="text-[#00f0ff] font-mono font-bold mr-3 text-lg sm:text-xl">02.</span>
            My Tech Stack
            <div className="h-[1px] bg-white/10 flex-grow ml-6"></div>
          </h2>
          <p className="text-gray-400 max-w-xl text-sm sm:text-base leading-relaxed font-light">
            I craft full-stack digital architectures using industry-standard engineering stacks. Toggle categories below to view my competency.
          </p>
        </div>

        {/* Tab Controls with Slider Overlay */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex glass p-1.5 rounded-2xl border border-white/5 relative z-10 select-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300 relative ${
                    activeTab === cat.id
                      ? "bg-gradient-to-r from-[#00f0ff]/10 to-[#8b5cf6]/10 border border-white/10 text-white shadow-xl"
                      : "text-gray-400 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Container */}
        <div className="skills-grid-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {activeSkills.map((skill) => (
            <SkillCircle
              key={skill.id || skill.name}
              name={skill.name}
              level={skill.level}
              categoryColor={
                activeTab === "frontend"
                  ? "#00f0ff"
                  : activeTab === "backend"
                  ? "#6366f1"
                  : "#8b5cf6"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
