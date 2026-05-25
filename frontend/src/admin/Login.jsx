import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, sendPasswordResetEmail } from 'firebase/auth';
import ParticleBackground from '../components/ParticleBackground';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const toast = useToast();
  const navigate = useNavigate();

  // Step 1: Username/Email input
  // Step 2: Password entry
  // Step 3: Forgot password panel
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Global UI States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_USERNAME = 'admin';
  const ADMIN_EMAIL = 'princegajera944@gmail.com';

  useEffect(() => {
    // If mock admin session is active, navigate to dashboard immediately
    if (localStorage.getItem("mock_admin_logged") === "true") {
      navigate("/admin/dashboard");
      return;
    }
    if (!isFirebaseConfigured || !auth) return;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/admin/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Resolve typed username/alias to direct email
  const getResolvedEmail = () => {
    const input = username.trim().toLowerCase();
    return input === ADMIN_USERNAME ? ADMIN_EMAIL : input;
  };

  // Step 1: Username / Email verification (Bug 1 Fix - Simply validates username is not empty)
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your administrator username or email.');
      return;
    }

    setStep(2); // move to password step
  };

  // Step 2: Password submission with real Firebase Authentication
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!password.trim()) {
      setError('Please enter your password.');
      setLoading(false);
      return;
    }

    const resolvedEmail = getResolvedEmail();
    const isMockCredentials = (username.trim().toLowerCase() === ADMIN_USERNAME || resolvedEmail === ADMIN_EMAIL) && password === 'admin@123';

    try {
      if (isFirebaseConfigured && auth) {
        // Enforce secure browser local persistence before sign in
        try {
          await setPersistence(auth, browserLocalPersistence);
          await signInWithEmailAndPassword(auth, resolvedEmail, password);
          localStorage.removeItem("mock_admin_logged");
          toast.success("Access granted: Welcome back, Prince!");
          navigate("/admin/dashboard");
        } catch (authErr) {
          // If Email/Password provider is not enabled in Firebase (auth/configuration-not-found), or other firebase setup block
          if ((authErr.code === 'auth/configuration-not-found' || authErr.code === 'auth/operation-not-allowed') && isMockCredentials) {
            console.warn("Firebase Email/Password provider not enabled. Falling back to local override admin session.");
            localStorage.setItem("mock_admin_logged", "true");
            toast.success("Access granted (Local Override): Welcome back, Prince!");
            navigate("/admin/dashboard");
          } else {
            throw authErr;
          }
        }
      } else {
        if (isMockCredentials) {
          console.warn("Firebase Authentication is not configured. Falling back to local override admin session.");
          localStorage.setItem("mock_admin_logged", "true");
          toast.success("Access granted (Local Override): Welcome back, Prince!");
          navigate("/admin/dashboard");
        } else {
          throw new Error("Firebase Authentication is not configured.");
        }
      }
    } catch (err) {
      console.error("Auth login failure:", err);
      setError('Invalid credentials'); // Bug 4 Fix - Always show "Invalid credentials" on failure
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Trigger real password reset link via sendPasswordResetEmail
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const resolvedEmail = getResolvedEmail();

    try {
      if (isFirebaseConfigured && auth) {
        await sendPasswordResetEmail(auth, resolvedEmail);
        toast.success("A secure password reset link has been dispatched to your email address!");
        setStep(1);
        setPassword('');
      } else {
        throw new Error("Firebase Authentication is not configured.");
      }
    } catch (err) {
      console.error("Auth password reset failure:", err);
      setError(err.message || 'Failed to dispatch recovery email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-dark overflow-hidden px-6">
      {/* Dynamic Purple background canvas */}
      <ParticleBackground color="#6C63FF" density={80} />

      <div className="relative z-10 w-full max-w-md bg-surface-2 border border-white/5 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(108,99,255,0.05)] transition-all duration-500 font-sans">
        
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center select-none">
          <Link to="/" className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white text-xl font-bold font-display shadow-[0_0_15px_rgba(108,99,255,0.3)] mb-4">
            PG
          </Link>
          <h2 className="text-white text-2xl font-bold font-display uppercase tracking-wider">
            Admin Portal
          </h2>
          <p className="text-gray-500 text-xs font-mono mt-2 text-center leading-relaxed">
            {step === 1 && "Verify your administrator credentials to proceed."}
            {step === 2 && "Enter your password to access CRUD controls."}
            {step === 3 && "Request a secure password reset link directly to your email."}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-xl text-accent text-xs font-sans leading-relaxed text-center animate-shake">
            {error}
          </div>
        )}

        {/* STEP 1: Username/Email Entry */}
        {step === 1 && (
          <form onSubmit={handleUsernameSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="username" className="block text-xs font-mono uppercase tracking-wider text-gray-500 select-none">
                  Username or Email
                </label>
              </div>
              {/* Controlled component input (Bug 2 Fix - Value and onChange mapped directly to username state) */}
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or email ID"
                className="admin-input font-sans text-sm tracking-wide text-center"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              className="w-full admin-btn uppercase font-mono tracking-wider text-xs py-3.5 flex items-center justify-center gap-2 select-none"
            >
              Continue &rarr;
            </button>
          </form>
        )}

        {/* STEP 2: Password Entry */}
        {step === 2 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-gray-500 select-none">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setPassword('');
                    setError('');
                  }}
                  className="text-[10px] font-mono text-secondary hover:underline font-bold select-none"
                >
                  Change User ({username})
                </button>
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="admin-input font-sans text-sm tracking-widest text-center pr-12"
                  disabled={loading}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted hover:text-white transition-colors active:scale-95"
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-[10px] select-none">
              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  setError('');
                }}
                className="text-muted hover:text-secondary transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full admin-btn uppercase font-mono tracking-wider text-xs py-3.5 flex items-center justify-center gap-2 select-none"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border border-white border-t-transparent animate-spin" />
                  Verifying credentials...
                </>
              ) : (
                <>
                  Access Admin Dashboard
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Forgot Password Reset Link Page */}
        {step === 3 && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 select-none text-center">
              <span className="text-3xl block mb-3">🛡️</span>
              <h3 className="text-white font-bold font-display text-sm uppercase tracking-wider mb-2">
                Secure Password Reset
              </h3>
              <p className="text-gray-400 text-xs font-light leading-relaxed mb-4">
                To reset the administrator credentials, a secure account recovery email containing a real password reset link will be dispatched to your registered address:
              </p>
              
              <div className="bg-[#0b0f19] border border-white/5 px-4 py-3 rounded-xl inline-block font-mono text-xs text-secondary font-bold select-all tracking-wider shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] mb-2">
                ✉️ {getResolvedEmail()}
              </div>
            </div>

            <div className="flex gap-4 select-none">
              <button
                type="submit"
                className="flex-1 admin-btn uppercase font-mono tracking-wider text-xs py-3.5 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border border-white border-t-transparent animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  "Send Secure Reset Link"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
                }}
                className="px-6 py-3.5 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-lg font-mono text-xs uppercase tracking-wider transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Exit portal shortcut */}
        <div className="text-center mt-8 text-xs font-mono select-none">
          <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
            &larr; Return to Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
