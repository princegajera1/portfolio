"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // If already authorized, redirect immediately
    const isAuth = localStorage.getItem("adminAuth") === "true";
    if (isAuth) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password === "admin@123") {
      localStorage.setItem("adminAuth", "true");

      // Sweet scale-down success exit animation before navigating
      gsap.to(".login-card", {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          router.push("/admin/dashboard");
        },
      });
    } else {
      setError("Invalid Administrator password. Please try again.");

      // Dynamic GSAP shake animation for incorrect password
      const tl = gsap.timeline();
      tl.to(".login-card", { x: -10, duration: 0.05 })
        .to(".login-card", { x: 10, duration: 0.05, repeat: 5, yoyo: true })
        .to(".login-card", { x: 0, duration: 0.05 });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-custom-carrotOrange/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-custom-midnightGreen/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-custom-carrotOrange transition-colors mb-6 group font-mono text-xs uppercase tracking-widest"
          >
            <ArrowLeft size={14} className="mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>
        </div>

        <div className="login-card glass rounded-2xl border border-white/10 p-8 md:p-10 shadow-2xl relative bg-black/40 backdrop-blur-md">
          {/* Top dynamic bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-custom-midnightGreen via-custom-carrotOrange to-custom-gargoyleGas rounded-t-2xl"></div>

          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-white/5 border border-white/10 rounded-2xl mb-4 text-custom-carrotOrange">
              <Lock size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
              Console Sign In
            </h2>
            <p className="mt-2 text-sm text-gray-400 font-light">
              Enter admin key to modify portfolio database
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Lock size={18} strokeWidth={1.5} />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] transition-all font-sans"
                placeholder="Admin Password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3 text-xs font-mono">
                <ShieldAlert size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-custom-midnightGreen to-custom-carrotOrange hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366f1]/50 shadow-lg shadow-[#6366f1]/20 hover:shadow-[#6366f1]/30 hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0 uppercase tracking-wider"
              >
                Authenticate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
