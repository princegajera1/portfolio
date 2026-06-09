/**
 * Combines multiple CSS class expressions into a single space-separated string.
 * @param  {...any} classes - Array of class names or conditional statements
 * @returns {string} Space-separated class list
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
