import { motion } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, Award } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 flex items-center">
            <span className="text-accent-indigo mr-2">01.</span> About Me
            <div className="h-[1px] bg-white/10 flex-grow ml-6"></div>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Bio text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 space-y-3 text-gray-400 text-lg leading-relaxed font-medium"
          >
            <p className="text-xl text-gray-300 leading-relaxed font-heading">
              Hello! I'm <span className="text-white font-bold">Prince Gajera</span>, a passionate full-stack developer who loves engineering digital solutions that live on the internet.
            </p>
            <p>
              My journey into web development started when I began hacking together simple HTML sites. Fast-forward to today, I'm pursuing my B.E. in Computer Engineering at Gujarat Technological University.
            </p>
            <p className="text-gray-300 border-l-2 border-accent-indigo pl-4 py-1 italic">
              "My main focus is building highly accessible, inclusive products and premium digital experiences for clients."
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-mono text-accent-cyan">React.js</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-mono text-accent-cyan">Node.js</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-mono text-accent-cyan">TailwindCSS</span>
            </div>
            
            <div className="pt-2">
              <h3 className="text-xl font-heading font-semibold mb-4 text-white">Education Timeline</h3>
              <div className="relative border-l border-accent-indigo/30 ml-3 space-y-5">
                
                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-accent-indigo rounded-full -left-[6.5px] top-1.5 ring-4 ring-dark"></div>
                  <h4 className="text-lg font-medium text-white">B.E. Computer Engineering</h4>
                  <p className="text-sm text-gray-400 font-mono mb-1">GTU | 2023 – 2027</p>
                  <p className="text-sm text-gray-500">Focusing on full-stack web development and AI integration.</p>
                </div>

                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-accent-purple rounded-full -left-[6.5px] top-1.5 ring-4 ring-dark"></div>
                  <h4 className="text-lg font-medium text-white">HSC (Science)</h4>
                  <p className="text-sm text-gray-400 font-mono mb-1">Gujarat Board | 2023</p>
                </div>

                <div className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-accent-cyan rounded-full -left-[6.5px] top-1.5 ring-4 ring-dark"></div>
                  <h4 className="text-lg font-medium text-white">SSC</h4>
                  <p className="text-sm text-gray-400 font-mono mb-1">Gujarat Board | 2021</p>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Quick Info Cards with distinct glowing neon themes */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Box 1: Location - Cyan Theme */}
            <div className="glass p-6 rounded-xl border border-accent-cyan/15 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] hover:border-accent-cyan/60 transition-all duration-300 cursor-pointer group">
              <MapPin className="text-accent-cyan mb-3 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
              <h3 className="text-white font-semibold mb-1 group-hover:text-accent-cyan transition-colors">Location</h3>
              <p className="text-gray-400 text-sm">Ahmedabad, Gujarat</p>
            </div>

            {/* Box 2: Current Status - Purple Theme */}
            <div className="glass p-6 rounded-xl border border-accent-purple/15 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] hover:border-accent-purple/60 transition-all duration-300 cursor-pointer group">
              <Briefcase className="text-accent-purple mb-3 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
              <h3 className="text-white font-semibold mb-1 group-hover:text-accent-purple transition-colors">Current Status</h3>
              <p className="text-gray-400 text-sm">Student & Freelance Developer</p>
            </div>

            {/* Box 3: Education - Indigo Theme */}
            <div className="glass p-6 rounded-xl border border-accent-indigo/15 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:border-accent-indigo/60 transition-all duration-300 cursor-pointer group">
              <GraduationCap className="text-accent-indigo mb-3 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
              <h3 className="text-white font-semibold mb-1 group-hover:text-accent-indigo transition-colors">Education</h3>
              <p className="text-gray-400 text-sm">B.E. Computer Engineering (2027)</p>
            </div>

            {/* Box 4: Certification - Pink Theme */}
            <div className="glass p-6 rounded-xl border border-pink-500/15 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(244,114,182,0.25)] hover:border-pink-500/60 transition-all duration-300 cursor-pointer border-l-4 border-l-pink-500 group">
              <Award className="text-pink-500 mb-3 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
              <h3 className="text-white font-semibold mb-1 group-hover:text-pink-500 transition-colors">Certification</h3>
              <p className="text-gray-400 text-sm">Generative AI Certified</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
