import { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const obj = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('.loader-container', {
          yPercent: -100,
          duration: 0.5,
          ease: 'power4.inOut',
          onComplete: onComplete
        });
      }
    });

    tl.to(obj, {
      value: 100,
      duration: 0.9,
      ease: 'power1.out',
      onUpdate: () => {
        setCount(Math.floor(obj.value));
      }
    });

    gsap.to('.loader-logo', {
      scale: 1.05,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div className="loader-container fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center select-none">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative flex flex-col items-center text-center px-4 max-w-sm w-full">
        {/* PG Monogram Logo SVG border */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-8 loader-logo">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(232,255,0,0.4)]">
            <polygon
              points="50,5 92,27 92,73 50,95 8,73 8,27"
              fill="none"
              stroke="#E8FF00"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="relative font-display font-black text-xl tracking-tighter text-white">
            PG
          </span>
        </div>

        {/* Loading Counter */}
        <h2 className="text-white text-5xl font-display font-black mb-4 tracking-tight">
          {count}%
        </h2>

        {/* Loading status */}
        <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em] mb-6">
          Initializing Antigravity Engine...
        </p>

        {/* Loading Bar */}
        <div className="w-full h-[1.5px] bg-white/5 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-primary transition-all duration-75 shadow-[0_0_8px_#E8FF00]"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
    </div>
  );
}
