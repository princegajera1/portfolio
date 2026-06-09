import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiLock, FiMail, FiArrowLeft, FiAlertTriangle, FiShield } from 'react-icons/fi';
import { signIn } from '../../firebase/auth';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const LOCKOUT_LIMIT = 3;
const LOCKOUT_DURATION = 30 * 1000; // 30 seconds

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Rate limiting states
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const { setUser, loginMock } = useAuth();

  // Load lockout state on mount
  useEffect(() => {
    const savedTime = localStorage.getItem('admin_login_lockout_time');
    const savedAttempts = localStorage.getItem('admin_login_attempts');
    
    if (savedAttempts) setAttempts(Number(savedAttempts));
    
    if (savedTime) {
      const remaining = Number(savedTime) + LOCKOUT_DURATION - Date.now();
      if (remaining > 0) {
        setLockoutTime(Number(savedTime));
        setCountdown(Math.ceil(remaining / 1000));
      } else {
        localStorage.removeItem('admin_login_lockout_time');
      }
    }
  }, []);

  // Countdown timer trigger
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setLockoutTime(0);
          setAttempts(0);
          localStorage.removeItem('admin_login_lockout_time');
          localStorage.setItem('admin_login_attempts', '0');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    if (!email.trim() || !password.trim()) {
      toast.error('Please complete all form credentials.');
      return;
    }

    try {
      setLoading(true);
      
      // Try login helper
      let loggedUser;
      try {
        loggedUser = await signIn(email.trim(), password);
      } catch (err) {
        // Fallback: mock login verification
        const mockSuccess = loginMock(email.trim(), password);
        if (mockSuccess) {
          loggedUser = { uid: 'mock-admin-id', email: email.toLowerCase().trim(), isMock: true };
        } else {
          throw err;
        }
      }

      // Success
      setUser(loggedUser);
      toast.success('Access granted! Scaffolding admin view...');
      
      // Reset attempts
      localStorage.setItem('admin_login_attempts', '0');
      navigate('/admin/overview');
    } catch (error) {
      console.error('Login trigger failed:', error);
      
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('admin_login_attempts', String(newAttempts));

      if (newAttempts >= LOCKOUT_LIMIT) {
        const now = Date.now();
        setLockoutTime(now);
        setCountdown(LOCKOUT_DURATION / 1000);
        localStorage.setItem('admin_login_lockout_time', String(now));
        toast.error('Too many failed attempts! Form locked for 30 seconds.');
      } else {
        toast.error(`Invalid admin credentials. (${LOCKOUT_LIMIT - newAttempts} attempts remaining)`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Portal | Prince Gajera Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#0A0A0F] flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans select-none">
        
        {/* Background grids */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] dark:opacity-[0.03] z-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(#6C63FF 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
        </div>

        {/* Ambient slowly moving background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 30, -15, 0],
              y: [0, -30, 15, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/3 w-[35vw] h-[35vw] rounded-full bg-primary/5 blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -20, 30, 0],
              y: [0, 20, -25, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 right-1/3 w-[35vw] h-[35vw] rounded-full bg-[#00D4FF]/5 blur-[120px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[440px] relative z-10 space-y-6"
        >
          {/* Logo Title */}
          <div className="text-center space-y-2">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-black font-display font-black text-base mx-auto shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300">
              P
            </span>
            <h1 className="font-display font-extrabold text-xl text-text-primary-dark">
              Admin Portal
            </h1>
            <span className="text-[10px] font-mono text-[#00D4FF] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
              <FiShield className="w-3.5 h-3.5" />
              Secure System Gateway
            </span>
          </div>

          {/* Login Card */}
          <Card className="border border-border-dark p-6 sm:p-8 bg-[#111118]/80 backdrop-blur-2xl rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-primary/25 transition-all duration-500">
            
            {/* Cyber Header decors inside card */}
            <div className="flex items-center justify-between border-b border-border-dark/60 pb-3 mb-6">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
                <span className="text-[8px] font-mono text-text-secondary-dark uppercase ml-2 select-none tracking-widest">// SEC_AUTH_NODE</span>
              </div>
              <span className="text-[8px] font-mono text-primary font-bold uppercase tracking-wider">
                AES-256
              </span>
            </div>

            {lockoutTime > 0 ? (
              <div className="text-center py-6 space-y-4">
                <FiAlertTriangle className="w-10 h-10 text-red-400 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold font-display text-text-primary-dark">
                    Portal Locked
                  </h3>
                  <p className="text-[9px] font-mono text-text-secondary-dark leading-relaxed">
                    Security protocols active due to multiple credential failures. Re-enabling gateway in:
                  </p>
                </div>
                <div className="text-3xl font-mono font-bold text-red-400">
                  {countdown}s
                </div>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                
                {/* Email Input */}
                <div className="space-y-2 text-left">
                  <label htmlFor="email" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-text-secondary-dark pl-1">
                    System Identity (Email)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-[13px] text-text-secondary-dark">
                      <FiMail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      placeholder="admin@portfolio.com"
                      className="w-full h-11 pl-10 pr-4 bg-surface-dark/40 border border-border-dark focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-text-primary-dark font-sans text-xs outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2 text-left">
                  <label htmlFor="password" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-text-secondary-dark pl-1">
                    Authorization Key
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-[13px] text-text-secondary-dark">
                      <FiLock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-10 bg-surface-dark/40 border border-border-dark focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-text-primary-dark font-sans text-xs outline-none transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-[13.5px] text-text-secondary-dark hover:text-text-primary-dark transition-colors"
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <Button
                  variant="primary"
                  type="submit"
                  isLoading={loading}
                  className="w-full py-4 text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Authorize Entry
                </Button>

              </form>
            )}

            {/* Micro Cyber Decal */}
            <span className="absolute bottom-2 left-4 font-mono text-[7px] text-white/5 select-none font-bold">
              SYS.SEC.VER: 1.2.9_AUTH
            </span>

          </Card>

          {/* Back link */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-text-secondary-dark hover:text-primary transition-colors active:scale-95"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>RETURN TO PUBLIC PORTFOLIO</span>
            </Link>
          </div>

        </motion.div>
      </div>
    </>
  );
}
export { LOCKOUT_LIMIT };
