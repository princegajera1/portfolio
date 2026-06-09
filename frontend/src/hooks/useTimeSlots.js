import { useMemo } from 'react';
import { generateSlots } from '../utils/slotGenerator';

/**
 * Returns time slots for the selected date.
 * Filters out past slots for today.
 */
export function useTimeSlots(selectedDate) {
  return useMemo(() => {
    if (!selectedDate) return [];
    const allSlots = generateSlots(selectedDate);

    const now = new Date();
    const isToday =
      selectedDate.toDateString() === now.toDateString();

    if (!isToday) return allSlots;

    // Filter past slots for today
    const currentHHmm = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return allSlots.filter((slot) => slot > currentHHmm);
  }, [selectedDate]);
}
