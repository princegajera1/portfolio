"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { usePortfolioData, Experience as ExperienceType } from "@/context/PortfolioDataContext";
import { Calendar } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const getYear = (periodStr: string) => {
  if (!periodStr) return "";
  const match = periodStr.match(/\b\d{4}\b/g);
  if (match && match.length > 0) {
    return match[match.length - 1];
  }
  const parts = periodStr.split(/[-–]/);
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1].trim();
    const words = lastPart.split(/\s+/);
    return words[words.length - 1] || periodStr;
  }
  return periodStr;
};

const Experience: React.FC = () => {
  const { portfolioData } = usePortfolioData();
  const experiences = useMemo(() => portfolioData?.experience || [], [portfolioData?.experience]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = lineRef.current;
    const timeline = timelineRef.current;
    if (!path || !timeline || experiences.length === 0) return;

    // 1. Dynamically size SVG path to height of the container
    const resizeObserver = new ResizeObserver(() => {
      const height = timeline.offsetHeight;
      path.setAttribute("d", `M 2 0 L 2 ${height}`);

      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    resizeObserver.observe(timeline);

    // 2. Draw SVG line on ScrollTrigger Scrub
    const drawTween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: timeline,
        start: "top 30%",
        end: "bottom 80%",
        scrub: 0.5,
      },
    });

    // 3. Alternate Left/Right Entrance Reveals
    gsap.utils.toArray<HTMLElement>(".experience-reveal-item").forEach((item, index) => {
      const isLeft = index % 2 === 0;

      gsap.fromTo(
        item,
        {
          opacity: 0,
          x: isLeft ? -40 : 40,
          y: 20,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        }
      );
    });

    return () => {
      resizeObserver.disconnect();
      if (drawTween.scrollTrigger) drawTween.scrollTrigger.kill();
      drawTween.kill();
    };
  }, [experiences]);

  if (!portfolioData) {
    return (
      <section id="experience" ref={sectionRef} className="pt-8 pb-8 relative bg-transparent min-h-[400px] flex items-center justify-center">
        <div className="text-white font-mono">Loading Experience...</div>
      </section>
    );
  }

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="pt-8 pb-8 relative bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-black mb-4 flex items-center justify-center text-white w-full">
            <div className="h-[1px] bg-white/10 flex-grow mr-6 hidden sm:block"></div>
            <span className="text-[#00f0ff] font-mono font-bold mr-3 text-lg sm:text-xl">04.</span>
            Experience
            <div className="h-[1px] bg-white/10 flex-grow ml-6 hidden sm:block"></div>
          </h2>
          <p className="text-gray-400 max-w-xl text-sm sm:text-base leading-relaxed font-light mx-auto">
            My career and engineering milestones, working within agile tech teams and building modern products.
          </p>
        </div>

        {/* Timeline container */}
        <div ref={timelineRef} className="max-w-4xl mx-auto relative mt-20 pb-4">
          {/* Vertical Dynamic SVG Timeline Path */}
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[4px] -translate-x-1/2 z-0">
            <svg className="w-full h-full" fill="none" preserveAspectRatio="none">
              <path
                ref={lineRef}
                stroke="url(#timelineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="timelineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Timeline Items */}
          {experiences.map((job, index) => {
            const isLeft = index % 2 === 0;
            const themeColors = [
              {
                ring: "border-[#00f0ff]",
                glow: "from-[#00f0ff]/10",
                text: "text-[#00f0ff]",
                shadow: "shadow-[#00f0ff]/10",
              },
              {
                ring: "border-[#6366f1]",
                glow: "from-[#6366f1]/10",
                text: "text-[#6366f1]",
                shadow: "shadow-[#6366f1]/10",
              },
            ];
            const theme = themeColors[index % 2];

            return (
              <div
                key={job.id}
                className={`experience-reveal-item relative flex flex-col md:flex-row gap-8 md:gap-16 opacity-0 select-none ${
                  index === experiences.length - 1 ? "mb-0" : "mb-20"
                } ${isLeft ? "md:flex-row-reverse" : ""}`}
              >
                {/* Center dot anchor */}
                <div
                  className={`absolute left-[39px] md:left-1/2 top-[48px] md:top-[56px] -translate-x-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-[#0a0a0f] border-4 ${theme.ring} z-10 ${theme.shadow} shadow-lg`}
                />

                {/* Left Side: Period year tag */}
                <div className={`hidden md:flex md:w-1/2 items-center ${isLeft ? "justify-start pl-8" : "justify-end pr-8"}`}>
                  <span className="font-heading font-black text-6xl text-white/[0.02] tracking-wider select-none">
                    {getYear(job.period)}
                  </span>
                </div>

                {/* Right Side: Glass Content Box */}
                <div className="w-full md:w-1/2 pl-[70px] md:pl-0">
                  <div className="glass p-6 sm:p-8 rounded-2xl relative overflow-hidden group hover:border-[#6366f1]/30 transition-all duration-500 hover:-translate-y-1 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                    {/* Corner gradient shade */}
                    <div
                      className={`absolute top-0 ${
                        isLeft ? "left-0" : "right-0"
                      } w-32 h-32 bg-gradient-to-br ${
                        theme.glow
                      } to-transparent z-0 opacity-40 group-hover:scale-125 transition-transform duration-700 pointer-events-none`}
                    />

                    <div className="flex items-center gap-4 mb-5 relative z-10">
                      <div
                        className={`w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center font-heading font-black text-sm ${theme.text} shrink-0`}
                      >
                        {job.initials}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-white text-lg sm:text-xl group-hover:text-[#00f0ff] transition-colors duration-300">
                          {job.role}
                        </h3>
                        <p className="text-gray-300 text-sm font-semibold">{job.company}</p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-lg text-xs font-mono text-gray-400 mb-6 relative z-10">
                      <Calendar size={12} className={theme.text} />
                      <span>{job.period}</span>
                    </div>

                    <ul className="space-y-3 relative z-10 font-sans font-light text-xs sm:text-sm text-gray-400">
                      {job.description.map((desc, i) => (
                        <li key={i} className="flex items-start gap-2.5 leading-relaxed hover:text-gray-300 transition-colors">
                          <span className={`${theme.text} mt-1`}>▹</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
