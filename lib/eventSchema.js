// Only infer values that the existing published fields state unambiguously.
export const cafeAddress = {
  '@type': 'PostalAddress',
  streetAddress: '486260 US-95',
  addressLocality: 'Sandpoint',
  addressRegion: 'ID',
  postalCode: '83864',
  addressCountry: 'US',
};

function clockMinutes(text) {
  const match = text.trim().match(/^(\d{1,2})(?::([0-5]\d))?\s*(am|pm)$/i);
  if (match) {
    const hour = Number(match[1]);
    if (hour < 1 || hour > 12) return null;
    return (hour % 12 + (match[3].toLowerCase() === 'pm' ? 12 : 0)) * 60 + Number(match[2] || 0);
  }
  const military = text.trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  return military ? Number(military[1]) * 60 + Number(military[2]) : null;
}

function localDateTime(date, minutes) {
  const day = new Date(`${date}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() + Math.floor(minutes / 1440));
  const hh = String(Math.floor((minutes % 1440) / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');
  // No guessed UTC offset: Google interprets this local time at the venue.
  return `${day.toISOString().slice(0, 10)}T${hh}:${mm}:00`;
}

export function eventDates(date, time = '') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') ||
      !Number.isFinite(Date.parse(`${date}T12:00:00Z`)) ||
      new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) !== date) return null;
  const parts = (time || '').split(/\s*(?:[-–—]|\bto\b)\s*/i);
  if (parts.length > 2) return { startDate: date };
  const start = clockMinutes(parts[0]);
  if (start === null) return { startDate: date };
  const result = { startDate: localDateTime(date, start) };
  const end = parts.length === 2 ? clockMinutes(parts[1]) : null;
  if (end !== null && end !== start) result.endDate = localDateTime(date, end < start ? end + 1440 : end);
  return result;
}

function webUrl(value) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined; }
  catch { return undefined; }
}

export function generateEventSchema(event) {
  const dates = eventDates(event.date, event.time);
  // Existing private bookings are calendar information, not public event listings.
  if (!dates || !event.title || event.isPrivate || /\bprivate\b/i.test(event.title)) return null;
  const slug = typeof event.slug === 'string' ? event.slug : event.slug?.current;
  if (!slug) return null;
  const url = `https://www.blueheronsamuels.com/events/${encodeURIComponent(slug)}`;
  const description = [event.synopsis || event.description, event.admission].filter(Boolean).join('\n\n');
  const image = webUrl(event.imageUrl);
  const ticketUrl = webUrl(event.ticketUrl);
  const admission = (event.admission || '').trim();
  const free = /^(free(?:\s+(?:entry|admission))?|no\s+(?:cover|admission(?:\s+charge)?))[.!]?$/i.test(admission);
  const priceMatch = admission.match(/^\$(\d+(?:\.\d{1,2})?)(?:\s+(?:entry|admission))?$/i);
  const price = free ? 0 : priceMatch ? Number(priceMatch[1]) : undefined;
  return {
    '@context': 'https://schema.org', '@type': 'Event', '@id': `${url}#event`,
    name: event.title, url, ...dates,
    ...(description ? { description } : {}),
    ...(image ? { image: [image] } : {}),
    location: { '@type': 'Place', name: 'Blue Heron Café', address: cafeAddress },
    organizer: { '@type': 'Organization', name: 'Blue Heron Café', url: 'https://www.blueheronsamuels.com/' },
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(free ? { isAccessibleForFree: true } : {}),
    ...(ticketUrl || price !== undefined ? { offers: {
      '@type': 'Offer', url: ticketUrl || url,
      ...(price !== undefined ? { price, priceCurrency: 'USD' } : {}),
      ...(admission ? { description: admission } : {}),
    } } : {}),
  };
}
