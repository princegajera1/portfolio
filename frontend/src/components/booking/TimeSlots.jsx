import { motion } from 'framer-motion';
import { formatSlotDisplay } from '../../utils/slotGenerator';

export default function TimeSlots({ slots, bookedSlots, selectedSlot, onSelectSlot, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '3px solid rgba(124,58,237,0.2)',
              borderTopColor: '#7c3aed',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span style={{ color: '#64748b', fontSize: 12, fontFamily: 'monospace' }}>Loading slots...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <span style={{ fontSize: 32 }}>🚫</span>
        <span style={{ color: '#64748b', fontSize: 13 }}>No slots available for this day</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {slots.map((slot, i) => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selectedSlot === slot;

        let style = {
          borderRadius: 8,
          padding: '10px 8px',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'monospace',
          border: '1px solid',
          cursor: isBooked ? 'not-allowed' : 'pointer',
          transition: 'all .18s',
          outline: 'none',
          textAlign: 'center',
          width: '100%',
        };

        if (isBooked) {
          style = { ...style,
            background: '#1e1e2e',
            borderColor: 'rgba(255,255,255,0.04)',
            color: '#4a4a6a',
            textDecoration: 'line-through',
          };
        } else if (isSelected) {
          style = { ...style,
            background: '#7c3aed',
            borderColor: '#7c3aed',
            color: '#ffffff',
            boxShadow: '0 0 16px rgba(124,58,237,0.4)',
          };
        } else {
          style = { ...style,
            background: 'transparent',
            borderColor: 'rgba(124,58,237,0.35)',
            color: '#a78bfa',
          };
        }

        return (
          <motion.button
            key={slot}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.025, duration: 0.25, ease: 'easeOut' }}
            onClick={() => !isBooked && onSelectSlot(slot)}
            style={style}
            onMouseEnter={(e) => {
              if (!isBooked && !isSelected) {
                e.currentTarget.style.background = 'rgba(124,58,237,0.15)';
                e.currentTarget.style.borderColor = '#7c3aed';
                e.currentTarget.style.color = '#c4b5fd';
              }
            }}
            onMouseLeave={(e) => {
              if (!isBooked && !isSelected) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)';
                e.currentTarget.style.color = '#a78bfa';
              }
            }}
          >
            {formatSlotDisplay(slot)}
            {isBooked && (
              <div style={{ fontSize: 9, color: '#4a4a6a', textDecoration: 'none', marginTop: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Booked
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
