// pages/highlights/[slug].js - Individual Heron Highlight story page
import { useState } from "react";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import imageUrlBuilder from "@sanity/image-url";
import SEO from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateHighlightArticleSchema,
} from "@/lib/structuredData";
import {
  client,
  getHighlightBySlug,
  getRecentHighlights,
  getAllHighlightSlugs,
} from "@/lib/sanity";
import HighlightCard, { formatHighlightDate } from "@/components/HighlightCard";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

const portableTextComponents = {
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <figure className="my-8">
          <img
            src={urlFor(value).width(1200).fit("max").auto("format").url()}
            alt={value.alt || ""}
            loading="lazy"
            className="w-full shadow-md rounded-2xl"
          />
          {value.caption && (
            <figcaption className="mt-3 text-sm text-center text-gray-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
  },
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-lg leading-relaxed text-gray-700">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 font-serif text-3xl font-bold text-gray-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-serif text-2xl font-bold text-gray-900">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="py-2 pl-6 my-6 text-xl italic text-gray-700 border-l-4 border-amber-400">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 ml-6 space-y-2 text-lg text-gray-700 list-disc">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-6 space-y-2 text-lg text-gray-700 list-decimal">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-medium underline text-cyan-700 decoration-cyan-300 underline-offset-2 hover:text-cyan-600"
        >
          {children}
        </a>
      );
    },
  },
};

export default function HighlightDetail({ highlight, recentHighlights }) {
  const [galleryIndex, setGalleryIndex] = useState(-1);

  // getStaticProps returns notFound before this can happen; guard anyway.
  if (!highlight) return null;

  const {
    title,
    slug,
    publishedAt,
    category,
    excerpt,
    heroImage,
    heroImageUrl,
    body,
    gallery,
    impactStats,
    partnerName,
    partnerUrl,
    originalPostUrl,
    metaDescription,
    openGraphImage,
  } = highlight;

  const pageUrl = `https://blueheronsamuels.com/highlights/${slug}`;
  const description = metaDescription || excerpt;
  const ogSource = openGraphImage?.asset ? openGraphImage : heroImage;
  const ogImageUrl = ogSource?.asset
    ? urlFor(ogSource).width(1200).height(630).fit("crop").url()
    : "/images/og-image.jpg";

  const gallerySlides = (gallery || []).map((photo) => ({
    src: photo.url,
    alt: photo.alt,
    description: photo.caption || undefined,
  }));

  return (
    <>
      <SEO
        title={`${title} | Heron Highlights | Blue Heron Café`}
        description={description}
        image={ogImageUrl}
        url={`/highlights/${slug}`}
        type="article"
        jsonLd={[
          generateHighlightArticleSchema({
            title,
            description,
            imageUrl: ogImageUrl,
            publishedAt,
            url: pageUrl,
          }),
          generateBreadcrumbSchema([
            { name: "Home", url: "https://blueheronsamuels.com" },
            { name: "Highlights", url: "https://blueheronsamuels.com/highlights" },
            { name: title, url: pageUrl },
          ]),
        ]}
      />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
        <article className="max-w-4xl px-6 pt-10 pb-20 mx-auto">
          {/* Back Link */}
          <Link
            href="/highlights"
            className="inline-flex items-center gap-2 mb-8 text-sm font-semibold transition-colors rounded-sm text-cyan-600 hover:text-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Heron Highlights
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {category && (
                <span className="px-3 py-1 text-sm font-medium text-white rounded-full bg-cyan-600">
                  {category}
                </span>
              )}
              <time dateTime={publishedAt} className="text-sm font-medium tracking-wide uppercase text-cyan-600">
                {formatHighlightDate(publishedAt)}
              </time>
            </div>

            <h1 className="mb-4 font-serif text-4xl font-bold text-gray-900 md:text-5xl">
              {title}
            </h1>

            {excerpt && (
              <p className="text-xl leading-relaxed text-gray-700">{excerpt}</p>
            )}
          </header>

          {/* Hero Image */}
          {heroImageUrl && (
            <figure className="mb-10">
              <img
                src={heroImageUrl}
                alt={heroImage?.alt || title}
                className="w-full shadow-xl rounded-2xl"
              />
              {heroImage?.caption && (
                <figcaption className="mt-3 text-sm text-center text-gray-500">
                  {heroImage.caption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Story Body */}
          {body && body.length > 0 && (
            <div className="mb-12">
              <PortableText value={body} components={portableTextComponents} />
            </div>
          )}

          {/* Impact Stats */}
          {impactStats && impactStats.length > 0 && (
            <section aria-label="Impact at a glance" className="mb-12">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {impactStats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-6 text-center border rounded-2xl border-amber-200 bg-amber-50"
                  >
                    <p className="mb-1 text-3xl font-bold text-amber-700">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Photo Gallery */}
          {gallerySlides.length > 0 && (
            <section aria-label="Photo gallery" className="mb-12">
              <h2 className="mb-6 font-serif text-3xl font-bold text-gray-900">
                More Photos
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {gallery.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    aria-label={`View photo full size: ${photo.alt}`}
                    className="block w-full overflow-hidden group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                  >
                    <img
                      src={photo.thumbUrl}
                      alt={photo.alt}
                      loading="lazy"
                      className="aspect-[4/3] w-full bg-gray-100 object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Partner Acknowledgment */}
          {partnerName && (
            <section className="p-6 mb-8 border bg-sky-50 border-sky-100 rounded-2xl">
              <p className="text-lg text-gray-700">
                In partnership with{" "}
                {partnerUrl ? (
                  <a
                    href={partnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline text-cyan-700 decoration-cyan-300 underline-offset-2 hover:text-cyan-600"
                  >
                    {partnerName}
                  </a>
                ) : (
                  <span className="font-semibold text-cyan-800">{partnerName}</span>
                )}
                . Thank you for making this happen.
              </p>
            </section>
          )}

          {/* Original Facebook Post */}
          {originalPostUrl && (
            <a
              href={originalPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium transition-colors rounded-sm text-cyan-600 hover:text-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View the original Facebook post
            </a>
          )}
        </article>

        {/* Related Highlights */}
        {recentHighlights && recentHighlights.length > 0 && (
          <div className="py-16 bg-gradient-to-r from-cyan-50 to-sky-50">
            <div className="max-w-6xl px-6 mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  More Heron Highlights
                </h2>
                <div className="flex-1 h-px ml-8 bg-gradient-to-r from-sky-300 to-blue-300"></div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {recentHighlights.map((item) => (
                  <HighlightCard key={item._id} highlight={item} />
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link
                  href="/highlights"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white transition-all shadow-lg bg-cyan-600 rounded-xl hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                >
                  See All Highlights
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Gallery Lightbox */}
      <Lightbox
        open={galleryIndex >= 0}
        close={() => setGalleryIndex(-1)}
        index={galleryIndex >= 0 ? galleryIndex : 0}
        slides={gallerySlides}
        plugins={[Captions]}
      />
    </>
  );
}

export async function getStaticProps({ params }) {
  const highlight = await getHighlightBySlug(params.slug);

  if (!highlight) {
    return { notFound: true, revalidate: 60 };
  }

  const recentHighlights = await getRecentHighlights(params.slug, 3);

  return {
    props: { highlight, recentHighlights },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const slugs = await getAllHighlightSlugs();

  return {
    // 'blocking' serves new stories server-side on first request (no loading
    // flash) and lets unknown slugs return a real 404 status.
    paths: slugs.map((s) => ({ params: { slug: s.slug } })),
    fallback: "blocking",
  };
}
