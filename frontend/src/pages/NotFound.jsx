import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

export default function NotFound() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center bg-dark overflow-hidden px-6 py-24 select-none">
      <ParticleBackground color="#E8FF00" density={50} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 font-sans space-y-8">
        
        {/* Neon Error Code */}
        <div className="relative inline-block animate-pulse">
          <h1 className="text-8xl sm:text-9xl font-black font-display tracking-widest text-primary drop-shadow-[0_0_30px_rgba(232,255,0,0.2)]">
            404
          </h1>
          <span className="absolute -bottom-2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Content details */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Lost in Code
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-mono">
            This route does not map to any active endpoint in Prince's portfolio. You have exited the sandbox.
          </p>
        </div>

        {/* Action Link button */}
        <div className="pt-4 flex justify-center">
          <Link
            to="/"
            className="px-8 py-4 bg-primary text-black font-mono text-xs uppercase tracking-wider font-bold hover:bg-white hover:shadow-[0_0_20px_rgba(232,255,0,0.3)] transition-all duration-300 active:scale-95 text-center"
          >
            ← Return to Reality
          </Link>
        </div>
      </div>
    </div>
  );
}
