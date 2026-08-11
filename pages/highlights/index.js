// pages/highlights/index.js - Heron Highlights landing page and archive
import SEO from "@/components/SEO";
import { generateBreadcrumbSchema } from "@/lib/structuredData";
import Link from "next/link";
import { Newspaper, Phone } from "lucide-react";
import { getAllHighlights } from "@/lib/sanity";
import { HighlightFeatureCard } from "@/components/HeronHighlightsFeature";
import HighlightCard from "@/components/HighlightCard";

export default function HighlightsPage({ highlights }) {
  // The newest featured story leads the page; otherwise the newest story does.
  const featured = highlights.find((h) => h.featured) || highlights[0] || null;
  const rest = featured
    ? highlights.filter((h) => h._id !== featured._id)
    : [];

  return (
    <>
      <SEO
        title="Heron Highlights | Stories from Blue Heron Café in Samuels, Idaho"
        description="Heron Highlights are stories from Blue Heron Café: community benefits, live music nights, kitchen news, and photo stories from Samuels, Idaho near Sandpoint."
        keywords="Blue Heron Café news, Samuels Idaho community stories, Sandpoint café events recap, live music stories North Idaho"
        url="/highlights"
        jsonLd={generateBreadcrumbSchema([
          { name: "Home", url: "https://blueheronsamuels.com" },
          { name: "Highlights", url: "https://blueheronsamuels.com/highlights" },
        ])}
      />

      <main className="min-h-screen pb-32 bg-gradient-to-br from-sky-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-cyan-600/10 to-blue-600/10"></div>

          <section className="relative max-w-5xl px-6 mx-auto mt-10 mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-sky-100 text-cyan-800">
              <span className="w-2 h-2 rounded-full bg-sky-500" aria-hidden="true"></span>
              Stories from the café
            </div>

            <h1 className="mb-6 font-serif text-5xl font-bold md:text-6xl text-sky-800">
              Heron Highlights
            </h1>

            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-700">
              The moments worth remembering: community benefits, live music
              nights, news from the kitchen, and photo stories from Samuels,
              Idaho.
            </p>
          </section>
        </div>

        {featured ? (
          <>
            {/* Featured Story */}
            <div className="max-w-6xl px-6 mx-auto">
              <HighlightFeatureCard
                highlight={featured}
                label={featured.featured ? "Featured Story" : "Latest Story"}
                headingLevel="h2"
              />
            </div>

            {/* Archive Grid - hidden when the featured story is the only one */}
            {rest.length > 0 && (
              <div className="max-w-6xl px-6 mx-auto mt-20">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-4xl font-bold text-gray-900">
                    More Highlights
                  </h2>
                  <div className="flex-1 h-px ml-8 bg-gradient-to-r from-sky-300 to-blue-300"></div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {rest.map((highlight) => (
                    <HighlightCard key={highlight._id} highlight={highlight} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="max-w-4xl px-6 mx-auto text-center">
            <div className="p-12 bg-white border shadow-lg rounded-2xl border-sky-100">
              <Newspaper className="w-16 h-16 mx-auto mb-6 text-sky-500" aria-hidden="true" />
              <h2 className="mb-4 text-3xl font-bold text-gray-800">
                Stories Are on the Way
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                We're putting together our first Heron Highlights. In the
                meantime, come see what's happening on the outdoor stage.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition rounded-lg bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                >
                  See Upcoming Events
                </Link>
                <a
                  href="tel:+12082631146"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold transition border-2 rounded-lg border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" /> Call the Café
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export async function getStaticProps() {
  const highlights = await getAllHighlights();

  return {
    props: { highlights },
    revalidate: 60,
  };
}
