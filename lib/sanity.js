// lib/sanity.js - Updated to only fetch future events with correct slug format

import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "k63h5ik3",
  dataset: "production",
  apiVersion: "2023-10-01",
  useCdn: true,
});

export async function getFeaturedMenuItems() {
  const query = `*[_type == "menuItem" && featured == true]{
    _id,
    title,
    price,
    description,
    category,
    "imageUrl": image.asset->url
  }`;
  return await client.fetch(query);
}

export async function getUpcomingEvents() {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  const query = `*[_type == "event" && date >= $today] | order(date asc)[0...10] {
    _id,
    title,
    date,
    time,
    description,
    "slug": slug.current,
    "imageUrl": image.asset->url
  }`;
  
  return await client.fetch(query, { today });
}

export async function getAllEvents() {
  // For events page - get future events only
  const today = new Date().toISOString().split('T')[0];
  
  const query = `*[_type == "event" && date >= $today] | order(date asc) {
    _id,
    title,
    date,
    time,
    description,
    "slug": slug.current,
    "imageUrl": image.asset->url
  }`;
  
  return await client.fetch(query, { today });
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
    "imageUrl": image.asset->url
  }`;
  
  return await client.fetch(query, { today });
}

export async function getGalleryImages() {
  const query = `*[_type == "galleryImage"] | order(_createdAt desc)[0...12] {
    _id,
    "imageUrl": image.asset->url,
    caption
  }`;
  return await client.fetch(query);
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
  return await client.fetch(query);
}