/**
 * Calculates the estimated reading duration for a given block of text.
 * @param {string} text - The text contents to evaluate
 * @returns {string} Estimated duration label (e.g. 5 min read)
 */
export default function readTime(text) {
  if (!text) return '1 min read';
  const wpm = 225; // average adult reading speed
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return `${time} min read`;
}
