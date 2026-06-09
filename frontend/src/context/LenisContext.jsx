import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useMotionValue } from 'framer-motion';

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ({ scroll }) => {
      scrollY.set(scroll);
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [scrollY]);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef, scrollY }}>
      {children}
    </LenisContext.Provider>
  );
}
