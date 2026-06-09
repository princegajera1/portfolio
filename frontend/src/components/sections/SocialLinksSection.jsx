import { motion } from 'framer-motion';
import { SiGithub, SiLinkedin, SiTwitter, SiInstagram } from 'react-icons/si';
import { FiMail, FiFileText, FiArrowUpRight } from 'react-icons/fi';
import useSettings from '../../hooks/useSettings';
import Card from '../ui/Card';
import { incrementDownloadCount } from '../../firebase/resume';

export default function SocialLinksSection() {
  const { settings, loading } = useSettings();

  if (loading || !settings) {
    return (
      <div className="py-12 text-center text-xs font-mono text-text-secondary-dark">
        Syncing networks...
      </div>
    );
  }

  const { socialLinks = {}, email, resumeUrl } = settings;

  const links = [
    {
      name: 'GitHub',
      handle: socialLinks.github ? socialLinks.github.replace('https://github.com/', '@') : '@princegajera',
      url: socialLinks.github || 'https://github.com/princegajera1',
      icon: SiGithub,
      color: '#FFFFFF',
      visible: socialLinks.github_visible !== false
    },
    {
      name: 'LinkedIn',
      handle: socialLinks.linkedin ? socialLinks.linkedin.replace('https://www.linkedin.com/in/', '@') : '@princegajera',
      url: socialLinks.linkedin || 'https://www.linkedin.com/in/gajera-prince/',
      icon: SiLinkedin,
      color: '#0A66C2',
      visible: socialLinks.linkedin_visible !== false
    },
    {
      name: 'Twitter/X',
      handle: socialLinks.twitter ? socialLinks.twitter.replace('https://x.com/', '@').replace('https://twitter.com/', '@') : '@princegajera',
      url: socialLinks.twitter || 'https://x.com/PrinceGajera14',
      icon: SiTwitter,
      color: '#1DA1F2',
      visible: socialLinks.twitter_visible !== false
    },
    {
      name: 'Instagram',
      handle: socialLinks.instagram ? socialLinks.instagram.replace('https://instagram.com/', '@') : '@princegajera',
      url: socialLinks.instagram || 'https://www.instagram.com/gajera6902/',
      icon: SiInstagram,
      color: '#E1306C',
      visible: socialLinks.instagram_visible !== false
    },
    {
      name: 'Email Address',
      handle: email || 'princegajera944@gmail.com',
      url: email ? `mailto:${email}` : 'mailto:princegajera944@gmail.com',
      icon: FiMail,
      color: '#EA4335',
      visible: socialLinks.email_visible !== false
    },
    {
      name: 'Resume PDF',
      handle: 'Direct CV Download',
      url: resumeUrl || '/resume.pdf',
      icon: FiFileText,
      color: '#CCFF00',
      isDownload: true,
      visible: true
    }
  ].filter(link => link.url && link.visible); // filter out empty URLs

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  return (
    <section id="connect" className="py-24 bg-[#0A0A0F]/90 border-t border-border-dark select-none relative overflow-hidden">
      
      {/* Decorative cyber grid background */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-xl mb-16 space-y-2 text-left">
          <span className="section-label text-[#CCFF00] font-mono tracking-[0.2em] font-bold">// CONNECT</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary-dark tracking-tight">
            Digital Networks
          </h2>
          <p className="text-text-secondary-dark text-xs sm:text-sm font-sans leading-relaxed">
            Direct gateways to my developer profiles, code repositories, writing boards, and professional CV.
          </p>
        </div>

        {/* Links Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-5%' }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <motion.div key={link.name} variants={cardVariants}>
                <a 
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  download={link.isDownload ? "Prince_Gajera_CV.pdf" : undefined}
                  onClick={link.isDownload ? () => incrementDownloadCount().catch(err => console.error(err)) : undefined}
                  className="block group"
                >
                  <Card 
                    className="bg-[#111118]/40 border border-border-dark rounded-2xl hover:border-[#CCFF00]/30 hover:shadow-[0_0_20px_rgba(204,255,0,0.06)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-36 relative overflow-hidden text-left"
                    bodyClassName="p-6 flex flex-col justify-between h-full"
                  >
                    
                    {/* Corner arrow icon */}
                    <div className="absolute top-4 right-4 text-text-secondary-dark group-hover:text-[#CCFF00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                      <FiArrowUpRight className="w-4.5 h-4.5" />
                    </div>

                    {/* Platform Icon */}
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-border-dark flex items-center justify-center transition-all duration-300 group-hover:border-[#CCFF00]/20">
                      <Icon className="w-5 h-5" style={{ color: link.color }} />
                    </div>

                    {/* Meta details */}
                    <div className="mt-4 space-y-0.5">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-secondary-dark">
                        {link.name}
                      </div>
                      <div className="text-xs font-semibold text-text-primary-dark truncate pr-4">
                        {link.handle}
                      </div>
                    </div>

                  </Card>
                </a>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
