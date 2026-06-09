import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDateDisplay } from '../../utils/dateHelpers';
import { formatSlotDisplay } from '../../utils/slotGenerator';

const CHECK_VARIANTS = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function SuccessScreen({ booking, onReset }) {
  // Auto-redirect to reset after 8 seconds
  useEffect(() => {
    const t = setTimeout(onReset, 8000);
    return () => clearTimeout(t);
  }, [onReset]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 480,
        padding: 32,
        textAlign: 'center',
      }}
    >
      {/* Animated checkmark */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          style={{
            width: 88, height: 88, borderRadius: '50%',
            background: 'linear-gradient(135deg,#7c3aed,#10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(124,58,237,0.4)',
          }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <motion.path
              d="M10 22L18 30L34 14"
              stroke="#fff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={CHECK_VARIANTS}
              initial="hidden"
              animate="visible"
            />
          </svg>
        </motion.div>

        {/* Ripple rings */}
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 2.2 + i * 0.4, opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.2 * i, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '2px solid #7c3aed',
            }}
          />
        ))}
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ color: '#f8fafc', fontSize: 24, fontWeight: 800, margin: 0 }}
      >
        You're Scheduled! 🎉
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ color: '#64748b', fontSize: 14, marginTop: 8, maxWidth: 380 }}
      >
        A calendar invitation has been sent to your email address.
      </motion.p>

      {/* Booking summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          background: '#12121a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: '20px 24px',
          marginTop: 24,
          width: '100%',
          maxWidth: 400,
          textAlign: 'left',
        }}
      >
        <div style={{ color: '#64748b', fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
          Booking Summary
        </div>
        {[
          { label: 'Name', value: booking.name },
          { label: 'Email', value: booking.email },
          { label: 'Date', value: formatDateDisplay(booking.date) },
          { label: 'Time', value: formatSlotDisplay(booking.slot) },
          { label: 'Duration', value: '30 Minutes' },
          { label: 'Purpose', value: booking.purpose },
          { label: 'Platform', value: 'Google Meet / Zoom' },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: '#64748b', fontSize: 12 }}>{label}</span>
            <span style={{ color: '#f8fafc', fontSize: 12, fontWeight: 600, textAlign: 'right', maxWidth: 220 }}>{value}</span>
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={onReset}
        style={{
          marginTop: 24,
          background: 'rgba(124,58,237,0.15)',
          border: '1px solid rgba(124,58,237,0.4)',
          borderRadius: 10,
          padding: '10px 28px',
          color: '#a78bfa',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all .2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.3)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.15)'; }}
      >
        Book Another Slot →
      </motion.button>

      <p style={{ color: '#334155', fontSize: 11, marginTop: 12, fontFamily: 'monospace' }}>
        Auto-reset in 8 seconds...
      </p>
    </motion.div>
  );
}
