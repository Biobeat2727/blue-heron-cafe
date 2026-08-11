// components/HighlightCard.js - Reusable card for the Highlights archive grid
// and the related-stories section on individual highlight pages.
import Link from "next/link";

// publishedAt is a full datetime; format in UTC so the server-rendered
// HTML and the client hydration always agree on the date.
export function formatHighlightDate(isoDate) {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function HighlightCard({ highlight }) {
  const { slug, title, category, publishedAt, excerpt, imageUrl, imageAlt } =
    highlight;

  return (
    <Link
      href={`/highlights/${slug}`}
      className="flex flex-col overflow-hidden transition-all duration-500 transform bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl hover:border-sky-200 hover:-translate-y-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
    >
      <div className="relative aspect-[5/3] w-full overflow-hidden bg-sky-50">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={imageAlt || title}
            loading="lazy"
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}
        {category && (
          <span className="absolute px-3 py-1 text-sm font-medium text-white rounded-full top-4 right-4 bg-cyan-600">
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-3 h-3 rounded-full bg-sky-500" aria-hidden="true"></span>
          <span className="text-sm font-medium tracking-wide uppercase text-cyan-600">
            {formatHighlightDate(publishedAt)}
          </span>
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-cyan-600 line-clamp-2">
          {title}
        </h3>

        {excerpt && (
          <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
            {excerpt}
          </p>
        )}

        <span className="flex items-center gap-1 mt-auto font-medium transition-colors text-cyan-600 group-hover:text-cyan-700">
          <span>Read the story</span>
          <svg
            className="w-4 h-4 transition-transform transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
