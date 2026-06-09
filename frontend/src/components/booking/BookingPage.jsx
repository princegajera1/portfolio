import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileSidebar from './ProfileSidebar';
import CalendarGrid from './CalendarGrid';
import TimeSlots from './TimeSlots';
import BookingModal from './BookingModal';
import SuccessScreen from './SuccessScreen';
import { useBookings } from '../../hooks/useBookings';
import { useTimeSlots } from '../../hooks/useTimeSlots';
import { toDateKey, formatDateDisplay } from '../../utils/dateHelpers';

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const dateKey = selectedDate ? toDateKey(selectedDate) : null;
  const { bookedSlots, loading: slotsLoading } = useBookings(dateKey);
  const slots = useTimeSlots(selectedDate);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  const handleSuccess = (data) => {
    setModalOpen(false);
    setSuccessData(data);
  };

  const handleReset = () => {
    setSuccessData(null);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Page header */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#0a0a0f',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{
          background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
          borderRadius: 8, width: 28, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 12,
        }}>PG</div>
        <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: 15 }}>Prince Gajera</span>
        <span style={{ color: '#64748b', fontSize: 13 }}>· Book a Meeting</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          <span style={{ color: '#10b981', fontSize: 11, fontFamily: 'monospace' }}>Available</span>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }} className="flex-col lg:flex-row">
        <ProfileSidebar />

        {/* Right content panel */}
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            {successData ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SuccessScreen booking={successData} onReset={handleReset} />
              </motion.div>
            ) : (
              <motion.div
                key="booking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: '28px 24px', maxWidth: 760, margin: '0 auto' }}
              >
                {/* Step indicator */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                  {[
                    { n: 1, label: 'Select Date', done: !!selectedDate },
                    { n: 2, label: 'Pick Time', done: !!selectedSlot },
                    { n: 3, label: 'Confirm', done: false },
                  ].map(({ n, label, done }, i) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: done ? '#7c3aed' : (n === (selectedDate ? (selectedSlot ? 3 : 2) : 1)) ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${done ? '#7c3aed' : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                        color: done ? '#fff' : '#64748b',
                        transition: 'all .3s',
                      }}>
                        {done ? '✓' : n}
                      </div>
                      <span style={{ fontSize: 12, color: done ? '#a78bfa' : '#64748b', fontWeight: done ? 600 : 400 }}>{label}</span>
                      {i < 2 && <span style={{ color: '#334155', fontSize: 16, marginLeft: 2 }}>→</span>}
                    </div>
                  ))}
                </div>

                {/* Calendar card */}
                <div style={{
                  background: '#12121a',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: 24,
                  marginBottom: 20,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right,#7c3aed,#06b6d4)' }} />
                  <h2 style={{ color: '#f8fafc', fontWeight: 700, fontSize: 16, margin: '0 0 16px' }}>
                    📅 Select a Date
                  </h2>
                  <CalendarGrid selectedDate={selectedDate} onSelectDate={handleDateSelect} />
                </div>

                {/* Time slots card */}
                <AnimatePresence mode="wait">
                  {selectedDate && (
                    <motion.div
                      key={dateKey}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{
                        background: '#12121a',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 14,
                        padding: 24,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right,#06b6d4,#7c3aed)' }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                        <h2 style={{ color: '#f8fafc', fontWeight: 700, fontSize: 16, margin: 0 }}>
                          🕐 Available Times
                        </h2>
                        <span style={{
                          background: 'rgba(124,58,237,0.12)',
                          border: '1px solid rgba(124,58,237,0.25)',
                          borderRadius: 20, padding: '3px 12px',
                          color: '#a78bfa', fontSize: 11, fontFamily: 'monospace',
                        }}>
                          {formatDateDisplay(selectedDate)}
                        </span>
                      </div>

                      {/* Legend */}
                      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                        {[
                          { color: 'rgba(124,58,237,0.35)', label: 'Available' },
                          { color: '#7c3aed', label: 'Selected' },
                          { color: 'rgba(255,255,255,0.05)', label: 'Booked' },
                        ].map(({ color, label }) => (
                          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 3, background: color, border: '1px solid rgba(255,255,255,0.1)' }} />
                            <span style={{ color: '#64748b', fontSize: 11 }}>{label}</span>
                          </div>
                        ))}
                      </div>

                      <TimeSlots
                        slots={slots}
                        bookedSlots={bookedSlots}
                        selectedSlot={selectedSlot}
                        onSelectSlot={handleSlotClick}
                        loading={slotsLoading}
                      />

                      {/* Real-time indicator */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                        <span style={{ color: '#475569', fontSize: 10, fontFamily: 'monospace' }}>
                          Real-time — slots update instantly when booked
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Placeholder when no date selected */}
                {!selectedDate && (
                  <div style={{
                    background: '#12121a',
                    border: '1px dashed rgba(255,255,255,0.08)',
                    borderRadius: 14, padding: 32,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ fontSize: 36 }}>👆</span>
                    <span style={{ color: '#64748b', fontSize: 13 }}>Select a date above to see available time slots</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Booking Modal */}
      {modalOpen && selectedDate && selectedSlot && (
        <BookingModal
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          dateKey={dateKey}
          onClose={() => { setModalOpen(false); setSelectedSlot(null); }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
