import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, FiTrash2, FiSearch, FiInbox, 
  FiUser, FiClock, FiPhone, FiMail, FiCheckCircle
} from 'react-icons/fi';
import { subscribeToAllBookings, deleteBooking } from '../../firebase/bookingService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { formatDateDisplay } from '../../utils/dateHelpers';
import { formatSlotDisplay } from '../../utils/slotGenerator';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Subscribe to bookings
  useEffect(() => {
    const unsubscribe = subscribeToAllBookings((data) => {
      setBookings(data || []);
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Filter based on search query
  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return bookings;
    const query = searchQuery.toLowerCase();
    return bookings.filter(b => 
      b.name?.toLowerCase().includes(query) ||
      b.email?.toLowerCase().includes(query) ||
      b.phone?.toLowerCase().includes(query) ||
      b.purpose?.toLowerCase().includes(query) ||
      b.date?.toLowerCase().includes(query)
    );
  }, [bookings, searchQuery]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setDeletingId(id);
      const res = await deleteBooking(id);
      if (res.success) {
        toast.success("Booking cancelled successfully.");
      } else {
        toast.error("Failed to cancel booking: " + res.error);
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans text-left max-w-6xl mx-auto p-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary-dark tracking-tight">
            📅 Meeting Bookings
          </h1>
          <p className="text-xs text-text-secondary-dark font-mono mt-1 uppercase tracking-widest">
            Manage your scheduled portfolio calls
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info" className="px-3 py-1 font-mono text-[10px] font-bold">
            Total Bookings: {bookings.length}
          </Badge>
        </div>
      </div>

      {/* Control panel */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-[#161624]/60 border border-white/5 rounded-xl p-4">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary-dark w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, phone, purpose or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-dark/40 border border-border-dark focus:border-primary text-text-primary-dark pl-10 pr-4 py-2.5 rounded-lg text-xs font-sans outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-mono text-text-secondary-dark uppercase tracking-widest">Loading bookings...</span>
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card className="border border-border-dark py-16" bodyClassName="flex flex-col items-center gap-3">
          <div className="p-4 bg-white/5 rounded-full text-text-secondary-dark">
            <FiInbox className="w-8 h-8" />
          </div>
          <p className="text-xs font-mono text-text-secondary-dark uppercase tracking-widest">No Bookings Found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredBookings.map((b) => (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="border border-border-dark hover:border-primary/40 transition-colors bg-white/3 h-full flex flex-col justify-between"
                  bodyClassName="p-5 flex flex-col gap-4"
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {b.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-text-primary-dark truncate max-w-[150px]">
                            {b.name}
                          </h4>
                          <span className="text-[9px] font-mono text-text-secondary-dark uppercase block">
                            {formatDateDisplay(b.date)}
                          </span>
                        </div>
                      </div>

                      <Badge variant="success" className="px-2 py-0.5 text-[9px] font-mono font-bold">
                        {formatSlotDisplay(b.time)}
                      </Badge>
                    </div>

                    {/* Content / Details */}
                    <div className="mt-4 space-y-2 border-t border-white/5 pt-3 text-[12px] text-text-secondary-dark">
                      <div className="flex items-center gap-2">
                        <FiMail className="w-3.5 h-3.5 text-primary/70" />
                        <a href={`mailto:${b.email}`} className="hover:text-primary transition-colors truncate">
                          {b.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiPhone className="w-3.5 h-3.5 text-primary/70" />
                        <a href={`tel:${b.phone}`} className="hover:text-primary transition-colors">
                          {b.phone}
                        </a>
                      </div>

                      <div className="bg-white/3 border border-white/5 rounded-lg p-2.5 mt-2.5">
                        <div className="text-[9px] font-mono font-bold text-text-secondary-dark uppercase tracking-wider mb-1">
                          Purpose
                        </div>
                        <div className="text-text-primary-dark font-sans text-xs">
                          {b.purpose}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4">
                    <span className="text-[9px] font-mono text-text-secondary-dark">
                      Booked via web
                    </span>

                    <Button
                      variant="danger"
                      onClick={() => handleCancelBooking(b.id)}
                      isLoading={deletingId === b.id}
                      className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase gap-1.5"
                    >
                      <FiTrash2 className="w-3 h-3" />
                      <span>Cancel</span>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
