import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  FiMail, FiMapPin, FiClock, FiGithub, 
  FiLinkedin, FiTwitter, FiInstagram, FiSend 
} from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChatBot from '../components/ChatBot/ChatBot';
import CommandPalette from '../components/CommandPalette/CommandPalette';
import { saveMessage } from '../firebase/contact';
import useSettings from '../hooks/useSettings';
import { Input, Textarea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';
import useAnalytics from '../hooks/useAnalytics';
import { cn } from '../utils/cn';

// EmailJS config
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_o4lgkbh';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_wcv25qp';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'sR2riH9sOxnHIS31u';

if (PUBLIC_KEY) {
  emailjs.init({ publicKey: PUBLIC_KEY });
}

export default function Contact() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Job Opportunity', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { trackPageView } = useAnalytics();


  useEffect(() => {
    trackPageView('/contact');
  }, [trackPageView]);

  const validate = () => {
    const errs = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!emailRe.test(formData.email.trim())) errs.email = 'Please enter a valid email';
    if (!formData.message.trim()) errs.message = 'Message content is required';
    return errs;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please resolve all validation errors.');
      return;
    }

    try {
      setSubmitting(true);
      const { name, email, subject, message } = formData;

      // 1. Save to Firestore messages collection
      await saveMessage(name, email, subject, message);

      // 2. Send via EmailJS (if credentials exist)
      if (PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID) {
        try {
          console.log('Attempting to send email via EmailJS...', {
            serviceId: SERVICE_ID,
            templateId: TEMPLATE_ID,
            publicKey: PUBLIC_KEY
          });
          await emailjs.send(
            SERVICE_ID, 
            TEMPLATE_ID, 
            {
              from_name: name,
              from_email: email,
              subject: subject,
              message: message,
              to_email: settings?.email || 'princegajera944@gmail.com'
            },
            {
              publicKey: PUBLIC_KEY
            }
          );
        } catch (emailErr) {
          console.warn('EmailJS delivery failed (Message saved in DB):', emailErr);
          toast.error(`Email copy failed to send: ${emailErr?.text || emailErr?.message || 'Check EmailJS config'}`);
        }
      }

      toast.success("Message sent! I'll reply within 24 hours. 🚀");
      setFormData({ name: '', email: '', subject: 'Job Opportunity', message: '' });
      setErrors({});
    } catch (err) {
      console.error('Contact submission error:', err);
      toast.error('Failed to deliver message. Please email me directly!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Prince Gajera | Frontend Developer Jobs</title>
        <meta name="description" content="Reach out to Prince Gajera for frontend developer jobs, freelance project queries, or open source collaborations." />
      </Helmet>

      <Navbar />

      <main className="bg-bg-dark pt-32 pb-16 text-left relative overflow-hidden font-sans">
        
        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] z-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(#6C63FF 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Availabilities & Social profile connections */}
          <div className="lg:col-span-5 space-y-8 select-none">
            
            <div className="space-y-4">
              <Badge variant="success" className="gap-2 px-3 py-1 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
                Available for Remote Work
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight leading-[1.1]">
                Let's Work Together
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm leading-relaxed max-w-sm">
                If you have a frontend developer job opening, freelance requirements, or simply want to chat, send a message.
              </p>
            </div>

            {/* Availability Detail Cards */}
            <div className="space-y-4 max-w-sm">
              <Card 
                className="border border-border-light dark:border-border-dark"
                bodyClassName="p-4 flex items-center gap-3.5"
              >
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <FiMail className="w-4.5 h-4.5" />
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] font-mono font-bold text-text-secondary-dark uppercase">Direct Email</div>
                  <a href={`mailto:${settings?.email || 'princegajera944@gmail.com'}`} className="text-xs sm:text-sm font-semibold text-text-primary-light dark:text-text-primary-dark hover:text-primary transition-colors">
                    {settings?.email || 'princegajera944@gmail.com'}
                  </a>
                </div>
              </Card>

              <Card 
                className="border border-border-light dark:border-border-dark"
                bodyClassName="p-4 flex items-center gap-3.5"
              >
                <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary flex-shrink-0">
                  <FiMapPin className="w-4.5 h-4.5" />
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] font-mono font-bold text-text-secondary-dark uppercase">Location</div>
                  <span className="text-xs sm:text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Ahmedabad, Gujarat, India (Remote Friendly)
                  </span>
                </div>
              </Card>

              <Card 
                className="border border-border-light dark:border-border-dark"
                bodyClassName="p-4 flex items-center gap-3.5"
              >
                <div className="p-2.5 rounded-lg bg-pink-500/10 text-pink-400 flex-shrink-0">
                  <FiClock className="w-4.5 h-4.5" />
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] font-mono font-bold text-text-secondary-dark uppercase">Typical Response Time</div>
                  <span className="text-xs sm:text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Within 24 Hours
                  </span>
                </div>
              </Card>
            </div>

            {/* Social Anchors Row */}
            <div className="flex gap-4 pt-2">
              <a href={settings?.socialLinks?.github || "https://github.com/princegajera1"} target="_blank" rel="noopener noreferrer" className="p-3 border border-border-light dark:border-border-dark hover:border-primary/50 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary rounded-xl transition-all bg-white/5 shadow-md">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href={settings?.socialLinks?.linkedin || "https://www.linkedin.com/in/gajera-prince/"} target="_blank" rel="noopener noreferrer" className="p-3 border border-border-light dark:border-border-dark hover:border-primary/50 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary rounded-xl transition-all bg-white/5 shadow-md">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href={settings?.socialLinks?.twitter || "https://x.com/GajeraPrin20670"} target="_blank" rel="noopener noreferrer" className="p-3 border border-border-light dark:border-border-dark hover:border-primary/50 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary rounded-xl transition-all bg-white/5 shadow-md">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href={settings?.socialLinks?.instagram || "https://www.instagram.com/gajera6902/"} target="_blank" rel="noopener noreferrer" className="p-3 border border-border-light dark:border-border-dark hover:border-primary/50 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary rounded-xl transition-all bg-white/5 shadow-md">
                <FiInstagram className="w-5 h-5" />
              </a>
            </div>

            {/* Office hours visualization */}
            <div className="pt-4 space-y-2 max-w-sm">
              <h5 className="font-mono text-[9px] font-bold text-text-secondary-dark uppercase tracking-wider">
                Availability Calendar (IST)
              </h5>
              <div className="grid grid-cols-7 gap-1.5 font-mono text-[8px] text-center select-none">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div key={idx} className={cn(
                    'py-2 border rounded font-bold',
                    idx < 5 
                      ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400' 
                      : 'border-border-light dark:border-border-dark text-text-secondary-dark bg-white/5'
                  )}>
                    {day}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Contact Input Form */}
          <div className="lg:col-span-7 w-full">
            <Card className="border border-border-light dark:border-border-dark p-6 sm:p-8 bg-white/70 dark:bg-[#111118]/70 backdrop-blur-2xl rounded-2xl shadow-xl">
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Name */}
                <Input
                  label="Your Name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                />

                {/* Email */}
                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                />

                {/* Subject Selector */}
                <div className="relative w-full mb-6 font-sans text-left">
                  <label htmlFor="subject" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-text-secondary-dark mb-2 pl-1 select-none">
                    Subject Dropdown
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 bg-surface-dark/60 border border-border-dark focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-text-primary-dark font-sans text-sm outline-none transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="Job Opportunity">Job Opportunity</option>
                    <option value="Freelance Project">Freelance Project</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="General Question">General Question</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <Textarea
                  label="Message Content"
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  error={errors.message}
                  required
                />

                {/* Submit button */}
                <Button
                  variant="primary"
                  type="submit"
                  isLoading={submitting}
                  className="w-full py-4 gap-2"
                >
                  <FiSend className="w-4 h-4" />
                  <span>Send Message</span>
                </Button>

              </form>

            </Card>
          </div>

        </div>

        {/* ── Book a Meeting CTA ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative"
        >
          {/* Ambient glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative rounded-2xl border border-border-dark overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(17,17,24,0.97) 0%, rgba(12,12,18,0.99) 100%)' }}
          >
            {/* Top gradient bar */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary via-purple-400 to-secondary" />

            <div className="flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-10">

              {/* Left: Icon + text */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="section-label">// SCHEDULE A CALL</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary-dark tracking-tight">
                  Let&apos;s{' '}
                  <span className="bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
                    Talk Business
                  </span>
                </h2>
                <p className="text-text-secondary-dark text-sm mt-3 max-w-md leading-relaxed">
                  Pick a time that works for you — discuss your project, tech stack,
                  budget & next steps in a free 30-minute call.
                </p>

                {/* Quick badges */}
                <div className="flex flex-wrap gap-2 mt-5 justify-center lg:justify-start">
                  {[
                    { icon: '⏱️', text: '30 Min' },
                    { icon: '💰', text: 'Free' },
                    { icon: '📹', text: 'Google Meet' },
                    { icon: '🌏', text: 'IST UTC+5:30' },
                    { icon: '✅', text: 'Instant Confirm' },
                  ].map(({ icon, text }) => (
                    <span
                      key={text}
                      className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-full border border-border-dark bg-surface-dark/50 text-text-secondary-dark"
                    >
                      {icon} {text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: CTA button + availability */}
              <div className="flex flex-col items-center gap-4 flex-shrink-0">
                {/* Availability indicator */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/8">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-mono">Available for new projects</span>
                </div>

                {/* Main CTA */}
                <motion.button
                  onClick={() => navigate('/booking')}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 32px rgba(124,58,237,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  className="relative group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-sm overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                >
                  {/* Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book a Free Meeting
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>

                <p className="text-[10px] text-text-secondary-dark font-mono text-center">
                  Mon–Fri: 10 AM–7 PM · Sat: 10 AM–4 PM · IST
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <ChatBot />
      <CommandPalette />

      <Footer />
    </>
  );
}
