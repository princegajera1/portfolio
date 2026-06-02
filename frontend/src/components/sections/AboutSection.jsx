import { useEffect, useState } from 'react';
import ParticleBackground from '../ParticleBackground';
import { useScrollReveal } from '../../hooks/useGSAP';
import gsap from 'gsap';
import { getExperience } from '../../firebase/experience';

export default function AboutSection() {
  useScrollReveal('.scroll-reveal-about');
  const [internshipMonths, setInternshipMonths] = useState(2);
  const [internshipCount, setInternshipCount] = useState(2);

  // Dynamic Coding Experience Auto-calculation (Starts from September 2023)
  const getCodingExp = () => {
    const start = new Date('2023-09-01');
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return `${Math.floor(diffYears)}+ Yrs`;
  };


  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.fact-card', 
        { opacity: 0, scale: 0.95, y: 15 },
        { 
          opacity: 1, scale: 1, y: 0,
          duration: 0.6, 
          stagger: 0.08, 
          ease: 'back.out(1.1)',
          scrollTrigger: {
            trigger: '.fact-grid',
            start: 'top 85%'
          }
        }
      );
    });

    const fetchAndCalculateInternships = async () => {
      try {
        const data = await getExperience();
        if (data && data.length) {
          const interns = data.filter(e => e.role.toLowerCase().includes('intern'));
          setInternshipCount(interns.length);

          let totalMonths = 0;
          interns.forEach(e => {
            if (e.current || e.company.includes('Shreeji')) {
              // Shreeji Software starting April 15, 2026
              const start = new Date('2026-04-15');
              const now = new Date();
              let diff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
              if (now.getDate() < start.getDate()) {
                diff--;
              }
              const ongoing = Math.max(1, diff);
              totalMonths += ongoing;
            } else if (e.company.includes('Prodigy')) {
              totalMonths += 1;
            } else {
              totalMonths += 1;
            }
          });
          setInternshipMonths(totalMonths);
        }
      } catch (e) {
        console.error("Error fetching internships in AboutSection:", e);
      }
    };
    fetchAndCalculateInternships();

    return () => ctx.revert();
  }, []);

  const facts = [
    { title: "Technical Architecture", text: "Obsessed with clean code directories, strict TypeScript typing, sub-second API roundtrips, and modular file systems." },
    { title: "Visual Standards", text: "Striving for 100% responsiveness, harmonious color palettes, fluid visual timelines, and zero layout shifts (CLS)." },
    { title: "Performance Metrics", text: "Actively auditing files, optimizing asset payloads, using tree-shaking, and achieving green 95+ scores on Lighthouse diagnostics." },
    { title: "Engineering Mindset", text: "Turning developer pain points (like CORS bugs and complex async states) into robust reusable software components." }
  ];

  return (
    <section id="about" className="relative bg-dark overflow-hidden pt-20 pb-10 px-6">
      <ParticleBackground color="#00D4FF" density={90} />
      
      <div className="absolute top-1/4 right-[10%] w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="scroll-reveal-about mb-12 text-center md:text-left select-none">
          <span className="font-mono text-xs text-secondary block mb-2">// core.profile</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white pb-1">Professional Story</h2>
        </div>

        {/* Narrative & Graphic Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Interactive JSON Terminal Graphic */}
          <div className="scroll-reveal-about md:col-span-4 flex justify-center">
            <div className="relative w-64 h-64 sm:w-76 sm:h-76 group select-none">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary via-accent to-secondary animate-spin-slow opacity-20 blur-md" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary via-accent to-secondary animate-spin-slow opacity-30" />
              
              <div className="absolute inset-[1px] rounded-2xl bg-[#0d0d1a] overflow-hidden flex flex-col p-4 border border-white/5">
                <div className="flex items-center gap-1.5 border-b border-white/5 pb-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-[9px] text-gray-500 font-mono ml-2">prince.json</span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center text-left font-mono text-[9px] sm:text-[10px] leading-relaxed text-gray-400">
                  <pre className="w-full">
{`{
  "name": "Prince Gajera",
  "role": "Full Stack Engineer",
  "degree": "B.E. Computer Engg",
  "college": "SAL Institute (GTU)",
  "location": "Ahmedabad, India",
  "experience": "${getCodingExp()}",
  "internships": ${internshipCount},
  "status": "Ready for hire",
  "authMethod": "Firebase Serverless",
  "skills": ["React", "Java", "Python"]
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Recruiter Optimized Biography */}
          <div className="scroll-reveal-about md:col-span-8 space-y-6 text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed font-sans">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-display">
              A computer engineering student combining deep database execution with absolute visual layout precision.
            </h3>
            
            <p>
              I am **Gajera Prince Shaileshbhai**, a technical software engineer and developer intern located in Ahmedabad, Gujarat. Currently completing my third year of **B.E. in Computer Engineering (2023 - Present)** at SAL Engineering and Technical Institute, I spend my days writing clean code, building responsive interfaces, and resolving complex full-stack issues.
            </p>
            
            <p>
              My professional background highlights include building specialized billing databases (such as the enterprise tire inventory application for **Chandrakant Traders**), premium shopping platforms (**Ruiz Diamonds**), and advanced AI contextual chatbots. I leverage modern tools like React, Vite, and Google Firebase to construct secure, scalable serverless solutions.
            </p>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2.5 pt-2 pb-4 select-none justify-center md:justify-start">
              {[
                '🎓 B.E. Computer Engineering', 
                `💼 ${internshipMonths} Months Internships`, 
                '📍 Ahmedabad, Gujarat, India'
              ].map((badge, idx) => (
                <span key={idx} className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-secondary/5 border border-secondary/15 text-secondary shadow-[0_0_10px_rgba(0,229,255,0.02)]">
                  {badge}
                </span>
              ))}
            </div>

            <blockquote className="border-l-2 border-secondary pl-6 text-sm font-mono text-gray-300 italic py-2 my-6 select-text text-left">
              "My mission is to engineer high-fidelity, high-performance web products that deliver real commercial business value. I write clean code, study sitemap indexing, and build products that load in milliseconds."
            </blockquote>
          </div>
        </div>

        {/* Fact Matrix */}
        <div className="scroll-reveal-about mb-6 font-sans">
          <p className="text-secondary font-mono text-xs uppercase tracking-[0.25em] mb-6 text-center md:text-left select-none">&lt; Engineering Standards & Principles /&gt;</p>
          <div className="fact-grid grid grid-cols-1 sm:grid-cols-2 gap-6">
            {facts.map((fact, index) => (
              <div 
                key={index} 
                className="fact-card bg-[#13132a]/30 border border-white/5 p-6 sm:p-8 rounded-2xl hover:border-[#7c6fff]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#7c6fff]/2 min-h-[140px] flex flex-col justify-center gap-2"
              >
                <h4 className="text-white font-display font-bold text-sm sm:text-base flex items-center gap-2.5 select-none">
                  <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#00e5ff]" />
                  {fact.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">{fact.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
