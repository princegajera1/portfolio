import { useRef } from 'react';
import { MapPin, Briefcase, GraduationCap, Award } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      }
    });

    tl.fromTo('.about-header', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo('.about-bio-element', 
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, 
      "-=0.3"
    )
    .fromTo('.about-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)' }, 
      "-=0.5"
    );

  }, { scope: sectionRef });

  return (
    <section id="about" ref={sectionRef} className="py-14 relative bg-custom-richBlack">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 about-header opacity-0">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 flex items-center">
            <span className="text-custom-carrotOrange mr-2">01.</span> About Me
            <div className="h-[1px] bg-white/10 flex-grow ml-6"></div>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Bio text */}
          <div className="lg:col-span-3 space-y-4 text-gray-400 text-lg leading-relaxed font-medium about-bio">
            <p className="text-xl text-gray-300 leading-relaxed font-heading about-bio-element opacity-0">
              Hello! I'm <span className="text-white font-bold">Prince Gajera</span>, a passionate full-stack developer who loves building websites and applications that live on the internet.
            </p>
            <p className="about-bio-element opacity-0">
              My journey into web development started when I began hacking together simple HTML sites. Fast-forward to today, I'm pursuing my B.E. in Computer Engineering at Gujarat Technological University.
            </p>
            <p className="text-gray-300 border-l-2 border-custom-carrotOrange pl-4 py-2 italic font-light about-bio-element opacity-0">
              "My main focus is building fast, reliable, and user-friendly digital products."
            </p>
            <div className="pt-2 flex flex-wrap gap-3 about-bio-element opacity-0">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-mono text-custom-gargoyleGas">React.js</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-mono text-custom-gargoyleGas">Node.js</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-mono text-custom-gargoyleGas">TailwindCSS</span>
            </div>
            
            <div className="pt-4 about-bio-element opacity-0">
              <h3 className="text-xl font-heading font-semibold mb-5 text-white">Education Timeline</h3>
              <div className="relative border-l border-custom-midnightGreen/40 ml-3 space-y-6">
                
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-custom-carrotOrange rounded-full -left-[6.5px] top-1.5 ring-4 ring-custom-richBlack"></div>
                  <h4 className="text-lg font-medium text-white">B.E. Computer Engineering</h4>
                  <p className="text-sm text-custom-gargoyleGas font-mono mb-1">GTU | 2023 – 2027</p>
                  <p className="text-sm text-gray-500">Focusing on full-stack web development and AI integration.</p>
                </div>

                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-custom-midnightGreen rounded-full -left-[6.5px] top-1.5 ring-4 ring-custom-richBlack"></div>
                  <h4 className="text-lg font-medium text-white">HSC (Science)</h4>
                  <p className="text-sm text-custom-gargoyleGas font-mono mb-1">Gujarat Board | 2023</p>
                </div>

                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-custom-gargoyleGas rounded-full -left-[6.5px] top-1.5 ring-4 ring-custom-richBlack"></div>
                  <h4 className="text-lg font-medium text-white">SSC</h4>
                  <p className="text-sm text-custom-gargoyleGas font-mono mb-1">Gujarat Board | 2021</p>
                </div>

              </div>
            </div>
          </div>

          {/* Quick Info Cards with premium themes */}
          <div className="lg:col-span-2 space-y-5">
            {/* Box 1: Location */}
            <div className="about-card glass p-6 rounded-xl border border-custom-midnightGreen/20 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(34,85,96,0.25)] hover:border-custom-midnightGreen/60 transition-all duration-300 cursor-pointer group opacity-0">
              <MapPin className="text-custom-gargoyleGas mb-3 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
              <h3 className="text-white font-semibold mb-1 group-hover:text-custom-gargoyleGas transition-colors">Location</h3>
              <p className="text-gray-400 text-sm">Ahmedabad, Gujarat</p>
            </div>

            {/* Box 2: Current Status */}
            <div className="about-card glass p-6 rounded-xl border border-custom-carrotOrange/20 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(240,128,60,0.25)] hover:border-custom-carrotOrange/60 transition-all duration-300 cursor-pointer group opacity-0">
              <Briefcase className="text-custom-carrotOrange mb-3 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
              <h3 className="text-white font-semibold mb-1 group-hover:text-custom-carrotOrange transition-colors">Current Status</h3>
              <p className="text-gray-400 text-sm">Student & Freelance Developer</p>
            </div>

            {/* Box 3: Education */}
            <div className="about-card glass p-6 rounded-xl border border-custom-midnightGreen/20 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(34,85,96,0.25)] hover:border-custom-midnightGreen/60 transition-all duration-300 cursor-pointer group opacity-0">
              <GraduationCap className="text-custom-midnightGreen mb-3 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
              <h3 className="text-white font-semibold mb-1 group-hover:text-custom-midnightGreen transition-colors">Education</h3>
              <p className="text-gray-400 text-sm">B.E. Computer Engineering (2027)</p>
            </div>

            {/* Box 4: Certification */}
            <div className="about-card glass p-6 rounded-xl border border-custom-gargoyleGas/20 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(237,240,96,0.25)] hover:border-custom-gargoyleGas/60 transition-all duration-300 cursor-pointer group border-l-4 border-l-custom-gargoyleGas opacity-0">
              <Award className="text-custom-gargoyleGas mb-3 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
              <h3 className="text-white font-semibold mb-1 group-hover:text-custom-gargoyleGas transition-colors">Certification</h3>
              <p className="text-gray-400 text-sm">Generative AI Certified</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
