import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isPast, isSameDay, isSameMonth } from 'date-fns';

export { format, isToday, isPast, isSameDay, isSameMonth };

/** Returns all calendar days to display for a given month (fills Mon–Sun grid) */
export function getCalendarDays(date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Mon
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: calStart, end: calEnd });
}

/** Format date to YYYY-MM-DD string (Firestore key) */
export function toDateKey(date) {
  return format(date, 'yyyy-MM-dd');
}

/** Format date for display */
export function formatDateDisplay(date) {
  return format(date, 'EEEE, MMMM d, yyyy');
}

/** Format month heading */
export function formatMonthYear(date) {
  return format(date, 'MMMM yyyy');
}

/** Is date disabled: past, sunday, or today after 7PM */
export function isDateDisabled(date) {
  const now = new Date();
  const dayOfWeek = date.getDay();

  // Sunday always disabled
  if (dayOfWeek === 0) return true;

  // Strictly past dates (before today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d < today) return true;

  // Today but after 7:00 PM → no more slots today
  if (isToday(date) && now.getHours() >= 19) return true;

  return false;
}
