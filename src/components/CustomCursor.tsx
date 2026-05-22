"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable custom cursor on touch devices for accessibility
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    // Position initially out of screen
    gsap.set([dot, ring], { x: -100, y: -100, xPercent: -50, yPercent: -50 });

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });

    const xToRing = gsap.quickTo(ring, "x", { duration: 0.08, ease: "power3.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.08, ease: "power3.out" });

    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
        isVisible = true;
      }
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    const onMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
      isVisible = false;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isHoverable = target.closest("a, button, [role='button'], input, textarea, select, .hover-expand");

      if (isHoverable) {
        gsap.to(ring, {
          scale: 1.6,
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.15)",
          borderWidth: "1.5px",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, {
          scale: 0.3,
          backgroundColor: "#8b5cf6",
          boxShadow: "0 0 12px rgba(139, 92, 246, 0.8)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(ring, {
          scale: 1,
          borderColor: "#6366f1",
          backgroundColor: "transparent",
          borderWidth: "1px",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, {
          scale: 1,
          backgroundColor: "#00f0ff",
          boxShadow: "0 0 8px rgba(0, 240, 255, 0.6)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseover", onMouseOver);

    // Apply global CSS to hide default cursor
    const style = document.createElement("style");
    style.id = "cursor-none-styles";
    style.innerHTML = `
      body, a, button, [role="button"], input, textarea, select {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseover", onMouseOver);
      const styleElement = document.getElementById("cursor-none-styles");
      if (styleElement) styleElement.remove();
    };
  }, []);

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#6366f1] pointer-events-none z-[9999] opacity-0 hidden md:block"
        style={{ willChange: "transform" }}
      />
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-[#00f0ff] pointer-events-none z-[9999] opacity-0 hidden md:block"
        style={{ willChange: "transform" }}
      />
    </>
  );
};

export default CustomCursor;
