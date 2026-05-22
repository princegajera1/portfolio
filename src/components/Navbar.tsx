"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User, Zap, Code, Briefcase, Mail, ShieldAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { scrambleText, makeMagnetic } from "@/utils/gsapHelpers";
import { usePortfolioData } from "@/context/PortfolioDataContext";
import { useLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";

interface ScrambledNavLinkProps {
  label: string;
  active: boolean;
  onClick: () => void;
  className: string;
}

const ScrambledNavLink: React.FC<ScrambledNavLinkProps> = ({ label, active, onClick, className }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Add magnetic pull to desktop navbar links
    if (btnRef.current && window.innerWidth >= 768) {
      const cleanup = makeMagnetic(btnRef.current, 0.2);
      return cleanup;
    }
  }, []);

  const handleMouseEnter = () => {
    if (textRef.current) {
      scrambleText(textRef.current, label, 0.6);
    }
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className={className}
    >
      <span ref={textRef} className="inline-block relative py-1">
        {label}
        <span
          className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-[#00f0ff] to-[#8b5cf6] origin-left transition-transform duration-300 ${
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </span>
    </button>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { portfolioData } = usePortfolioData();
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  
  const navItems = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ];

  const activeId = useScrollSpy(navItems.map((item) => item.id), 120);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set up navbar scroll background GSAP reveal
  useEffect(() => {
    const navBg = document.getElementById("navbar-container");
    if (!navBg) return;
    
    if (scrolled) {
      gsap.to(navBg, {
        backgroundColor: "rgba(10, 10, 15, 0.85)",
        backdropFilter: "blur(16px) saturate(130%)",
        borderBottomColor: "rgba(255, 255, 255, 0.05)",
        paddingTop: "12px",
        paddingBottom: "12px",
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(navBg, {
        backgroundColor: "rgba(10, 10, 15, 0)",
        backdropFilter: "blur(0px) saturate(100%)",
        borderBottomColor: "rgba(255, 255, 255, 0)",
        paddingTop: "20px",
        paddingBottom: "20px",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [scrolled]);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      if (lenis) {
        lenis.scrollTo(element, { offset: -80, duration: 1.4 });
      } else {
        const offset = 80; // Navbar offset
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const offsetPosition = elementRect - bodyRect - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  // Handle hash navigation after page load/hash change
  useEffect(() => {
    if (pathname === "/" && typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          if (lenis) {
            lenis.scrollTo(element, { offset: -80, duration: 1.4 });
          } else {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            window.scrollTo({
              top: elementRect - bodyRect - offset,
              behavior: "smooth",
            });
          }
        }
      }, 200);
    }
  }, [pathname, lenis]);

  // Mobile slide out drawer GSAP animation
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        drawerRef.current,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.6, ease: "power4.out" }
      );
      gsap.fromTo(
        ".mobile-nav-item",
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.25 }
      );
    }
  }, [isOpen]);

  const getIcon = (id: string) => {
    switch (id) {
      case "about":
        return <User size={18} className="mr-3 text-[#8b5cf6]" />;
      case "skills":
        return <Zap size={18} className="mr-3 text-[#00f0ff]" />;
      case "projects":
        return <Code size={18} className="mr-3 text-[#6366f1]" />;
      case "experience":
        return <Briefcase size={18} className="mr-3 text-[#8b5cf6]" />;
      case "contact":
        return <Mail size={18} className="mr-3 text-[#00f0ff]" />;
      default:
        return null;
    }
  };

  const handleLogoClick = () => {
    if (pathname === "/") {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.4 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      router.push("/");
    }
  };

  const logoRef = useRef<HTMLDivElement>(null);

  if (!portfolioData) return null;

  return (
    <nav
      id="navbar-container"
      className="fixed top-0 w-full z-50 transition-all border-b border-transparent py-5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Monogram */}
          <div
            ref={logoRef}
            onClick={handleLogoClick}
            className="flex-shrink-0 cursor-pointer flex items-center gap-3 relative group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-heading font-black text-lg tracking-wider text-white shadow-xl relative overflow-hidden group-hover:border-[#00f0ff]/40 transition-colors duration-300">
              <span className="relative z-10 text-gradient">GP</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00f0ff]/10 to-[#8b5cf6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-heading font-bold text-sm tracking-[0.3em] uppercase text-white/70 group-hover:text-white transition-colors duration-300 hidden sm:inline-block">
              {portfolioData.hero.name}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <ScrambledNavLink
                key={item.id}
                label={item.label}
                active={activeId === item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-[13px] font-heading font-medium tracking-[0.2em] uppercase transition-all duration-300 ${
                  activeId === item.id
                    ? "text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              />
            ))}

            {/* Direct access to Admin Panel inside navbar */}
            <Link
              href="/admin"
              className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 hover:border-red-500/30 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors duration-300"
              title="Admin Dashboard"
            >
              <ShieldAlert size={14} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/admin"
              className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-500 hover:text-red-400"
            >
              <ShieldAlert size={14} />
            </Link>

            <button
              ref={menuBtnRef}
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-lg bg-white/5 border border-white/10"
              aria-label="Toggle Mobile Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-in Mobile Drawer Menu */}
      {isOpen && (
        <div
          ref={drawerRef}
          className="md:hidden fixed top-0 right-0 w-[80vw] sm:w-[60vw] h-screen border-l border-white/10 shadow-2xl bg-[#0a0a0f]/95 backdrop-blur-2xl z-50 flex flex-col p-8 justify-between"
        >
          <div>
            {/* Header in Drawer */}
            <div className="flex justify-between items-center mb-12">
              <div className="font-heading font-black text-xl text-gradient">GP</div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav list */}
            <div className="space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`mobile-nav-item flex items-center w-full text-left px-4 py-3.5 rounded-xl text-sm font-heading font-bold tracking-[0.15em] uppercase transition-all duration-300 ${
                    activeId === item.id
                      ? "bg-gradient-to-r from-[#6366f1]/15 to-transparent text-[#00f0ff] border-l-2 border-l-[#00f0ff]"
                      : "text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-l-transparent"
                  }`}
                >
                  {getIcon(item.id)}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Socials / Footer in Drawer */}
          <div className="mobile-nav-item border-t border-white/5 pt-6 text-center text-xs text-gray-500 font-mono">
            &copy; {new Date().getFullYear()} {portfolioData.hero.name}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
