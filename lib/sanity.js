// lib/sanity.js
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "k63h5ik3", // get this from sanity.json or manage.sanity.io
  dataset: "production",
  apiVersion: "2023-10-01", // use a fixed date
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
  const query = `*[_type == "event"] | order(date asc)[0...10] {
    _id,
    title,
    date,
    time,
    description,
    "imageUrl": image.asset->url
  }`;
  return await client.fetch(query);
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
    category
  }`;
  return await client.fetch(query);
}


