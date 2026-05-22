"use client";

import React, { useEffect, useRef, useState } from "react";
import { Github, Globe, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePortfolioData, Project } from "@/context/PortfolioDataContext";
import { ProjectModal } from "./ProjectModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectCardProps {
  project: Project;
  index: number;
  inCarousel?: boolean;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, inCarousel = false, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Stagger grid reveal from bottom on load/scroll
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`group glass rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-[350px] relative overflow-hidden border border-white/5 hover:border-[#00f0ff]/30 transition-all duration-500 hover:-translate-y-2.5 hover:shadow-[0_20px_50px_rgba(0,240,255,0.08)] bg-gradient-to-br from-white/[0.02] to-white/[0.005] select-none cursor-pointer shrink-0 ${
        inCarousel ? "w-[320px] sm:w-[380px]" : "w-full"
      }`}
    >
      {/* Top Accent Glowing Border Line */}
      <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-[#00f0ff] via-[#8b5cf6] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />

      {/* Liquid Clip-Path Hover Expansion (Semi-transparent Glow) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 to-[#00f0ff]/5 opacity-0 group-hover:opacity-100 z-0 transition-all duration-700 pointer-events-none rounded-2xl"
        style={{
          clipPath: "circle(0% at 100% 0%)",
          transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease",
        }}
        id={`overlay-${project.id}`}
      />
      <style>{`
        .group:hover #overlay-${project.id} {
          clip-path: circle(150% at 100% 0%);
        }
      `}</style>

      {/* Header Info */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-heading font-black text-sm text-[#00f0ff] group-hover:text-white group-hover:bg-[#8b5cf6]/20 group-hover:border-[#8b5cf6]/30 transition-all duration-300">
              {project.featured ? (
                <Star size={14} className="fill-[#00f0ff] text-[#00f0ff] group-hover:fill-white group-hover:text-white transition-colors" />
              ) : (
                project.title.charAt(0)
              )}
            </div>
            {project.featured && (
              <span className="text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff]">
                FEATURED
              </span>
            )}
          </div>

          {/* Action buttons (relative z-20 to prevent overlay overlap blocking clicks) */}
          <div className="flex gap-2 relative z-20" onClick={(e) => e.stopPropagation()}>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]/30 transition-all duration-300"
                title="View Source Code"
              >
                <Github size={14} />
              </a>
            )}
            {project.demo && project.demo !== "#" && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#8b5cf6] hover:bg-[#8b5cf6]/10 hover:border-[#8b5cf6]/30 transition-all duration-300"
                title="View Live Demo"
              >
                <Globe size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3 group-hover:text-[#00f0ff] transition-colors duration-300 tracking-tight">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-light mb-6 group-hover:text-gray-200 transition-colors duration-300 line-clamp-4 font-sans">
          {project.description}
        </p>
      </div>

      {/* Tech Tags */}
      <div className="relative z-10 pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors">
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/5 text-[10px] font-mono font-medium text-gray-400 group-hover:text-[#00f0ff] group-hover:bg-[#00f0ff]/5 group-hover:border-[#00f0ff]/20 transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const { portfolioData } = usePortfolioData();
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Desktop drag-to-scroll refs
  const isDraggingCard = useRef(false);
  const startDragX = useRef(0);
  const startScrollLeft = useRef(0);

  // Filter only featured projects for home display (limit to 6 for premium presentation)
  const featuredProjects = portfolioData ? portfolioData.projects.filter((p) => p.featured).slice(0, 6) : [];

  const handleContainerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("a") || (e.target as HTMLElement).closest("button")) return;
    if (!scrollWrapperRef.current) return;
    isDraggingCard.current = true;
    startDragX.current = e.pageX - scrollWrapperRef.current.offsetLeft;
    startScrollLeft.current = scrollWrapperRef.current.scrollLeft;
  };

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingCard.current || !scrollWrapperRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollWrapperRef.current.offsetLeft;
    const walk = (x - startDragX.current) * 1.5;
    scrollWrapperRef.current.scrollLeft = startScrollLeft.current - walk;
  };

  const handleContainerMouseUpOrLeave = () => {
    isDraggingCard.current = false;
  };

  const [numDots, setNumDots] = useState(featuredProjects.length || 1);

  useEffect(() => {
    if (featuredProjects.length === 0) return;
    
    const updateDots = () => {
      const wrapper = scrollWrapperRef.current;
      if (!wrapper) return;
      const card = wrapper.querySelector(".group") as HTMLElement | null;
      const cardWidth = card ? card.offsetWidth : 380;
      const gap = 24;
      const step = cardWidth + gap;
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
      if (maxScroll <= 0) {
        setNumDots(1);
        return;
      }
      const steps = Math.ceil(maxScroll / step);
      setNumDots(steps + 1);
    };

    updateDots();
    window.addEventListener("resize", updateDots);
    const timer = setTimeout(updateDots, 500);

    return () => {
      window.removeEventListener("resize", updateDots);
      clearTimeout(timer);
    };
  }, [featuredProjects.length]);

  // Sync scroll position to calculate active dot
  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    if (!wrapper || featuredProjects.length === 0) return;

    const handleScrollEvent = () => {
      const scrollLeft = wrapper.scrollLeft;
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
      
      let index = 0;
      if (maxScroll > 0) {
        const percentage = scrollLeft / maxScroll;
        index = Math.round(percentage * (numDots - 1));
      }
      setActiveIndex(Math.max(0, Math.min(index, numDots - 1)));
    };

    wrapper.addEventListener("scroll", handleScrollEvent);
    handleScrollEvent();
    return () => {
      wrapper.removeEventListener("scroll", handleScrollEvent);
    };
  }, [featuredProjects.length, numDots]);

  const handleDotClick = (index: number) => {
    const wrapper = scrollWrapperRef.current;
    if (!wrapper) return;
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
    
    let targetScroll = 0;
    if (numDots > 1) {
      targetScroll = (index / (numDots - 1)) * maxScroll;
    }

    wrapper.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  if (!portfolioData) {
    return (
      <div id="projects" className="pt-8 pb-12 bg-transparent relative overflow-hidden flex items-center justify-center min-h-[400px]">
        <div className="text-white font-mono">Loading Projects...</div>
      </div>
    );
  }

  return (
    <div
      ref={triggerRef}
      id="projects"
      className="pt-8 pb-12 bg-transparent relative overflow-hidden"
    >
      {/* Background light shapes */}
      <div className="absolute top-[30%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#8b5cf6]/5 blur-[150px] pointer-events-none" />

      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-heading font-black mb-4 flex items-center text-white">
              <span className="text-[#00f0ff] font-mono font-bold mr-3 text-lg sm:text-xl">03.</span>
              Featured Projects
              <div className="h-[1px] bg-white/10 flex-grow ml-6 hidden sm:block"></div>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-light font-sans">
              A meticulously engineered selection of full-stack platforms and utilities built with scale in mind.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#8b5cf6] hover:text-white uppercase transition-colors group"
          >
            <span>View All Projects</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative w-full max-w-[1400px] mx-auto px-4 hidden lg:block">
        {/* Desktop Horizontal Scroll Layout */}
        <div
          ref={scrollWrapperRef}
          onMouseDown={handleContainerMouseDown}
          onMouseMove={handleContainerMouseMove}
          onMouseUp={handleContainerMouseUpOrLeave}
          onMouseLeave={handleContainerMouseUpOrLeave}
          className="w-full overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none"
        >
          <div
            ref={scrollContainerRef}
            className="flex gap-6 px-6 lg:px-8 pb-12 w-max pointer-events-auto"
          >
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                inCarousel={true}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>

        {/* Dot Pagination Navigation Indicator */}
        <div className="flex justify-center items-center gap-3 mt-4">
          {Array.from({ length: numDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === index
                  ? "w-8 bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Mobile/Tablet Adaptive Grid Layout */}
      <div className="lg:hidden px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project, index) => (
            <div key={project.id} className="w-full flex justify-center">
              <ProjectCard
                project={project}
                index={index}
                inCarousel={false}
                onClick={() => setSelectedProject(project)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal Component */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default Projects;
