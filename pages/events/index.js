// pages/events/index.js
import Head from "next/head";
import Link from "next/link";
import { client } from "@/lib/sanity";

export default function EventsPage({ events }) {
  return (
    <>
      <Head>
        <title>Events | Blue Heron Café</title>
        <meta
          name="description"
          content="See all upcoming events at Blue Heron Café in Samuels, Idaho — music nights, community gatherings, and more."
        />
      </Head>

      <main className="pt-32 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link key={event._id} href={`/events/${event.slug.current}`}>
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="h-48 w-full object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <p className="text-sm text-gray-600">
                    {event.date} • {event.time}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const query = `*[_type == "event"] | order(date asc) {
    _id,
    title,
    date,
    time,
    "slug": slug,
    "imageUrl": image.asset->url
  }`;

  const events = await client.fetch(query);

  return {
    props: { events },
    revalidate: 60,
  };
}
