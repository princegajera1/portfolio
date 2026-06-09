import { format, addMinutes, setHours, setMinutes, setSeconds } from 'date-fns';

/**
 * Generate 30-min slots for a given date.
 * Mon–Fri: 10:00 AM – 7:00 PM  (last slot start: 18:30)
 * Saturday: 10:00 AM – 4:00 PM (last slot start: 15:30)
 * Sunday: no slots
 */
export function generateSlots(date) {
  if (!date) return [];
  const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
  if (dayOfWeek === 0) return []; // Sunday disabled

  const isSaturday = dayOfWeek === 6;
  const endHour = isSaturday ? 16 : 19; // exclusive end hour
  const lastSlotHour = isSaturday ? 15 : 18;
  const lastSlotMin = 30;

  const slots = [];
  let current = setSeconds(setMinutes(setHours(new Date(date), 10), 0), 0);
  const end = setSeconds(setMinutes(setHours(new Date(date), lastSlotHour), lastSlotMin), 0);

  while (current <= end) {
    slots.push(format(current, 'HH:mm'));
    current = addMinutes(current, 30);
  }
  return slots;
}

/** Format "HH:mm" → "10:30 AM" display */
export function formatSlotDisplay(slot) {
  const [h, m] = slot.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}
