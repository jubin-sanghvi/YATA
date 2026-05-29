import * as chrono from 'chrono-node';

export function parseInput(input) {
  const text = input.trim();
  if (!text) return null;

  const results = chrono.parse(text, new Date(), { forwardDate: true });
  if (results.length === 0) {
    return { text, dueAt: null };
  }

  const result = results[0];
  const dueAt = result.start.date().toISOString();

  const cleaned = (
    text.slice(0, result.index) +
    text.slice(result.index + result.text.length)
  )
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/^[\s,;:.\-]+|[\s,;:.\-]+$/g, '')
    .trim();

  return { text: cleaned || text, dueAt };
}
