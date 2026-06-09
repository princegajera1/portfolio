import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from '../../context/LenisContext';

/**
 * SmoothScrollLayout
 * Wraps public pages with:
 *  – Animated page enter/exit transitions
 *  – Auto-scroll-to-top on route change via Lenis
 */
export default function SmoothScrollLayout({ children }) {
  const { lenis } = useLenis();
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    if (lenis?.current) {
      lenis.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
