import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an analytics or reporting service here
    console.error("ErrorBoundary caught an exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Premium Neon Glitch Error Fallback Screen
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#070714] text-white p-6 font-sans select-none relative overflow-hidden">
          {/* Subtle glowing neon circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-danger/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-md w-full bg-[#111126] border border-danger/10 p-8 rounded-3xl text-center space-y-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            {/* Warning Icon */}
            <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/25 flex items-center justify-center text-danger text-2xl font-bold mx-auto animate-pulse">
              ⚠️
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-white">
                Anomaly Intercepted
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                A minor rendering disruption occurred. The system protected the rest of the application shell from crashing.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#090916] border border-white/5 rounded-xl p-3.5 text-left select-text max-h-32 overflow-y-auto">
                <code className="text-[10px] font-mono text-danger font-semibold whitespace-pre-wrap break-all leading-normal">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 bg-gradient-to-r from-danger to-[#FF8500] hover:shadow-[0_0_20px_rgba(255,68,68,0.3)] text-white font-mono text-xs uppercase tracking-widest font-bold rounded-xl transition-all duration-300 active:scale-95"
            >
              🔄 Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
