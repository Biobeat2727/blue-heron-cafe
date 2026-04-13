// pages/api/revalidate.js
// On-demand revalidation endpoint - call this from a Sanity webhook
// to immediately refresh the events page when you publish content

export default async function handler(req, res) {
  // Optional: protect with a secret token
  // if (req.query.secret !== process.env.REVALIDATE_SECRET) {
  //   return res.status(401).json({ message: 'Invalid token' });
  // }

  try {
    await res.revalidate('/events');
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
