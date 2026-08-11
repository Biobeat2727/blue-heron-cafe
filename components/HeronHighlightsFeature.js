// components/HeronHighlightsFeature.js - Photo-led editorial feature for the
// newest Heron Highlight. The default export is the homepage section; the
// named HighlightFeatureCard is reused as the hero on /highlights.
import Link from "next/link";
import { formatHighlightDate } from "@/components/HighlightCard";

export function HighlightFeatureCard({ highlight, label = "Featured Story", headingLevel = "h3" }) {
  const { slug, title, category, publishedAt, excerpt, imageUrl, imageAlt } =
    highlight;
  const href = `/highlights/${slug}`;
  const Heading = headingLevel;

  return (
    <article className="grid overflow-hidden shadow-2xl rounded-3xl lg:grid-cols-2">
      {/* Photo stacks above the content on mobile */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="block bg-sky-100"
      >
        <div className="relative h-full">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="object-cover w-full h-full aspect-[4/3] lg:aspect-auto lg:absolute lg:inset-0"
          />
        </div>
      </Link>

      <div className="flex flex-col justify-center p-8 text-white md:p-12 bg-gradient-to-br from-sky-900 via-blue-900 to-cyan-900">
        <p className="flex items-center gap-3 mb-4 text-sm font-bold tracking-widest uppercase text-amber-300">
          <span className="w-8 h-0.5 bg-amber-400" aria-hidden="true"></span>
          {label}
        </p>

        <p className="mb-3 text-sm font-medium text-sky-200">
          {category && <span>{category}</span>}
          {category && publishedAt && <span aria-hidden="true"> · </span>}
          {publishedAt && <span>{formatHighlightDate(publishedAt)}</span>}
        </p>

        <Heading className="mb-4 font-serif text-3xl font-bold leading-tight md:text-4xl">
          <Link
            href={href}
            className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            {title}
          </Link>
        </Heading>

        {excerpt && (
          <p className="mb-8 text-lg leading-relaxed text-sky-100">{excerpt}</p>
        )}

        <Link
          href={href}
          className="inline-flex items-center self-start gap-2 px-5 py-2.5 font-semibold transition-colors border-2 rounded-lg border-amber-400/70 text-amber-300 hover:bg-amber-400 hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <span>See the full story</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

export default function HeronHighlightsFeature({ highlight }) {
  // No stories yet: leave the homepage untouched rather than showing a placeholder.
  if (!highlight || !highlight.slug) return null;

  return (
    <section
      aria-labelledby="heron-highlights-heading"
      className="py-24 bg-gradient-to-b from-white via-sky-50 to-white"
    >
      <div className="max-w-6xl px-6 mx-auto">
        <div className="mb-12 text-center">
          <h2
            id="heron-highlights-heading"
            className="mb-4 font-serif text-5xl font-bold md:text-6xl text-cyan-700"
          >
            Heron Highlights
          </h2>
          <p className="max-w-2xl mx-auto text-xl leading-relaxed text-gray-600">
            Stories from the café and the community around it.
          </p>
        </div>

        <HighlightFeatureCard highlight={highlight} />

        <div className="mt-8 text-center">
          <Link
            href="/highlights"
            className="inline-flex items-center gap-1 font-medium transition-colors rounded-sm text-cyan-600 hover:text-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
          >
            <span>See all highlights</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
