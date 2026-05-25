import { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const obj = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        // Slide out loader
        gsap.to('.loader-container', {
          yPercent: -100,
          duration: 0.4,
          ease: 'power4.inOut',
          onComplete: onComplete
        });
      }
    });

    tl.to(obj, {
      value: 100,
      duration: 0.8,
      ease: 'power1.out',
      onUpdate: () => {
        setCount(Math.floor(obj.value));
      }
    });

    // Logo pulsing
    gsap.to('.loader-logo', {
      scale: 1.1,
      duration: 0.6,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div className="loader-container fixed inset-0 z-[9999] bg-dark flex flex-col items-center justify-center">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center text-center px-4 max-w-md w-full">
        {/* Animated Neon Logo */}
        <div className="loader-logo mb-8 w-20 h-20 border-2 border-primary rounded-xl flex items-center justify-center text-primary font-bold text-3xl font-display neon-border-primary select-none">
          PG
        </div>

        {/* Counter */}
        <h2 className="text-white text-6xl font-display font-bold mb-4 tracking-wider">
          {count}%
        </h2>

        {/* Loading text */}
        <p className="text-gray-500 font-mono mb-6 text-sm uppercase tracking-[0.25em]">
          Initializing Antigravity Core...
        </p>

        {/* Progress Bar Container */}
        <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-75 shadow-[0_0_10px_#6C63FF]"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
    </div>
  );
}
