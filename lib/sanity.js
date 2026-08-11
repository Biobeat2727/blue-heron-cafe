// lib/sanity.js - Updated with better error handling and debugging

import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "k63h5ik3",
  dataset: "production",
  apiVersion: "2023-10-01",
  useCdn: true,
  token: process.env.SANITY_TOKEN, // Add if you have a token
});

// Appended to every asset->url in GROQ queries so we always fetch a
// resized, compressed derivative instead of the original upload.
// (fit=max preserves aspect ratio and only downscales, never upscales.)
const THUMB = `+"?w=800&fit=max&auto=format&q=75"`;
const CARD = `+"?w=1000&fit=max&auto=format&q=75"`;
const GALLERY = `+"?w=1600&fit=max&auto=format&q=75"`;

// Helper function to handle Sanity queries with error handling
async function fetchSanityData(query, params = {}, fallback = []) {
  try {
    console.log('Executing Sanity query:', query);
    const result = await client.fetch(query, params);
    console.log('Sanity query result:', result);
    return result;
  } catch (error) {
    console.error('Sanity query error:', error);
    console.error('Query that failed:', query);
    console.error('Query params:', params);

    return fallback;
  }
}

export async function getFeaturedMenuItems() {
  const query = `*[_type == "menuItem" && featured == true]{
    _id,
    title,
    price,
    description,
    category,
    "imageUrl": image.asset->url ${THUMB}
  }`;

  return await fetchSanityData(query);
}

export async function getUpcomingEvents() {
  // Get yesterday's date to ensure events today are still shown
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const query = `*[_type == "event" && date >= $yesterday] | order(date asc)[0...10] {
    _id,
    title,
    date,
    time,
    description,
    "slug": slug.current,
    "imageUrl": image.asset->url ${CARD}
  }`;

  return await fetchSanityData(query, { yesterday: yesterdayStr });
}

export async function getAllEvents() {
  // Get yesterday's date to ensure events today are still shown
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const query = `*[_type == "event" && date >= $yesterday] | order(date asc) {
    _id,
    title,
    date,
    time,
    description,
    ticketUrl,
    "slug": slug.current,
    "imageUrl": image.asset->url ${CARD}
  }`;

  return await fetchSanityData(query, { yesterday: yesterdayStr });
}

export async function getPastEvents() {
  // Optional: Get past events for an archive page
  const today = new Date().toISOString().split('T')[0];
  
  const query = `*[_type == "event" && date < $today] | order(date desc)[0...20] {
    _id,
    title,
    date,
    time,
    description,
    "slug": slug.current,
    "imageUrl": image.asset->url ${CARD}
  }`;

  return await fetchSanityData(query, { today });
}

export async function getGalleryImages() {
  const query = `*[_type == "galleryImage"] | order(_createdAt desc)[0...12] {
    _id,
    "imageUrl": image.asset->url ${CARD},
    "aspectRatio": image.asset->metadata.dimensions.aspectRatio,
    title,
    alt,
    category
  }`;

  return await fetchSanityData(query);
}

export async function getAllGalleryImages() {
  const query = `*[_type == "galleryImage"] | order(_createdAt desc) {
    _id,
    "imageUrl": image.asset->url ${GALLERY},
    "thumbUrl": image.asset->url ${THUMB},
    "aspectRatio": image.asset->metadata.dimensions.aspectRatio,
    title,
    alt,
    category
  }`;

  return await fetchSanityData(query);
}

export async function getAllMenuItems() {
  const query = `*[_type == "menuItem"] | order(title asc) {
    _id,
    title,
    description,
    price,
    category,
    subcategory
  }`;
  
  return await fetchSanityData(query);
}

export async function getGalleryCategories() {
  const query = `*[_type == "galleryImage" && defined(category)] {
    category
  }`;
  
  const result = await fetchSanityData(query);
  
  // Extract unique categories and format them
  const uniqueCategories = [...new Set(result.map(item => item.category))];
  
  return uniqueCategories.map(category => ({
    value: category,
    label: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));
}

export async function getSponsors() {
  const query = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
    sponsors[]{ name, url, logo }
  }`;
  const result = await fetchSanityData(query);
  return result?.sponsors || [];
}

// ---- Heron Highlights ----

// Shared card projection so the homepage feature, archive grid, and
// related-stories section all render from the same shape.
const HIGHLIGHT_CARD_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  category,
  excerpt,
  featured,
  "imageUrl": heroImage.asset->url ${CARD},
  "imageAlt": heroImage.alt
`;

// Only published stories: a future publishedAt keeps a story hidden.
const HIGHLIGHT_PUBLISHED = `_type == "highlight" && defined(slug.current) && publishedAt <= now()`;

export async function getFeaturedHighlight() {
  // Newest featured story, falling back to the newest published story.
  const query = `*[${HIGHLIGHT_PUBLISHED}]
    | order(coalesce(featured, false) desc, publishedAt desc)[0]{ ${HIGHLIGHT_CARD_FIELDS} }`;

  const result = await fetchSanityData(query, {}, null);
  return result || null;
}

export async function getAllHighlights() {
  const query = `*[${HIGHLIGHT_PUBLISHED}] | order(publishedAt desc){ ${HIGHLIGHT_CARD_FIELDS} }`;

  return await fetchSanityData(query);
}

export async function getHighlightBySlug(slug) {
  const query = `*[${HIGHLIGHT_PUBLISHED} && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    excerpt,
    heroImage,
    "heroImageUrl": heroImage.asset->url ${GALLERY},
    body,
    "gallery": gallery[]{
      "url": asset->url ${GALLERY},
      "thumbUrl": asset->url ${THUMB},
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      alt,
      caption
    },
    impactStats[]{ value, label },
    partnerName,
    partnerUrl,
    originalPostUrl,
    featured,
    metaDescription,
    openGraphImage
  }`;

  const result = await fetchSanityData(query, { slug }, null);
  return result || null;
}

export async function getRecentHighlights(excludeSlug = '', limit = 3) {
  const query = `*[${HIGHLIGHT_PUBLISHED} && slug.current != $excludeSlug]
    | order(publishedAt desc)[0...${Number(limit)}]{ ${HIGHLIGHT_CARD_FIELDS} }`;

  return await fetchSanityData(query, { excludeSlug });
}

export async function getAllHighlightSlugs() {
  const query = `*[_type == "highlight" && defined(slug.current)]{ "slug": slug.current }`;

  return await fetchSanityData(query);
}

// Test function to check if Sanity is working
export async function testSanityConnection() {
  try {
    const result = await client.fetch('*[_type == "menuItem"][0...1]');
    console.log('Sanity connection test successful:', result);
    return true;
  } catch (error) {
    console.error('Sanity connection test failed:', error);
    return false;
  }
}