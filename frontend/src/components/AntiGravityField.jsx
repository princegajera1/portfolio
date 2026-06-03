import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

/**
 * AntiGravityField — Easter-egg GSAP mouse-physics field.
 *
 * Usage (wrap a grid's children, NOT the grid itself):
 *
 *   <div className="grid grid-cols-3 gap-6">
 *     <AntiGravityField>
 *       {items.map(item => <Card key={item.id} ... />)}
 *     </AntiGravityField>
 *   </div>
 *
 * Each child gets wrapped in a <div data-ag-card> that GSAP animates.
 * Trigger: hover the invisible hot-zone above the first item's row,
 * or hold Shift while mousing over any card.
 */
const AntiGravityField = ({ children }) => {
  const containerRef = useRef(null);
  const badgeRef     = useRef(null);
  const activeRef    = useRef(false);
  const frameRef     = useRef(null);
  const [isActive, setIsActive]   = useState(false);

  const activate = useCallback(() => {
    if (activeRef.current) return;
    setIsActive(true);
    activeRef.current = true;
    badgeRef.current?.classList.add('visible');
  }, []);

  const deactivate = useCallback(() => {
    if (!activeRef.current) return;
    setIsActive(false);
    activeRef.current = false;
    badgeRef.current?.classList.remove('visible');
    if (containerRef.current) {
      gsap.to(containerRef.current.querySelectorAll('[data-ag-card]'), {
        y: 0, x: 0, rotation: 0, scale: 1,
        duration: 0.9,
        ease: 'elastic.out(1, 0.45)',
        stagger: 0.025,
      });
    }
  }, []);

  // Shift-key toggle
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Shift') activate();   };
    const onKeyUp   = (e) => { if (e.key === 'Shift') deactivate(); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
    };
  }, [activate, deactivate]);

  // Mouse-proximity physics
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      if (!activeRef.current) return;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        container.querySelectorAll('[data-ag-card]').forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cx   = rect.left + rect.width  / 2;
          const cy   = rect.top  + rect.height / 2;
          const dx   = e.clientX - cx;
          const dy   = e.clientY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius   = 220;
          const strength = Math.max(0, 1 - dist / radius);

          if (strength > 0) {
            gsap.to(card, {
              x:        -(dx / dist) * strength * 28,
              y:        -(dy / dist) * strength * 28 - strength * 16,
              rotation: (dx / dist) * strength * 5,
              scale:    1 + strength * 0.04,
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          } else {
            gsap.to(card, {
              x: 0, y: 0, rotation: 0, scale: 1,
              duration: 0.7,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          }
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <>
      {/* Invisible hover trigger — sits above the first row */}
      <div
        aria-hidden="true"
        onMouseEnter={activate}
        onMouseLeave={deactivate}
        style={{
          position: 'absolute',
          top: '-2.5rem', left: '50%',
          transform: 'translateX(-50%)',
          width: '160px', height: '40px',
          zIndex: 10,
        }}
      />

      {/* Animated card wrappers — these are what GSAP moves */}
      <div ref={containerRef} style={{ display: 'contents' }}>
        {childArray.map((child, i) => (
          <div
            key={i}
            data-ag-card=""
            onMouseEnter={activate}
            style={{ willChange: 'transform' }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Floating badge — appears when active */}
      <div ref={badgeRef} className="antigravity-badge" aria-hidden="true">
        ⚡ Anti-Gravity Mode
      </div>
    </>
  );
};

export default AntiGravityField;
