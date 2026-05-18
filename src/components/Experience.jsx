import { motion } from 'framer-motion';
import { experienceData } from '../data/experience';

const Experience = () => {
  return (
    <section id="experience" className="py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 flex items-center">
            <span className="text-accent-indigo mr-2">04.</span> Where I've Worked
            <div className="h-[1px] bg-white/10 flex-grow ml-6"></div>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto relative mt-16">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2"></div>

          {experienceData.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-8 md:gap-16 ${index === experienceData.length - 1 ? 'mb-0' : 'mb-16'} ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-[39px] md:left-1/2 top-10 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-dark border-4 border-accent-indigo shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10"></div>
              
              <div className="hidden md:flex md:w-1/2 items-center justify-end">
                <div className={`text-5xl font-heading font-bold text-white/[0.03] select-none ${index % 2 === 0 ? 'text-left w-full pl-8' : 'pr-8'}`}>
                  {job.period.split(' ')[job.period.split(' ').length - 1]}
                </div>
              </div>
              
              <div className="w-full md:w-1/2 pl-[80px] md:pl-0">
                <div className="glass p-8 rounded-2xl relative group hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-accent-indigo/30 bg-gradient-to-br from-white/[0.05] to-transparent overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-indigo/20 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150"></div>
                  
                  <div className="flex items-center space-x-4 mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-accent-indigo/10 flex items-center justify-center text-accent-indigo font-bold font-heading text-xl border border-accent-indigo/20 shadow-inner">
                      {job.initials}
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading font-bold text-white group-hover:text-accent-indigo transition-colors">{job.role}</h3>
                      <p className="text-accent-cyan font-medium text-lg">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="font-mono text-sm text-gray-400 bg-black/40 px-4 py-1.5 rounded-lg inline-block mb-6 border border-white/5 shadow-inner relative z-10">
                    {job.period}
                  </div>

                  <ul className="space-y-4 relative z-10">
                    {job.description.map((desc, i) => (
                      <li key={i} className="flex items-start text-gray-400 text-sm md:text-base leading-relaxed group/item">
                        <span className="text-accent-indigo mr-4 mt-1.5 text-xs transition-transform group-hover/item:translate-x-1">▹</span>
                        <span className="group-hover/item:text-gray-300 transition-colors">{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
