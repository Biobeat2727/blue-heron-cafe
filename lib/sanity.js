// lib/sanity.js - Updated with better error handling and debugging

import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "k63h5ik3",
  dataset: "production",
  apiVersion: "2023-10-01",
  useCdn: false, // Changed to false for debugging
  token: process.env.SANITY_TOKEN, // Add if you have a token
});

// Helper function to handle Sanity queries with error handling
async function fetchSanityData(query, params = {}) {
  try {
    console.log('Executing Sanity query:', query);
    const result = await client.fetch(query, params);
    console.log('Sanity query result:', result);
    return result;
  } catch (error) {
    console.error('Sanity query error:', error);
    console.error('Query that failed:', query);
    console.error('Query params:', params);
    
    // Return empty array as fallback
    return [];
  }
}

export async function getFeaturedMenuItems() {
  const query = `*[_type == "menuItem" && featured == true]{
    _id,
    title,
    price,
    description,
    category,
    "imageUrl": image.asset->url
  }`;
  
  return await fetchSanityData(query);
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
  
  return await fetchSanityData(query, { today });
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
  
  return await fetchSanityData(query, { today });
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
  
  return await fetchSanityData(query, { today });
}

export async function getGalleryImages() {
  const query = `*[_type == "galleryImage"] | order(_createdAt desc)[0...12] {
    _id,
    "imageUrl": image.asset->url,
    caption,
    category
  }`;
  
  return await fetchSanityData(query);
}

export async function getAllGalleryImages() {
  const query = `*[_type == "galleryImage"] | order(_createdAt desc) {
    _id,
    "imageUrl": image.asset->url,
    caption,
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