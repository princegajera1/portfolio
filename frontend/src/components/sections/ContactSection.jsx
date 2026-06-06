import { useState } from 'react';
import emailjs from '@emailjs/browser';
import ParticleBackground from '../ParticleBackground';
import { saveMessage } from '../../firebase/messages';
import { useScrollReveal } from '../../hooks/useGSAP';
import { useToast } from '../../context/ToastContext';

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'service_o4lgkbh';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_wcv25qp';
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'Z3PL6-Urve7mMWMe6N';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [btnState, setBtnState] = useState('idle'); // idle | loading | success
  const toast = useToast();
  useScrollReveal('.scroll-reveal-contact');

  const validate = () => {
    const errs = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) errs.name = 'name required';
    if (!formData.email.trim()) errs.email = 'email required';
    else if (!emailRe.test(formData.email.trim())) errs.email = 'invalid email';
    if (!formData.message.trim()) errs.message = 'message required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error('Please fill in all the conversational blanks.');
      return;
    }
    setErrors({});
    setLoading(true);
    setBtnState('loading');
    const { name, email, message } = formData;

    try {
      await saveMessage(name, email, message);
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
        console.warn('EmailJS notification failed (saved to DB):', emailErr);
      }

      setBtnState('success');
      toast.success('Message sent! I will get back to you soon. 🚀');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setBtnState('idle'), 3000);

    } catch (error) {
      console.error('Contact submit failed:', error);
      setBtnState('idle');
      toast.error('Error transmitting. Please email me directly instead!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative bg-dark overflow-hidden py-24 px-6">
      <ParticleBackground color="#E8FF00" density={40} />

      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Label */}
        <div className="scroll-reveal-contact mb-12 text-center md:text-left select-none">
          <span className="section-label block mb-2">// 04. connect</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white">Let's Talk</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Typographic "Let's Talk" Callout */}
          <div className="scroll-reveal-contact lg:col-span-5 space-y-8">
            <div className="space-y-4">
              {/* Availability Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary font-mono text-[10px] uppercase font-bold tracking-wider rounded-none">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>Available for freelance</span>
              </div>

              <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold font-display leading-tight">
                Have a project in mind?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Drop me a direct email or connect through my social links. I respond to all inquiries within 24 hours.
              </p>
            </div>

            {/* Large clickable email link */}
            <div className="pt-4 select-text">
              <a 
                href="mailto:princegajera944@gmail.com" 
                className="group inline-flex items-center gap-2 text-xl sm:text-2xl font-black font-display text-primary hover:text-white transition-colors duration-300 border-b border-primary/40 pb-1"
              >
                princegajera944@gmail.com
                <span className="transform transition-transform group-hover:translate-x-1.5 font-sans">→</span>
              </a>
            </div>

            {/* Social Text links (No icons in a row) */}
            <div className="flex flex-col gap-3 font-mono text-xs text-gray-400 pt-4 select-none">
              <a 
                href="https://github.com/princegajera1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group inline-flex items-center gap-1.5 hover:text-white transition-colors w-max"
              >
                <span>[github.com/princegajera1]</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/gajera-prince/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group inline-flex items-center gap-1.5 hover:text-white transition-colors w-max"
              >
                <span>[linkedin.com/in/gajera-prince]</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
              </a>
            </div>
          </div>

          {/* Conversational sentence-based form */}
          <div className="scroll-reveal-contact lg:col-span-7 bg-[#111] border border-white/5 p-8 relative">
            <form onSubmit={handleSubmit} className="space-y-8 font-sans">
              
              {/* Conversational input text block */}
              <div className="text-base sm:text-lg md:text-xl text-gray-400 leading-loose select-text">
                Hello Prince, my name is{' '}
                <span className="inline-block relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="your name"
                    className={`bg-transparent border-b ${errors.name ? 'border-red-500 text-red-400' : 'border-white/20 focus:border-primary'} text-white placeholder-gray-600 focus:outline-none px-2 py-0.5 text-center font-bold tracking-tight w-40 sm:w-48`}
                    disabled={loading}
                  />
                </span>
                . I am looking to collaborate on{' '}
                <span className="inline-block relative">
                  <input
                    type="text"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="a web project"
                    className={`bg-transparent border-b ${errors.message ? 'border-red-500 text-red-400' : 'border-white/20 focus:border-primary'} text-white placeholder-gray-600 focus:outline-none px-2 py-0.5 text-center font-bold tracking-tight w-48 sm:w-64`}
                    disabled={loading}
                  />
                </span>
                . You can reach me at{' '}
                <span className="inline-block relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your email address"
                    className={`bg-transparent border-b ${errors.email ? 'border-red-500 text-red-400' : 'border-white/20 focus:border-primary'} text-white placeholder-gray-600 focus:outline-none px-2 py-0.5 text-center font-bold tracking-tight w-56 sm:w-72`}
                    disabled={loading}
                  />
                </span>
                .
              </div>

              {/* Submit trigger button */}
              <button
                type="submit"
                className={`w-full py-4 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 select-none ${
                  btnState === 'success' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-primary text-black hover:bg-white hover:shadow-[0_4px_20px_rgba(232,255,0,0.25)]'
                }`}
                disabled={loading || btnState === 'success'}
                style={{ minHeight: '48px' }}
              >
                {btnState === 'loading' && (
                  <><span className="w-4 h-4 rounded-full border border-black border-t-transparent animate-spin" /> Transmitting...</>
                )}
                {btnState === 'success' && '✓ Message Sent'}
                {btnState === 'idle'    && 'Send Message →'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
