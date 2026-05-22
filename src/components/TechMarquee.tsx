"use client";

import React from "react";

interface TechMarqueeProps {
  techPills: string[];
}

export const TechMarquee: React.FC<TechMarqueeProps> = ({ techPills }) => {
  if (!techPills || techPills.length === 0) return null;

  // Split tech pills into two rows for variety
  const midPoint = Math.ceil(techPills.length / 2);
  const row1 = techPills.slice(0, midPoint);
  const row2 = techPills.slice(midPoint);

  // Helper to repeat pills list until it has at least 30 items for seamless marquee width
  const getRepeatedPills = (pills: string[]) => {
    let result = [...pills];
    while (result.length < 30) {
      result = [...result, ...pills];
    }
    // Double it one more time to ensure a perfect 50% scroll transition
    return [...result, ...result];
  };

  const row1Pills = getRepeatedPills(row1);
  const row2Pills = getRepeatedPills(row2);

  return (
    <div className="w-full mt-14 overflow-hidden relative py-6 border-t border-b border-white/5 select-none">
      {/* Ambient mask on left and right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col gap-6 w-full">
        {/* Row 1: Right to Left scrolling */}
        <div className="overflow-hidden flex w-full">
          <div className="flex gap-4 pr-4 shrink-0 cursor-pointer animate-marquee-left hover:[animation-play-state:paused]">
            {row1Pills.map((pill, i) => (
              <span
                key={`r1-${i}`}
                className="px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/5 text-xs font-mono text-[#00f0ff] hover:text-white hover:bg-[#8b5cf6]/20 hover:border-[#8b5cf6]/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all duration-300 flex items-center justify-center shrink-0"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2: Left to Right scrolling */}
        <div className="overflow-hidden flex w-full">
          <div className="flex gap-4 pr-4 shrink-0 cursor-pointer animate-marquee-right hover:[animation-play-state:paused]">
            {row2Pills.map((pill, i) => (
              <span
                key={`r2-${i}`}
                className="px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/5 text-xs font-mono text-[#8b5cf6] hover:text-white hover:bg-[#00f0ff]/20 hover:border-[#00f0ff]/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all duration-300 flex items-center justify-center shrink-0"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechMarquee;
