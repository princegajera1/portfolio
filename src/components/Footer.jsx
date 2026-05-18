import { Github, Linkedin, Instagram, Mail, Phone, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#0d0d15] pt-8 pb-4 z-10 overflow-hidden border-t border-white/[0.08]">
      {/* Dynamic Bright Border Accent at the top of the footer */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent-cyan via-accent-indigo to-accent-purple"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative text-center">
        {/* Glow behind icons */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-accent-cyan/10 blur-[50px] rounded-full pointer-events-none"></div>

        {/* Social Icons with much higher contrast and dynamic rings */}
        <div className="flex space-x-6 mb-4 relative z-10">
          <a href="https://github.com/princegajera1" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-full ring-2 ring-white/15 text-gray-100 hover:text-white hover:bg-white/20 hover:ring-white/40 hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Github size={20} strokeWidth={2} />
          </a>
          <a href="https://www.linkedin.com/in/gajera-prince/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#0A66C2]/15 rounded-full ring-2 ring-[#0A66C2]/30 text-gray-100 hover:text-white hover:bg-[#0A66C2] hover:ring-[#0A66C2]/50 hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(10,102,194,0.3)]">
            <Linkedin size={20} strokeWidth={2} />
          </a>
          <a href="https://www.instagram.com/gajera6902/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#E1306C]/15 rounded-full ring-2 ring-[#E1306C]/30 text-gray-100 hover:text-white hover:bg-[#E1306C] hover:ring-[#E1306C]/50 hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(225,48,108,0.3)]">
            <Instagram size={20} strokeWidth={2} />
          </a>
          <a href="mailto:princegajera944@gmail.com" className="p-2.5 bg-accent-cyan/15 rounded-full ring-2 ring-accent-cyan/30 text-gray-100 hover:text-white hover:bg-accent-cyan hover:ring-accent-cyan/50 hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <Mail size={20} strokeWidth={2} />
          </a>
        </div>

        {/* Designed & Built Label with clear high-contrast colors */}
        <p className="text-gray-100 text-base flex flex-wrap items-center justify-center gap-1.5 mb-1.5 font-medium">
          Designed & Built with 
          <Heart size={16} className="text-rose-500 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.9)]" fill="currentColor" /> 
          by 
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-indigo to-accent-purple tracking-wide">
            Gajera Prince
          </span>
        </p>
        
        {/* Clear Copyright Year */}
        <p className="text-gray-400 text-xs font-mono mb-4 tracking-wider">
          © {new Date().getFullYear()} Prince Gajera. All rights reserved.
        </p>

        {/* Highly Visible Tech Stack Badges */}
        <div className="flex flex-wrap justify-center items-center gap-3 text-gray-300 text-[10px] font-mono px-4 py-1.5 rounded-full bg-black/45 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <span className="hover:text-accent-cyan transition-colors">React</span>
          <span className="w-1 h-1 rounded-full bg-accent-indigo"></span>
          <span className="hover:text-accent-cyan transition-colors">Vite</span>
          <span className="w-1 h-1 rounded-full bg-accent-indigo"></span>
          <span className="hover:text-accent-cyan transition-colors">TailwindCSS</span>
          <span className="w-1 h-1 rounded-full bg-accent-indigo"></span>
          <span className="hover:text-accent-cyan transition-colors">Framer Motion</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
