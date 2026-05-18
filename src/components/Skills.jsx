import { motion } from 'framer-motion';
import { skillsData } from '../data/skills';

const Skills = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="skills" className="py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 flex items-center">
            <span className="text-accent-indigo mr-2">02.</span> Technical Skills
            <div className="h-[1px] bg-white/10 flex-grow ml-6"></div>
          </h2>
          <p className="text-gray-400 max-w-2xl">
            A comprehensive overview of the technologies and tools I use to build robust, scalable applications.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillsData.map((skillGroup, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="glass p-6 rounded-xl hover:-translate-y-2 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all duration-300 border-t border-t-white/10"
            >
              <h3 className="text-xl font-heading font-semibold text-white mb-6 border-b border-white/10 pb-3">
                {skillGroup.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((skill, i) => (
                  <motion.span 
                    key={i} 
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`px-4 py-2 text-sm font-mono rounded-lg border cursor-pointer ${skillGroup.color} hover:shadow-[0_0_15px_currentColor] transition-all duration-300 backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
