import { useState, useEffect, useRef } from 'react';
import { subscribeToDateBookings } from '../firebase/bookingService';

/**
 * Real-time hook that returns booked time strings for a given dateKey.
 * Automatically re-subscribes when dateKey changes.
 */
export function useBookings(dateKey) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const unsubRef = useRef(null);

  useEffect(() => {
    if (!dateKey) {
      setBookedSlots([]);
      return;
    }

    setLoading(true);

    // Unsubscribe from previous listener
    if (unsubRef.current) {
      unsubRef.current();
    }

    unsubRef.current = subscribeToDateBookings(dateKey, (slots) => {
      setBookedSlots(slots);
      setLoading(false);
    });

    return () => {
      if (unsubRef.current) {
        unsubRef.current();
      }
    };
  }, [dateKey]);

  return { bookedSlots, loading };
}
