import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiLinkedin, FiMail, FiCheckCircle } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  const testimonials = [
    {
      name: "Dhaval Patel",
      role: "Senior Project Mentor",
      relationship: "Guided Prince during course projects",
      quote: "Prince exhibits an exceptional ability to grasp advanced React states and backend integration quickly. His Ruiz Diamonds project showcased excellent attention to performance constraints, achieving impressive initial bundle sizes.",
      rating: 5,
      source: "Academic Mentor",
      icon: FiCheckCircle
    },
    {
      name: "Hardik Gajera",
      role: "Lead Software Architect",
      relationship: "Collaborated on open source scripts",
      quote: "Prince has a strong knack for crafting visual animations and modular layouts. He refactored our community community feeds in Dev Orbit, reducing rendering lag significantly. He's ready for any challenging frontend role.",
      rating: 5,
      source: "LinkedIn Verified",
      icon: FiLinkedin
    },
    {
      name: "Amit Patel",
      role: "Tech Lead & Full Stack Developer",
      relationship: "Co-authored system ledgers",
      quote: "Prince's execution on Chandrakant Traders was outstanding. He implemented offline inventory caching that recovers seamlessly, saving warehouse staff hours of manual ledgers. Extremely disciplined worker.",
      rating: 5,
      source: "Direct Reference",
      icon: FiMail
    },
    {
      name: "Sanjay Kumar",
      role: "Startup Project Coordinator",
      relationship: "Freelance client",
      quote: "Working with Prince on our storefront layout was a pleasure. He built a Nike sneaker configuration flow that operates at a locked 60fps. Visual details are top-tier.",
      rating: 5,
      source: "Client Reference",
      icon: FiCheckCircle
    }
  ];

  // Auto scroll testimonials slide
  useEffect(() => {
    if (hovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [hovered, testimonials.length]);

  return (
    <section id="testimonials" className="relative py-24 bg-[#0A0A0F]/90 border-t border-border-dark overflow-hidden select-none">
      
      {/* Premium background glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-primary/10 to-[#E8FF00]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 text-left relative z-10">
        
        {/* Section Header */}
        <div className="max-w-xl mb-16 space-y-2">
          <span className="section-label text-[#E8FF00] font-mono tracking-[0.2em] font-bold">// FEEDBACK</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary-dark tracking-tight">
            What People Say
          </h2>
          <p className="text-text-secondary-dark text-xs sm:text-sm font-sans leading-relaxed">
            Endorsements from project coordinators, engineering peers, and course mentors representing Prince's coding capabilities.
          </p>
        </div>

        {/* Carousel Slider Panel */}
        <div 
          className="relative max-w-4xl mx-auto w-full min-h-[220px] md:min-h-[160px]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-auto"
            >
              <Card className="w-full border border-border-dark flex flex-col justify-between p-8 sm:p-10 bg-[#111118]/60 backdrop-blur-xl relative shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-[#E8FF00]/30 transition-all duration-300 rounded-2xl">
                
                {/* Quotation text */}
                <div className="text-xs sm:text-sm md:text-base italic text-text-primary-dark font-sans leading-relaxed pl-8 relative">
                  <span className="absolute left-0 top-[-10px] text-5xl font-serif bg-gradient-to-r from-primary to-[#E8FF00] bg-clip-text text-transparent opacity-40 select-none">“</span>
                  {testimonials[activeIdx].quote}
                </div>

                {/* Author Info block */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border-dark pt-6 mt-6">
                  
                  <div className="flex items-center gap-4">
                    {/* Circle Avatar Frame */}
                    <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-primary to-[#E8FF00]">
                      <div className="w-10 h-10 rounded-full bg-bg-dark flex items-center justify-center text-sm font-display font-black text-white uppercase select-none">
                        {testimonials[activeIdx].name[0]}
                      </div>
                    </div>

                    <div className="text-left leading-tight">
                      <div className="text-xs font-bold text-text-primary-dark font-display">
                        {testimonials[activeIdx].name}
                      </div>
                      <div className="text-[10px] text-text-secondary-dark font-sans mt-0.5">
                        {testimonials[activeIdx].role} • <span className="opacity-80">{testimonials[activeIdx].relationship}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ratings & Verification source */}
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(testimonials[activeIdx].rating)].map((_, i) => (
                        <FaStar key={i} className="w-3.5 h-3.5" />
                      ))}
                    </div>
                    
                    <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 text-[9px] bg-white/5 border border-border-dark text-text-secondary-dark">
                      {(() => {
                        const Icon = testimonials[activeIdx].icon;
                        return <Icon className="w-3 h-3 text-[#E8FF00] flex-shrink-0" />;
                      })()}
                      <span>{testimonials[activeIdx].source}</span>
                    </Badge>
                  </div>

                </div>

              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel indicators/dots */}
        <div className="flex justify-center gap-2 mt-8 select-none">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIdx === idx 
                  ? 'w-6 bg-[#E8FF00] shadow-[0_0_8px_#E8FF00]' 
                  : 'w-2 bg-border-dark'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
