// Batch-uploads new gallery photos to Sanity as galleryImage documents.
//
//   node scripts/bulk-upload-gallery.mjs
//
// Two batches, both sourced from the Downloads folder:
//   - DSC*.JPG      -> category "customer-appreciation-2026"
//   - 10000*.jpg    -> category "gallery-2026"
//
// Idempotent: document _ids are derived from filenames (createIfNotExists),
// so re-running after a partial failure won't create duplicates.

import { createClient } from '@sanity/client'
import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const DOWNLOADS = 'C:/Users/davey/Downloads'

const client = createClient({
  projectId: 'k63h5ik3',
  dataset: 'production',
  apiVersion: '2023-10-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const files = readdirSync(DOWNLOADS)

const isDupe = (name) => / \(\d+\)\./.test(name) // "1000031512 (1).jpg" etc.

const batches = [
  {
    label: 'Customer Appreciation Party 2026',
    category: 'customer-appreciation-2026',
    alt: 'Customer Appreciation Party 2026 at Blue Heron Café in Samuels, Idaho',
    files: files.filter((f) => /^DSC\d+\.jpe?g$/i.test(f) && !isDupe(f)).sort(),
  },
  {
    label: 'Blue Heron Café 2026',
    category: 'gallery-2026',
    alt: 'Blue Heron Café in Samuels, Idaho — 2026',
    files: files.filter((f) => /^10000\d+\.jpe?g$/i.test(f) && !isDupe(f)).sort(),
  },
]

function docIdFor(filename) {
  const base = filename.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `galleryImage-${base}`
}

async function run() {
  if (!process.env.SANITY_TOKEN) {
    throw new Error('SANITY_TOKEN missing from .env')
  }

  let uploaded = 0
  let skipped = 0

  for (const batch of batches) {
    console.log(`\n=== ${batch.label}: ${batch.files.length} photos ===`)

    for (const [i, filename] of batch.files.entries()) {
      const docId = docIdFor(filename)

      const existing = await client.fetch('*[_id == $id][0]{_id}', { id: docId })
      if (existing) {
        console.log(`[${i + 1}/${batch.files.length}] ${filename} — already uploaded, skipping`)
        skipped++
        continue
      }

      const filePath = path.join(DOWNLOADS, filename)
      const asset = await client.assets.upload('image', readFileSync(filePath), { filename })

      await client.createIfNotExists({
        _id: docId,
        _type: 'galleryImage',
        title: `${batch.label}, ${filename.replace(/\.[^.]+$/, '')}`,
        alt: batch.alt,
        category: batch.category,
        featured: false,
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
        },
      })

      uploaded++
      console.log(`[${i + 1}/${batch.files.length}] ${filename} — uploaded (${asset._id})`)
    }
  }

  console.log(`\nDone. Uploaded ${uploaded}, skipped ${skipped} already-existing.`)
}

run().catch((err) => {
  console.error('FAILED:', err.message)
  process.exit(1)
})
