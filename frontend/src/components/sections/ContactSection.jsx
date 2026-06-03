import { useState } from 'react';
import emailjs from '@emailjs/browser';
import ParticleBackground from '../ParticleBackground';
import { saveMessage } from '../../firebase/messages';
import { useScrollReveal } from '../../hooks/useGSAP';
import { useToast } from '../../context/ToastContext';

// EmailJS v4 public configuration (safe to expose in frontend — public key only)
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'service_o4lgkbh';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_wcv25qp';
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'Z3PL6-Urve7mMWMe6N';

// Initialize EmailJS with public key (required for v4)
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  useScrollReveal('.scroll-reveal-contact');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('All inputs are required. Please fill out the form.');
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Message length verification (min 10 characters)
    if (message.trim().length < 10) {
      toast.error('Message must be at least 10 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Save to Firebase Firestore (PRIMARY — must succeed)
      await saveMessage(name, email, message);

      // Step 2: Send email notification via EmailJS (SECONDARY — failure is silent)
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name:  name,
            from_email: email,
            message:    message,
            to_email:   'princegajera944@gmail.com',
            reply_to:   email,
          }
        );
      } catch (emailErr) {
        // EmailJS failed — log it but don't block success since Firestore save worked
        console.warn('EmailJS notification failed (message still saved to DB):', emailErr);
      }

      // Show success — message is in the admin inbox regardless of email
      toast.success('Message sent! Prince will get back to you soon. 🚀');
      setFormData({ name: '', email: '', message: '' });

    } catch (error) {
      // Only show error if Firebase save itself failed
      console.error('Contact form — Firestore save failed:', error);
      toast.error('Could not send message. Please email directly: princegajera944@gmail.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative bg-dark overflow-hidden py-16 sm:py-20 px-6">
      {/* Dynamic Purple background particle canvas */}
      <ParticleBackground color="#6C63FF" density={100} />

      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="scroll-reveal-contact mb-12 text-center md:text-left select-none">
          <p className="text-secondary font-mono text-xs uppercase tracking-[0.25em] mb-2">&lt; Contact /&gt;</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white">Let's Connect</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Contact Details & Links */}
          <div className="scroll-reveal-contact md:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold font-display leading-tight">
                Have a project idea or internship opening?
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                I am always open to discussing new web development projects, creative designs, full-stack architectures, or junior developer roles. Send a message!
              </p>
            </div>

            {/* Quick Cards Grid */}
            <div className="space-y-4 font-mono text-xs text-gray-400 select-none">
              {/* Email Card — full card clickable */}
              <a 
                href="mailto:princegajera944@gmail.com" 
                className="flex items-center gap-4 bg-surface-2/60 border border-white/5 hover:border-primary/40 p-4 rounded-xl transition-all duration-200 hover:bg-surface-2/90 group cursor-pointer"
              >
                <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/50 flex items-center justify-center text-primary text-sm font-bold font-sans transition-colors">
                  @
                </span>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">Email me directly</p>
                  <span className="group-hover:text-primary transition-colors">princegajera944@gmail.com</span>
                </div>
              </a>

              {/* Phone Card — full card clickable */}
              <a 
                href="tel:+919727031027" 
                className="flex items-center gap-4 bg-surface-2/60 border border-white/5 hover:border-secondary/40 p-4 rounded-xl transition-all duration-200 hover:bg-surface-2/90 group cursor-pointer"
              >
                <span className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 group-hover:border-secondary/50 flex items-center justify-center text-secondary text-sm font-bold transition-colors">
                  📞
                </span>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">Call / WhatsApp</p>
                  <span className="group-hover:text-secondary transition-colors">+91 9727031027</span>
                </div>
              </a>

              {/* LinkedIn Card — full card clickable */}
              <a 
                href="https://www.linkedin.com/in/gajera-prince/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-4 bg-surface-2/60 border border-white/5 hover:border-accent/40 p-4 rounded-xl transition-all duration-200 hover:bg-surface-2/90 group cursor-pointer"
              >
                <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 group-hover:border-accent/50 flex items-center justify-center text-accent text-sm font-bold transition-colors">
                  💼
                </span>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">LinkedIn Profile</p>
                  <span className="group-hover:text-accent transition-colors">linkedin.com/in/gajera-prince</span>
                </div>
              </a>

              {/* GitHub Card — full card clickable */}
              <a 
                href="https://github.com/princegajera1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-4 bg-surface-2/60 border border-white/5 hover:border-secondary/40 p-4 rounded-xl transition-all duration-200 hover:bg-surface-2/90 group cursor-pointer"
              >
                <span className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 group-hover:border-secondary/50 flex items-center justify-center text-secondary text-sm font-bold transition-colors">
                  🔗
                </span>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">GitHub Repository</p>
                  <span className="group-hover:text-secondary transition-colors">github.com/princegajera1</span>
                </div>
              </a>
            </div>
          </div>

          {/* Contact Form panel */}
          <div className="scroll-reveal-contact md:col-span-7 bg-surface-2 border border-white/5 p-6 sm:p-8 rounded-2xl relative">

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-[10px] sm:text-xs font-mono uppercase tracking-wider text-gray-500 mb-2 select-none">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="admin-input font-sans text-xs sm:text-sm"
                    disabled={loading}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[10px] sm:text-xs font-mono uppercase tracking-wider text-gray-500 mb-2 select-none">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="admin-input font-sans text-xs sm:text-sm"
                    disabled={loading}
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] sm:text-xs font-mono uppercase tracking-wider text-gray-500 mb-2 select-none">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="How can Prince help you?"
                  className="admin-input font-sans text-xs sm:text-sm resize-none"
                  disabled={loading}
                  required
                  aria-required="true"
                />
              </div>

              <button
                type="submit"
                className="w-full admin-btn uppercase font-mono tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 select-none"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border border-white border-t-transparent animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    🚀 Launch Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
