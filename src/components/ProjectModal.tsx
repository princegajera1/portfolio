"use client";

import React from "react";
import { X, Github, Globe, Star } from "lucide-react";
import { Project } from "@/context/PortfolioDataContext";
import { ReactLenis } from "@studio-freight/react-lenis";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full max-w-4xl h-[85vh] md:h-[80vh] glass rounded-3xl border border-white/10 bg-[#0a0a0f]/95 overflow-hidden flex flex-col z-10 shadow-[0_0_50px_rgba(0,240,255,0.15)]"
        >
          {/* Top colored accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00f0ff] via-[#6366f1] to-[#8b5cf6]" />

          {/* Close button in top right */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-50 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Smooth Scrollable content using Lenis */}
          <div className="flex-grow overflow-hidden h-full">
            <ReactLenis
              options={{
                lerp: 0.08,
                duration: 1.2,
                smoothWheel: true,
              }}
              className="h-full overflow-y-auto"
            >
              <div className="p-8 sm:p-10 md:p-12 space-y-8">
                {/* Header Section */}
                <div className="space-y-4 pr-12">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-md bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[10px] font-mono text-[#00f0ff] uppercase tracking-wider font-bold">
                      Project Details
                    </span>
                    {project.featured && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[10px] font-mono text-[#8b5cf6] uppercase tracking-wider font-bold">
                        <Star size={10} fill="currentColor" /> Featured
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white tracking-tight leading-none text-gradient">
                    {project.title}
                  </h2>
                </div>

                {/* Project Image / Visual Placeholder */}
                <div className="relative w-full h-[200px] sm:h-[320px] rounded-2xl border border-white/5 overflow-hidden bg-white/[0.01]">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#120e2e]/40 to-[#080811]/40 p-8 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
                      {/* Floating orb inside image space */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#6366f1]/5 blur-[80px]" />
                      <span className="font-heading font-black text-8xl md:text-9xl text-white/[0.03] select-none uppercase tracking-widest relative z-10">
                        {project.title.substring(0, 2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Grid info */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12">
                  {/* Left Column: Description */}
                  <div className="md:col-span-8 space-y-6">
                    <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider">
                      Overview
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light font-sans whitespace-pre-line">
                      {project.description}
                    </p>
                  </div>

                  {/* Right Column: Meta info */}
                  <div className="md:col-span-4 space-y-8">
                    {/* Tech pills */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-gray-400 uppercase">
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs font-mono text-[#00f0ff] shadow-sm hover:border-[#00f0ff]/30 transition-all duration-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-gray-400 uppercase">
                        Links
                      </h3>
                      <div className="flex flex-col gap-3">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-heading font-bold text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 w-full"
                          >
                            <Github size={16} />
                            <span>GitHub Source</span>
                          </a>
                        )}
                        {project.demo && project.demo !== "#" ? (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#00f0ff] border border-[#00f0ff] text-sm font-heading font-bold text-[#0a0a0f] hover:bg-white hover:border-white transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-white/20 w-full"
                          >
                            <Globe size={16} />
                            <span>Live Preview</span>
                          </a>
                        ) : (
                          <span className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm font-mono text-gray-500 w-full select-none">
                            No Live Demo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ReactLenis>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;
