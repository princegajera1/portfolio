import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatSlotDisplay } from '../../utils/slotGenerator';
import { formatDateDisplay } from '../../utils/dateHelpers';
import { createBooking } from '../../firebase/bookingService';
import emailjs from '@emailjs/browser';
import useSettings from '../../hooks/useSettings';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_o4lgkbh';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_wcv25qp';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'sR2riH9sOxnHIS31u';

if (PUBLIC_KEY) {
  emailjs.init({ publicKey: PUBLIC_KEY });
}

const PURPOSES = [
  'Project Discussion',
  'Technical Consultation',
  'Freelance Inquiry',
  'Job Opportunity',
  'Other',
];

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 14px',
  color: '#f8fafc',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color .2s',
};

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
        {label} <span style={{ color: '#ef4444' }}>*</span>
      </label>
      {children}
      {error && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

export default function BookingModal({ selectedDate, selectedSlot, dateKey, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', purpose: 'Project Discussion' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [slotTaken, setSlotTaken] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { settings } = useSettings();

  // Lock background scroll when open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setSubmitError('');
    setSlotTaken(false);

    const result = await createBooking({
      dateKey,
      time: selectedSlot,
      name: form.name,
      email: form.email,
      phone: form.phone,
      purpose: form.purpose,
    });

    setSubmitting(false);

    if (result.success) {
      // Send notification email via EmailJS
      if (PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID) {
        try {
          const emailMessage = `A new meeting has been scheduled on your portfolio.\n\n` +
            `👤 Name: ${form.name}\n` +
            `📧 Email: ${form.email}\n` +
            `📞 Phone: ${form.phone}\n` +
            `📅 Date: ${formatDateDisplay(selectedDate)}\n` +
            `🕐 Time Slot: ${formatSlotDisplay(selectedSlot)}\n` +
            `🎯 Purpose: ${form.purpose}`;

          await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
              from_name: form.name,
              from_email: form.email,
              subject: `New Portfolio Meeting Scheduled!`,
              message: emailMessage,
              to_email: settings?.email || 'princegajera944@gmail.com'
            },
            {
              publicKey: PUBLIC_KEY
            }
          );
        } catch (emailErr) {
          console.warn('EmailJS delivery failed:', emailErr);
        }
      }

      onSuccess({ ...form, date: selectedDate, slot: selectedSlot, dateKey });
    } else if (result.error === 'SLOT_TAKEN') {
      setSlotTaken(true);
    } else {
      setSubmitError('Booking failed: ' + result.error);
    }
  };

  const change = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: '' }));
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(5, 5, 10, 0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 100,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}
        className="sm:items-center p-4"
      >
        {/* Modal panel */}
        <motion.div
          initial={{ y: 50, scale: 0.96, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 30, scale: 0.98, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'radial-gradient(circle at top left, #121220, #09090e)',
            border: '1px solid rgba(124, 58, 237, 0.22)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 50px rgba(124, 58, 237, 0.08)',
            borderRadius: 20,
            width: '100%',
            maxWidth: 500,
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 32,
            position: 'relative',
          }}
          className="shadow-2xl"
        >
          {/* Top accent gradient bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, #7c3aed, #c084fc, #06b6d4)', borderRadius: '20px 20px 0 0' }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '50%', width: 34, height: 34, color: '#94a3b8',
              cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.color = '#f87171';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            ✕
          </button>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 20,
              margin: 0,
              letterSpacing: '-0.025em',
            }}>
              Confirm Your Booking
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <span style={{
                background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)',
                borderRadius: 6, padding: '4px 10px', color: '#c084fc', fontSize: 12, fontWeight: 600, fontFamily: 'monospace'
              }}>
                📅 {formatDateDisplay(selectedDate)}
              </span>
              <span style={{
                background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: 6, padding: '4px 10px', color: '#22d3ee', fontSize: 12, fontWeight: 600, fontFamily: 'monospace'
              }}>
                🕐 {formatSlotDisplay(selectedSlot)}
              </span>
            </div>
          </div>

          {/* Slot taken warning */}
          {slotTaken && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 10, padding: '12px 16px', marginBottom: 20,
                color: '#fca5a5', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center',
              }}
            >
              ⚠️ This slot was just booked. Please choose another time.
            </motion.div>
          )}

          {/* Server error */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 10, padding: '12px 16px', marginBottom: 20,
                color: '#fca5a5', fontSize: 13,
              }}
            >
              {submitError}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field label="Full Name" error={errors.name}>
              <input
                value={form.name}
                onChange={change('name')}
                placeholder="John Doe"
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? '#ef4444' : 'rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '12px 16px',
                  borderRadius: 10,
                  transition: 'all 0.25s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c3aed';
                  e.target.style.background = 'rgba(124, 58, 237, 0.03)';
                  e.target.style.boxShadow = '0 0 12px rgba(124, 58, 237, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.name ? '#ef4444' : 'rgba(255,255,255,0.08)';
                  e.target.style.background = 'rgba(255,255,255,0.03)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Field>

            <Field label="Email Address" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={change('email')}
                placeholder="you@example.com"
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? '#ef4444' : 'rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '12px 16px',
                  borderRadius: 10,
                  transition: 'all 0.25s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c3aed';
                  e.target.style.background = 'rgba(124, 58, 237, 0.03)';
                  e.target.style.boxShadow = '0 0 12px rgba(124, 58, 237, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#ef4444' : 'rgba(255,255,255,0.08)';
                  e.target.style.background = 'rgba(255,255,255,0.03)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Field>

            <Field label="Phone Number" error={errors.phone}>
              <input
                value={form.phone}
                onChange={change('phone')}
                placeholder="+91 98765 43210"
                style={{
                  ...inputStyle,
                  borderColor: errors.phone ? '#ef4444' : 'rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '12px 16px',
                  borderRadius: 10,
                  transition: 'all 0.25s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c3aed';
                  e.target.style.background = 'rgba(124, 58, 237, 0.03)';
                  e.target.style.boxShadow = '0 0 12px rgba(124, 58, 237, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.phone ? '#ef4444' : 'rgba(255,255,255,0.08)';
                  e.target.style.background = 'rgba(255,255,255,0.03)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Field>

            <div style={{ position: 'relative' }}>
              <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Meeting Purpose
              </label>

              {/* Custom dropdown trigger */}
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                style={{
                  ...inputStyle,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderColor: dropdownOpen ? '#7c3aed' : 'rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '12px 16px',
                  borderRadius: 10,
                  width: '100%',
                  textAlign: 'left',
                  transition: 'all 0.25s ease',
                }}
              >
                <span style={{ color: '#f8fafc' }}>{form.purpose}</span>
                <motion.svg
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="#94a3b8" strokeWidth="2.5"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </button>

              {/* Dropdown options list */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0, right: 0,
                      background: '#0c0c14',
                      border: '1px solid rgba(124,58,237,0.35)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      zIndex: 200,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                      transformOrigin: 'top',
                    }}
                  >
                    {PURPOSES.map((p, i) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, purpose: p }));
                          setDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          textAlign: 'left',
                          background: form.purpose === p ? 'rgba(124,58,237,0.2)' : 'transparent',
                          color: form.purpose === p ? '#c084fc' : '#cbd5e1',
                          fontSize: 13,
                          fontFamily: 'Inter, sans-serif',
                          border: 'none',
                          borderBottom: i < PURPOSES.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          transition: 'background .15s',
                        }}
                        onMouseEnter={(e) => {
                          if (form.purpose !== p) {
                            e.currentTarget.style.background = 'rgba(124,58,237,0.08)';
                            e.currentTarget.style.color = '#ffffff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (form.purpose !== p) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#cbd5e1';
                          }
                        }}
                      >
                        {form.purpose === p && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {form.purpose !== p && <span style={{ width: 12, display: 'inline-block' }} />}
                        {p}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={!submitting ? { scale: 1.01, boxShadow: '0 0 20px rgba(124,58,237,0.4)' } : {}}
              whileTap={!submitting ? { scale: 0.99 } : {}}
              style={{
                background: submitting ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '14px 24px',
                fontSize: 14,
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 6,
              }}
            >
              {submitting ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  Booking...
                </>
              ) : (
                <>✓ Confirm Booking</>
              )}
            </motion.button>
          </form>

          <p style={{ color: '#4b5563', fontSize: 11, textAlign: 'center', marginTop: 16 }}>
            🔒 Your info is private & secure. Invite sent to your email instantly.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
