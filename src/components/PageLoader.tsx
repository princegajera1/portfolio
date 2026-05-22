"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface PageLoaderProps {
  onComplete: () => void;
}

const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathGRef = useRef<SVGPathElement>(null);
  const pathPRef = useRef<SVGPathElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const pathG = pathGRef.current;
    const pathP = pathPRef.current;
    const ring = ringRef.current;
    const text = textRef.current;

    if (!container || !pathG || !pathP || !ring || !text) return;

    // Measure exact SVG lengths
    const lenG = pathG.getTotalLength();
    const lenP = pathP.getTotalLength();
    const lenRing = ring.getTotalLength();

    // Set starting states: hidden and offset
    gsap.set(pathG, { strokeDasharray: lenG, strokeDashoffset: lenG, opacity: 0 });
    gsap.set(pathP, { strokeDasharray: lenP, strokeDashoffset: lenP, opacity: 0 });
    gsap.set(ring, { strokeDasharray: lenRing, strokeDashoffset: lenRing, opacity: 0 });
    gsap.set(text, { opacity: 0, y: 15 });

    const tl = gsap.timeline({
      onComplete: () => {
        // Ultimate exit animation
        gsap.to(container, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
          onComplete: () => {
            if (onComplete) onComplete();
          },
        });
      },
    });

    // Sequence the loader drawing animation
    tl.to(ring, { opacity: 1, duration: 0.1 })
      .to(ring, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" })
      .to([pathG, pathP], { opacity: 1, duration: 0.1 }, "-=0.6")
      .to(pathG, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
      .to(pathP, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
      .to(text, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3")
      // Pulse color glow
      .to(
        [pathG, pathP, ring],
        {
          stroke: "#8b5cf6",
          filter: "drop-shadow(0 0 12px rgba(139, 92, 246, 0.8))",
          duration: 0.4,
        },
        "-=0.1"
      )
      // Squeeze exit
      .to(container, { opacity: 0, duration: 0.3 }, "+=0.2");

    // Force loader completion in 3 seconds maximum (safety timeout)
    const timeoutId = setTimeout(() => {
      tl.progress(1);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center z-[99999]"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* SVG Drawing Logo */}
        <svg
          viewBox="0 0 100 100"
          className="w-28 h-28"
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <linearGradient id="gpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Glowing Outer Hexagon / Circle */}
          <circle
            ref={ringRef}
            cx="50"
            cy="50"
            r="44"
            stroke="url(#gpGrad)"
            strokeWidth="3"
          />

          {/* Letter G Path */}
          <path
            ref={pathGRef}
            d="M 44 38 L 36 38 A 12 12 0 0 0 36 62 L 44 62 A 12 12 0 0 0 44 50 L 38 50"
            stroke="url(#gpGrad)"
          />

          {/* Letter P Path */}
          <path
            ref={pathPRef}
            d="M 54 62 L 54 38 L 64 38 A 6 6 0 0 1 64 50 L 54 50"
            stroke="url(#gpGrad)"
          />
        </svg>

        {/* Brand Text */}
        <div
          ref={textRef}
          className="font-heading font-bold tracking-[0.35em] text-sm text-white uppercase text-center mt-6"
        >
          Gajera Prince
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
