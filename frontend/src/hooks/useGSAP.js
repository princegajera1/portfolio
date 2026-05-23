import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollReveal = (selector, options = {}) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;
    
    const triggers = [];

    elements.forEach((el, i) => {
      const anim = gsap.fromTo(el, 
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8,
          delay: i * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'bottom 12%',
            toggleActions: 'play none none reverse',
            ...options
          }
        }
      );
      triggers.push(anim);
    });

    return () => {
      triggers.forEach(t => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });
    };
  }, [selector]);
};

export const useHeroAnimation = () => {
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.fromTo('.hero-greeting', 
      { opacity: 0, x: -50 }, 
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
    )
    .fromTo('.hero-name', 
      { opacity: 0, y: 50, scale: 0.9 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }
    )
    .fromTo('.hero-role', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
    .fromTo('.hero-bio', 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.6 }
    )
    .fromTo('.hero-cta', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)' }
    );

    return () => tl.kill();
  }, []);
};
