import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const client = createClient({
  projectId: 'k63h5ik3',
  dataset: 'production',
  apiVersion: '2023-10-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

async function bulkUpdateEventImages() {
  // 1. Upload the new image once
  const imagePath = path.resolve(__dirname, '../public/images/hero/summer_sunset.png') // <-- change this
  const imageAsset = await client.assets.upload('image', createReadStream(imagePath), {
    filename: 'your-new-image.jpg',
  })
  console.log('Uploaded image asset:', imageAsset._id)

  // 2. Fetch all event document IDs
  const events = await client.fetch(`*[_type == "event"]{ _id, title }`)
  console.log(`Found ${events.length} events`)

  // 3. Patch each event with the new image reference
  const transaction = client.transaction()
  for (const event of events) {
    transaction.patch(event._id, {
      set: {
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
        },
      },
    })
    console.log(`Queued patch for: ${event.title}`)
  }

  // 4. Commit all patches in one transaction
  const result = await transaction.commit()
  console.log('Done! Updated events:', result)
}

bulkUpdateEventImages().catch(console.error)
