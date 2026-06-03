import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Cursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Don't run on touch / small screens
    if (window.matchMedia('(max-width: 767px)').matches) return;
    if ('ontouchstart' in window) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Start off-screen so they don't flash at 0,0
    gsap.set([dot, ring], { x: -200, y: -200 });

    // Dot follows almost instantly
    const moveDotX  = gsap.quickTo(dot,  'x', { duration: 0.06, ease: 'none' });
    const moveDotY  = gsap.quickTo(dot,  'y', { duration: 0.06, ease: 'none' });
    // Ring lags — this gap is the premium feel
    const moveRingX = gsap.quickTo(ring, 'x', { duration: 0.18, ease: 'power2.out' });
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.18, ease: 'power2.out' });

    const onMove  = (e) => { moveDotX(e.clientX); moveDotY(e.clientY); moveRingX(e.clientX); moveRingY(e.clientY); };
    const onEnter = ()  => ring.classList.add('is-hovering');
    const onLeave = ()  => ring.classList.remove('is-hovering');
    const onDown  = ()  => ring.classList.add('is-clicking');
    const onUp    = ()  => ring.classList.remove('is-clicking');

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);

    // Attach hover detection to all interactive elements (re-attach on DOM changes)
    const attachHover = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, .card-tilt, .skill-card').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attachHover();

    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* 6px white dot — instant */}
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      {/* 32px ring — lags, morphs on hover */}
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
};

export default Cursor;
