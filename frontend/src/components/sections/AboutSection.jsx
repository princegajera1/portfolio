import { useEffect } from 'react';
import ParticleBackground from '../ParticleBackground';
import { useScrollReveal } from '../../hooks/useGSAP';
import gsap from 'gsap';

export default function AboutSection() {
  useScrollReveal('.scroll-reveal-about');

  useEffect(() => {
    // Card animation trigger
    gsap.fromTo('.fact-card', 
      { opacity: 0, scale: 0.92, y: 15 },
      { 
        opacity: 1, scale: 1, y: 0,
        duration: 0.6, 
        stagger: 0.08, 
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: '.fact-grid',
          start: 'top 85%'
        }
      }
    );
  }, []);

  const facts = [
    { title: "Design Mind", text: "Obsessed with perfect alignments and layout spacing. Making interfaces gorgeous isn't optional." },
    { title: "Under the Hood", text: "React states and database querying speed matter. High-fidelity visuals need solid execution." },
    { title: "Daily Pain Points", text: "Fighting CORS errors, debugging async race conditions, and styling HTML forms on Safari mobile." },
    { title: "Caffeine Loop", text: "Turn coffee and custom terminal scripts into responsive, scalable full-stack applications." }
  ];

  return (
    <section id="about" className="relative bg-dark overflow-hidden pt-16 pb-6 sm:pt-20 sm:pb-8 px-6">
      {/* Dynamic Cyan Particle background field */}
      <ParticleBackground color="#00D4FF" density={90} />
      
      <div className="absolute top-1/4 right-[10%] w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="scroll-reveal-about mb-12 text-center md:text-left select-none">
          <span className="font-mono text-xs sm:text-sm text-secondary block mb-2">// about.me</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1">About Me</h2>
        </div>

        {/* Narratives Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Mockup Terminal Graphic */}
          <div className="scroll-reveal-about md:col-span-4 flex justify-center">
            <div className="relative w-64 h-64 sm:w-76 sm:h-76 group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary via-accent to-secondary animate-spin-slow opacity-60 blur-md" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary via-accent to-secondary animate-spin-slow" />
              
              <div className="absolute inset-1 rounded-xl bg-surface-2 overflow-hidden flex flex-col p-4 border border-white/10 select-none">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-[9px] text-gray-500 font-mono ml-2">prince.sh</span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center text-center font-mono text-xs sm:text-sm leading-relaxed">
                  <p className="text-primary font-bold mb-2">&gt; cat developer.json</p>
                  <pre className="text-left text-[9px] sm:text-[10px] text-gray-400">
{`{
  "name": "Prince Gajera",
  "role": "Full Stack Dev",
  "college": "SAL Engineering & Tech (GTU)",
  "year": "3rd Year B.E.",
  "location": "Ahmedabad, Gujarat",
  "status": "Available for hire",
  "internships": 2,
  "coffee": "Infinite",
  "editor": "VS Code",
  "github": "princegajera1",
  "email": "princegajera944@gmail.com"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="scroll-reveal-about md:col-span-8 space-y-6 text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-display">
              I build high-end web applications that are responsive, performant, and interactive.
            </h3>
            
            <p>
              I am Gajera Prince Shaileshbhai, a Full Stack Developer & Software Development Intern based in Ahmedabad, Gujarat. Currently pursuing my B.E. in Computer Engineering (2023 - Present) at SAL Engineering and Technical Institute, I have a deep passion for building polished full-stack systems.
            </p>
            
            <p>
              My professional journey includes designing commercial tyreshop ledgers like Chandrakant Traders, high-fidelity e-commerce sites like Ruiz Diamonds, and robust serverless databases using React and Firebase. I focus on sub-second load times, clean code, and intuitive UX design.
            </p>

            {/* Quick Stat Badges */}
            <div className="flex flex-wrap gap-3 pt-2 pb-4 select-none justify-center md:justify-start">
              {[
                '🎓 B.E. Computer Engg', 
                `💼 ${(() => {
                  const start = new Date('2026-04-15');
                  const now = new Date();
                  const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
                  const ongoingMonths = diffMonths + (now.getDate() >= start.getDate() ? 1 : 0);
                  return 1 + ongoingMonths;
                })()} Mos Internships`, 
                '📍 Ahmedabad, India'
              ].map((badge, idx) => (
                <span key={idx} className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-secondary/10 border border-secondary/20 text-secondary shadow-[0_0_10px_rgba(0,212,255,0.05)]">
                  {badge}
                </span>
              ))}
            </div>

            {/* Cyan-bordered Quote block */}
            <blockquote className="border-l-4 border-secondary pl-6 text-sm sm:text-base font-mono text-gray-300 italic py-2 my-8 select-text text-left">
              "Yes, I write tests. Yes, I clean up console.logs before pushing to production. No, I do not believe Tailwind utility strings are too long if structured cleanly."
            </blockquote>
          </div>
        </div>

        {/* Fact Matrix */}
        <div className="scroll-reveal-about mb-6">
          <p className="text-accent font-mono text-xs uppercase tracking-[0.25em] mb-4 text-center md:text-left select-none">&lt; Philosophies & Dev Pain Points /&gt;</p>
          <div className="fact-grid grid grid-cols-1 sm:grid-cols-2 gap-8">
            {facts.map((fact, index) => (
              <div 
                key={index} 
                className="fact-card bg-surface-2/60 border border-white/5 p-6 sm:p-8 rounded-[24px] hover:border-secondary/40 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/5 min-h-[160px] flex flex-col justify-center gap-2.5"
              >
                <h4 className="text-white font-display font-bold text-sm sm:text-base md:text-lg flex items-center gap-2.5 select-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_10px_#00D4FF]" />
                  {fact.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">{fact.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
