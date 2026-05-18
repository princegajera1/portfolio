import { useState, useRef } from 'react';
import { Send, CheckCircle, AlertCircle, Mail, MapPin, Phone, Github, Linkedin, Instagram } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const formRef = useRef();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });

    tl.fromTo('.contact-header', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo('.contact-form-container', 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 
      "-=0.2"
    );
  }, { scope: sectionRef });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      setStatus('error');
      setTimeout(() => setStatus(null), 5000);
      return;
    }
    
    setLoading(true);
    setStatus(null);
    try {
      const apiFormData = new FormData();
      apiFormData.append("access_key", "b31f5477-33da-4f53-b479-388f0923be95");
      apiFormData.append("name", name.trim());
      apiFormData.append("email", email.trim());
      apiFormData.append("message", message.trim());
      apiFormData.append("subject", `Portfolio Contact from ${name.trim()}`);

      // Submission to Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: apiFormData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        console.error("Formspree Error:", errorData);
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
           setStatus('success');
           setForm({ name: '', email: '', message: '' });
        } else {
           setStatus('error');
        }
      }
    } catch (err) {
      console.error(err);
      if (window.location.hostname === 'localhost') {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-14 relative bg-custom-richBlack">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center text-center max-w-2xl mx-auto contact-header opacity-0">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 flex items-center justify-center">
            <span className="text-custom-carrotOrange mr-2">05.</span> What's Next?
          </h2>
          <p className="text-gray-400 text-lg font-light">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, 
            I'll try my best to get back to you!
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-12 contact-form-container opacity-0">
          {/* Contact Form - Centered perfectly */}
          <div className="glass p-8 rounded-2xl flex flex-col shadow-2xl border border-white/5 relative overflow-hidden group">
            {/* Elegant Background gradient */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-custom-midnightGreen/20 blur-[80px] rounded-full group-hover:bg-custom-carrotOrange/10 transition-colors duration-1000"></div>

            <form 
              ref={formRef} 
              onSubmit={handleSubmit} 
              className="space-y-6 flex flex-col flex-grow relative z-10"
            >
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs md:text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-custom-richBlack/50 border border-white/10 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-custom-carrotOrange focus:ring-1 focus:ring-custom-carrotOrange transition-all placeholder-gray-600 hover:bg-custom-richBlack/80 shadow-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs md:text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-custom-richBlack/50 border border-white/10 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-custom-carrotOrange focus:ring-1 focus:ring-custom-carrotOrange transition-all placeholder-gray-600 hover:bg-custom-richBlack/80 shadow-sm"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs md:text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-custom-richBlack/50 border border-white/10 rounded-xl px-5 py-4 text-white font-medium focus:outline-none focus:border-custom-carrotOrange focus:ring-1 focus:ring-custom-carrotOrange transition-all resize-none placeholder-gray-600 min-h-[140px] hover:bg-custom-richBlack/80 shadow-sm"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-2">
                {status === 'error' && (
                  <div className="flex items-center text-red-400 text-xs mb-3 font-semibold">
                    <AlertCircle size={14} className="mr-2" />
                    Please fill out all fields.
                  </div>
                )}

                {status === 'success' && (
                  <div className="flex items-center text-emerald-400 text-xs md:text-sm mb-3 font-bold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                    <CheckCircle size={16} className="mr-2" strokeWidth={2} />
                    Message sent successfully! I'll get back to you soon.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative py-4 bg-gradient-to-r from-custom-midnightGreen to-custom-carrotOrange text-white rounded-xl font-bold shadow-lg hover:shadow-custom-carrotOrange/30 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10"></div>
                  ) : (
                    <>
                      <span className="relative z-10 text-sm md:text-base uppercase tracking-widest font-bold font-mono">Send Message</span>
                      <Send size={16} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
