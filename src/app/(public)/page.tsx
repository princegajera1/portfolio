"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import PageLoader from "@/components/PageLoader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Animate Global Scroll Progress Bar
    const progressTween = gsap.to("#scroll-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });

    // Cleanup on unmount
    return () => {
      progressTween.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // 2. Dynamic Spotlight cursor-tracking effect
  useEffect(() => {
    if (loading) return;

    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    // Set initial position off screen
    gsap.set(spotlight, { x: -300, y: -300, xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(spotlight, "x", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(spotlight, "y", { duration: 0.8, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [loading]);

  // Handle Loader completion
  const handleLoaderComplete = () => {
    setLoading(false);

    // Trigger staggered entrance transitions for all section elements
    setTimeout(() => {
      gsap.fromTo(
        ".reveal-on-load",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power4.out",
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        }
      );
    }, 100);
  };

  return (
    <>
      {loading && <PageLoader onComplete={handleLoaderComplete} />}

      {/* Top Scroll Progress Bar */}
      <div
        id="scroll-progress"
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00f0ff] via-[#6366f1] to-[#8b5cf6] origin-left z-[9999]"
        style={{ transform: "scaleX(0)", transformOrigin: "left" }}
      />

      <div
        ref={containerRef}
        className={`bg-gradient-mesh min-h-screen text-gray-200 relative overflow-hidden transition-opacity duration-1000 ${
          loading ? "opacity-0 h-screen overflow-hidden" : "opacity-100"
        }`}
      >
        {!loading && (
          <>
            {/* Ambient Background Cursor Spotlight */}
            <div
              ref={spotlightRef}
              className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,rgba(0,240,255,0.02)_45%,transparent_70%)] z-0 mix-blend-screen hidden md:block"
              style={{ willChange: "transform" }}
            />

            <div className="reveal-on-load opacity-0">
              <Hero />
            </div>
            <div className="reveal-on-load opacity-0">
              <About />
            </div>
            <div className="reveal-on-load opacity-0">
              <Skills />
            </div>
            <div className="reveal-on-load opacity-0">
              <Projects />
            </div>
            <div className="reveal-on-load opacity-0">
              <Experience />
            </div>
            <div className="reveal-on-load opacity-0">
              <Contact />
            </div>
          </>
        )}
      </div>
    </>
  );
}
