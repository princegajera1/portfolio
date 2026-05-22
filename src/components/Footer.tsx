"use client";

import React from "react";
import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioDataContext";

const Footer: React.FC = () => {
  const { portfolioData } = usePortfolioData();

  if (!portfolioData) return null;

  const { contact, hero } = portfolioData;

  const name = hero?.name || "Gajera Prince";
  const email = contact?.email || "princegajera.dev@gmail.com";
  const github = contact?.github || "https://github.com/princegajera1";
  const linkedin = contact?.linkedin || "https://www.linkedin.com/in/gajera-prince/";
  const twitter = contact?.twitter || "https://twitter.com/princegajera1";

  return (
    <footer className="relative bg-transparent pt-12 pb-6 z-10 overflow-hidden border-t border-white/[0.05]">
      {/* Dynamic Bright Border Accent at the top of the footer */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00f0ff] via-[#6366f1] to-[#8b5cf6]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative text-center">
        {/* Glow behind icons */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-32 bg-[#6366f1]/5 blur-[80px] rounded-full pointer-events-none"></div>

        {/* Social Icons with premium styling */}
        <div className="flex space-x-6 mb-8 relative z-10">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/5 rounded-full ring-1 ring-white/10 text-gray-300 hover:text-[#6366f1] hover:bg-white/10 hover:ring-[#6366f1]/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              aria-label="GitHub"
            >
              <Github size={20} strokeWidth={1.5} />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/5 rounded-full ring-1 ring-white/10 text-gray-300 hover:text-[#0A66C2] hover:bg-white/10 hover:ring-[#0A66C2]/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(10,102,194,0.3)]"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} strokeWidth={1.5} />
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/5 rounded-full ring-1 ring-white/10 text-gray-300 hover:text-[#1DA1F2] hover:bg-white/10 hover:ring-[#1DA1F2]/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(29,161,242,0.3)]"
              aria-label="Twitter"
            >
              <Twitter size={20} strokeWidth={1.5} />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="p-3 bg-white/5 rounded-full ring-1 ring-white/10 text-gray-300 hover:text-[#6366f1] hover:bg-white/10 hover:ring-[#6366f1]/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              aria-label="Email"
            >
              <Mail size={20} strokeWidth={1.5} />
            </a>
          )}
        </div>

        {/* Designed & Built Label */}
        <p className="text-gray-300 text-base flex flex-wrap items-center justify-center gap-2 mb-3 font-light">
          Engineered & Designed with{" "}
          <Heart size={16} className="text-[#6366f1] animate-pulse" fill="currentColor" /> by{" "}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#6366f1] tracking-wide font-heading">
            {name}
          </span>
        </p>

        {/* Clear Copyright Year */}
        <p className="text-gray-500 text-xs font-mono mb-6 tracking-wider uppercase">
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </p>

        {/* Highly Visible Tech Stack Badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-gray-400 text-[11px] font-mono px-5 py-2 rounded-full bg-black/40 border border-white/5">
          <span className="hover:text-[#8b5cf6] transition-colors">React</span>
          <span className="w-1 h-1 rounded-full bg-[#00f0ff]"></span>
          <span className="hover:text-[#8b5cf6] transition-colors">Next.js</span>
          <span className="w-1 h-1 rounded-full bg-[#00f0ff]"></span>
          <span className="hover:text-[#8b5cf6] transition-colors">Prisma + SQLite</span>
          <span className="w-1 h-1 rounded-full bg-[#00f0ff]"></span>
          <span className="hover:text-[#8b5cf6] transition-colors">TailwindCSS</span>
          <span className="w-1 h-1 rounded-full bg-[#00f0ff]"></span>
          <span className="hover:text-[#8b5cf6] transition-colors">GSAP</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
