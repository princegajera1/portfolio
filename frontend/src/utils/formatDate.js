/**
 * Formats an ISO date string into a user-friendly written format.
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g. June 9, 2026)
 */
export default function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
}
