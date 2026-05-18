import { Github, Linkedin, Instagram, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-custom-richBlack pt-12 pb-6 z-10 overflow-hidden border-t border-white/[0.05]">
      {/* Dynamic Bright Border Accent at the top of the footer */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-custom-midnightGreen via-custom-carrotOrange to-custom-gargoyleGas"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative text-center">
        {/* Glow behind icons */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-32 bg-custom-carrotOrange/5 blur-[80px] rounded-full pointer-events-none"></div>

        {/* Social Icons with premium styling */}
        <div className="flex space-x-6 mb-8 relative z-10">
          <a href="https://github.com/princegajera1" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full ring-1 ring-white/10 text-gray-300 hover:text-custom-carrotOrange hover:bg-white/10 hover:ring-custom-carrotOrange/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(240,128,60,0.3)]">
            <Github size={20} strokeWidth={1.5} />
          </a>
          <a href="https://www.linkedin.com/in/gajera-prince/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full ring-1 ring-white/10 text-gray-300 hover:text-[#0A66C2] hover:bg-white/10 hover:ring-[#0A66C2]/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(10,102,194,0.3)]">
            <Linkedin size={20} strokeWidth={1.5} />
          </a>
          <a href="https://www.instagram.com/gajera6902/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full ring-1 ring-white/10 text-gray-300 hover:text-[#E1306C] hover:bg-white/10 hover:ring-[#E1306C]/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(225,48,108,0.3)]">
            <Instagram size={20} strokeWidth={1.5} />
          </a>
          <a href="mailto:princegajera944@gmail.com" className="p-3 bg-white/5 rounded-full ring-1 ring-white/10 text-gray-300 hover:text-custom-carrotOrange hover:bg-white/10 hover:ring-custom-carrotOrange/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Mail size={20} strokeWidth={1.5} />
          </a>
        </div>

        {/* Designed & Built Label */}
        <p className="text-gray-300 text-base flex flex-wrap items-center justify-center gap-2 mb-3 font-light">
          Engineered & Designed with 
          <Heart size={16} className="text-custom-carrotOrange animate-pulse" fill="currentColor" /> 
          by 
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-custom-midnightGreen to-custom-carrotOrange tracking-wide font-heading">
            Gajera Prince
          </span>
        </p>
        
        {/* Clear Copyright Year */}
        <p className="text-gray-500 text-xs font-mono mb-6 tracking-wider uppercase">
          © {new Date().getFullYear()} Prince Gajera. All rights reserved.
        </p>

        {/* Highly Visible Tech Stack Badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-gray-400 text-[11px] font-mono px-5 py-2 rounded-full bg-black/40 border border-white/5">
          <span className="hover:text-custom-gargoyleGas transition-colors">React</span>
          <span className="w-1 h-1 rounded-full bg-custom-midnightGreen"></span>
          <span className="hover:text-custom-gargoyleGas transition-colors">Vite</span>
          <span className="w-1 h-1 rounded-full bg-custom-midnightGreen"></span>
          <span className="hover:text-custom-gargoyleGas transition-colors">TailwindCSS</span>
          <span className="w-1 h-1 rounded-full bg-custom-midnightGreen"></span>
          <span className="hover:text-custom-gargoyleGas transition-colors">GSAP</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
