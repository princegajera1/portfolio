import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-dark overflow-hidden px-6 py-24 select-none">
      {/* Dark Neon Particle canvas */}
      <ParticleBackground color="#FF5E62" density={70} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 font-sans space-y-8">
        {/* Neon Glowing Glitch Error Code */}
        <div className="relative inline-block animate-pulse">
          <h1 className="text-8xl sm:text-9xl font-black font-display tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-secondary drop-shadow-[0_0_35px_rgba(255,94,98,0.3)]">
            404
          </h1>
          <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent blur-[2px]" />
        </div>

        {/* Core details */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Dimension Lost
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
            The coordinates you requested do not exist in this database. You've strayed past the edge of the sandbox.
          </p>
        </div>

        {/* Buttons / Actions */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-mono text-xs uppercase tracking-wider font-semibold hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all duration-300 active:scale-95 text-center"
          >
            ← Return to Reality
          </Link>
          <a
            href="https://github.com/princegajera1"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-gray-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 text-center"
          >
            Report Bug
          </a>
        </div>
      </div>
    </div>
  );
}
