// pages/events/[slug].js - Enhanced with Working Poster Lightbox
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default function EventDetail({ event }) {
  const router = useRouter();
  const [showPosterLightbox, setShowPosterLightbox] = useState(false);

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-cyan-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-6">🎵</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">This event may have been removed or the link is incorrect.</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    date,
    time,
    image,
    metaDescription,
    openGraphImage,
  } = event;

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    // Handle time ranges like "6:30pm - 9:30pm" or single times like "18:30"
    if (timeString.includes(' - ') || timeString.includes('-')) {
      // It's already a formatted range, return as-is
      return timeString;
    }
    
    // Handle 24-hour format like "18:30"
    if (timeString.includes(':') && !timeString.includes('am') && !timeString.includes('pm')) {
      const [hours, minutes] = timeString.split(':');
      const hour12 = ((parseInt(hours) + 11) % 12) + 1;
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${ampm}`;
    }
    
    // If it's already formatted with am/pm, return as-is
    return timeString;
  };

  // Check if event is today
  const today = new Date();
  const eventDate = new Date(date);
  const isToday = today.toDateString() === eventDate.toDateString();
  const isPast = eventDate < today;

  return (
    <>
      <Head>
        <title>{title} | Blue Heron Café</title>
        <meta name="description" content={metaDescription || description?.slice(0, 150)} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription || description?.slice(0, 150)} />
        {openGraphImage && (
          <meta property="og:image" content={urlFor(openGraphImage).width(1200).url()} />
        )}
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {image && (
            <div className="relative h-[70vh] w-full">
              <motion.img
                src={urlFor(image).width(1200).url()}
                alt={title}
                className="w-full h-full object-cover filter blur-sm"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
              
              {/* Event Status Badge */}
              <div className="absolute top-6 right-6">
                {isToday ? (
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    TODAY!
                  </div>
                ) : isPast ? (
                  <div className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Past Event
                  </div>
                ) : (
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Upcoming
                  </div>
                )}
              </div>

              {/* Back Button */}
              <div className="absolute top-6 left-6">
                <Link
                  href="/events"
                  className="bg-white/90 backdrop-blur-sm text-gray-700 hover:text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white transition-all shadow-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  All Events
                </Link>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-4xl mx-auto">
                  {/* Enhanced text background */}
                  <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <motion.h1
                      className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl font-serif"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      {title}
                    </motion.h1>
                    
                    <motion.div
                      className="flex flex-wrap items-center gap-4 text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <div className="flex items-center gap-2 bg-white/25 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">{formatDate(date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white/25 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{formatTime(time)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white/25 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold">Outdoor Stage & Patio</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Event Details</h2>
                {description && (
                  <div className="prose prose-lg text-gray-700 leading-relaxed mb-8">
                    {description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
                
                {!description && (
                  <p className="text-gray-600 italic mb-8">
                    More details about this event will be available soon. Contact us for more information!
                  </p>
                )}

                {/* Event Poster Section */}
                {image && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-8"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">Event Poster</h3>
                    <div 
                      className="relative group cursor-pointer"
                      onClick={() => {
                        console.log("Poster clicked!"); // Debug log
                        setShowPosterLightbox(true);
                      }}
                    >
                      <img
                        src={urlFor(image).width(600).url()}
                        alt={`${title} Event Poster`}
                        className="w-full max-w-md mx-auto rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105"
                      />
                      
                      {/* Overlay with zoom icon */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Click to view text */}
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg text-center">
                          Click to view full poster
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Event Info Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-xl font-bold text-cyan-800 mb-6 font-serif">Event Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Date</p>
                        <p className="text-gray-900 font-semibold">{formatDate(date)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Time</p>
                        <p className="text-gray-900 font-semibold">{formatTime(time)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Location</p>
                        <p className="text-gray-900 font-semibold">Blue Heron Café</p>
                        <p className="text-sm text-gray-600">Outdoor Stage & Patio</p>
                        <p className="text-sm text-gray-600">486260 US-95, Sandpoint, ID</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                  <a
                    href="tel:+12082631146"
                    className="w-full bg-cyan-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call for Info
                  </a>
                  
                  <Link
                    href="/contact"
                    className="w-full bg-gray-100 text-gray-700 text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Send Message
                  </Link>
                  
                  <button
                    onClick={() => {
                      const text = `Check out this event at Blue Heron Café: ${title} on ${formatDate(date)} at ${formatTime(time)}`;
                      const url = window.location.href;
                      if (navigator.share) {
                        navigator.share({ title, text, url });
                      } else {
                        navigator.clipboard.writeText(`${text} - ${url}`);
                        alert('Event details copied to clipboard!');
                      }
                    }}
                    className="w-full bg-emerald-100 text-emerald-700 text-center py-3 px-6 rounded-lg font-semibold hover:bg-emerald-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share Event
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Related Events Section */}
        <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold text-cyan-800 mb-6 font-serif">
              More Events at Blue Heron Café
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Don't miss out on our other amazing events featuring live music, community gatherings, and seasonal celebrations.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-700 transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View All Events
            </Link>
          </div>
        </div>
      </main>

      {/* Custom Poster Lightbox Modal */}
      <AnimatePresence>
        {showPosterLightbox && image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPosterLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPosterLightbox(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Poster Image */}
              <img
                src={urlFor(image).width(1200).url()}
                alt={`${title} Event Poster`}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Poster Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
                <p className="text-white/80 text-sm">
                  {formatDate(date)} • {formatTime(time)} • Blue Heron Café
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export async function getStaticProps({ params }) {
  const query = `*[_type == "event" && slug.current == $slug][0]{
    title,
    description,
    date,
    time,
    image,
    metaDescription,
    openGraphImage
  }`;

  const event = await client.fetch(query, { slug: params.slug });

  return {
    props: { event },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const query = `*[_type == "event"]{ "slug": slug.current }`;
  const slugs = await client.fetch(query);

  const paths = slugs.map((s) => ({
    params: { slug: s.slug },
  }));

  return { paths, fallback: true };
}