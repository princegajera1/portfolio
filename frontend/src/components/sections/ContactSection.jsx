import { useNavigate } from 'react-router-dom';
import { FiMail, FiLinkedin, FiGithub, FiArrowRight, FiPhone } from 'react-icons/fi';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function ContactSection() {
  const navigate = useNavigate();

  return (
    <section id="contact" className="py-24 bg-bg-light dark:bg-bg-dark border-t border-border-light dark:border-border-dark relative overflow-hidden select-none">
      
      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center relative z-10 space-y-8">
        
        {/* Label */}
        <div className="space-y-2">
          <span className="section-label">// CONNECT</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Have a project in mind?
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-base font-sans max-w-lg mx-auto leading-relaxed">
            I'm currently open to full-time frontend developer roles, remote positions, and freelance projects. Let's build something world-class together.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Button
            variant="primary"
            onClick={() => navigate('/contact')}
            className="gap-2 group"
          >
            <span>Send a Message</span>
            <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            variant="secondary"
            onClick={() => window.open('mailto:princegajera944@gmail.com', '_blank')}
            className="gap-2"
          >
            <FiPhone className="w-4 h-4" />
            <span>Schedule a Call</span>
          </Button>
        </div>

        {/* Quick Contacts Icons */}
        <div className="flex justify-center items-center gap-6 pt-4">
          <a
            href="mailto:princegajera944@gmail.com"
            className="p-3 border border-border-light dark:border-border-dark hover:border-primary/50 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary rounded-xl transition-all duration-300 bg-white/5 active:scale-95 shadow-md"
            title="Email"
          >
            <FiMail className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/gajera-prince/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-border-light dark:border-border-dark hover:border-primary/50 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary rounded-xl transition-all duration-300 bg-white/5 active:scale-95 shadow-md"
            title="LinkedIn"
          >
            <FiLinkedin className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/princegajera1"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-border-light dark:border-border-dark hover:border-primary/50 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary rounded-xl transition-all duration-300 bg-white/5 active:scale-95 shadow-md"
            title="GitHub"
          >
            <FiGithub className="w-5 h-5" />
          </a>
        </div>

      </div>
    </section>
  );
}
