import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experienceData } from '../data/experience';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });

    tl.fromTo('.experience-header', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo('.timeline-line', 
      { scaleY: 0, transformOrigin: 'top' },
      { scaleY: 1, duration: 1, ease: 'power3.inOut' }, 
      "-=0.2"
    )
    .fromTo('.experience-item', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out' }, 
      "-=0.5"
    );
  }, { scope: sectionRef });

  return (
    <section id="experience" ref={sectionRef} className="py-14 relative bg-custom-richBlack">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 experience-header opacity-0">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 flex items-center">
            <span className="text-custom-carrotOrange mr-2">04.</span> Where I've Worked
            <div className="h-[1px] bg-white/10 flex-grow ml-6"></div>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative mt-16">
          {/* Vertical Timeline Line */}
          <div className="timeline-line absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-custom-midnightGreen/50 via-custom-carrotOrange/30 to-transparent -translate-x-1/2 scale-y-0"></div>

          {experienceData.map((job, index) => {
            const isLeft = index % 2 === 0;
            const themeColors = [
              { ring: 'border-custom-midnightGreen', shadow: 'shadow-custom-midnightGreen/30', glow: 'from-custom-midnightGreen/20', text: 'text-custom-midnightGreen' },
              { ring: 'border-custom-carrotOrange', shadow: 'shadow-custom-carrotOrange/30', glow: 'from-custom-carrotOrange/20', text: 'text-custom-carrotOrange' },
              { ring: 'border-custom-gargoyleGas', shadow: 'shadow-custom-gargoyleGas/30', glow: 'from-custom-gargoyleGas/20', text: 'text-custom-gargoyleGas' }
            ];
            const theme = themeColors[index % 3];

            return (
            <div
              key={job.id}
              className={`experience-item relative flex flex-col md:flex-row gap-8 md:gap-16 ${index === experienceData.length - 1 ? 'mb-0' : 'mb-16'} ${isLeft ? 'md:flex-row-reverse' : ''} opacity-0 cursor-pointer group`}
            >
              {/* Timeline Dot */}
              <div className={`absolute left-[39px] md:left-1/2 top-10 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-custom-richBlack border-4 ${theme.ring} shadow-[0_0_15px_rgba(0,0,0,0.5)] ${theme.shadow} z-10`}></div>
              
              <div className="hidden md:flex md:w-1/2 items-center justify-end">
                <div className={`text-5xl font-heading font-extrabold text-white/[0.02] select-none ${isLeft ? 'text-left w-full pl-8' : 'pr-8'}`}>
                  {job.period.split(' ')[job.period.split(' ').length - 1]}
                </div>
              </div>
              
              <div className="w-full md:w-1/2 pl-[80px] md:pl-0">
                <div className="glass p-8 rounded-2xl relative group transition-all duration-500 hover:-translate-y-1 border border-white/5 hover:border-white/10 bg-custom-richBlack/60 overflow-hidden shadow-lg">
                  <div className={`absolute top-0 ${isLeft ? 'left-0 rounded-br-[100%] -ml-16 -mt-16' : 'right-0 rounded-bl-[100%] -mr-16 -mt-16'} w-40 h-40 bg-gradient-to-br ${theme.glow} to-transparent transition-transform duration-700 group-hover:scale-150 opacity-50`}></div>
                  
                  <div className="flex items-center space-x-4 mb-6 relative z-10">
                    <div className={`w-14 h-14 rounded-xl bg-custom-richBlack/50 flex items-center justify-center ${theme.text} font-bold font-heading text-xl border border-white/5 shadow-inner`}>
                      {job.initials}
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading font-bold text-white group-hover-text-gradient transition-all duration-300">{job.role}</h3>
                      <p className="text-gray-300 font-medium text-lg opacity-90">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="font-mono text-sm text-gray-400 bg-black/40 px-4 py-1.5 rounded-lg inline-block mb-6 border border-white/5 shadow-inner relative z-10">
                    {job.period}
                  </div>

                  <ul className="space-y-4 relative z-10">
                    {job.description.map((desc, i) => (
                      <li key={i} className="flex items-start text-gray-400 text-sm md:text-base leading-relaxed group/item font-light">
                        <span className={`${theme.text} mr-4 mt-1.5 text-xs transition-transform group-hover/item:translate-x-1 opacity-70`}>▹</span>
                        <span className="group-hover/item:text-gray-300 transition-colors">{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
};

export default Experience;
