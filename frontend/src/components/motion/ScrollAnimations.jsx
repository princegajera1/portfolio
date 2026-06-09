import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Fade Up on scroll ─────────────────────────────────
export function FadeUp({ children, delay = 0, duration = 0.7, className = '', once = true, amount = 0.15 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Fade In on scroll ──────────────────────────────────
export function FadeIn({ children, delay = 0, duration = 0.6, className = '', once = true, amount = 0.1 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Slide In from Left ──────────────────────────────────
export function SlideInLeft({ children, delay = 0, duration = 0.7, className = '', once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Slide In from Right ──────────────────────────────────
export function SlideInRight({ children, delay = 0, duration = 0.7, className = '', once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Scale Up (pop in) ──────────────────────────────────
export function ScaleUp({ children, delay = 0, duration = 0.6, className = '', once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger container — wraps stagger children ──────────
export function StaggerContainer({ children, delay = 0, stagger = 0.12, className = '', once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger Item — must be child of StaggerContainer ───
export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Page transition wrapper ────────────────────────────
export function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
