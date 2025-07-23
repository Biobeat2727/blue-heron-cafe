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
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-cyan-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
        <div className="max-w-md px-6 mx-auto text-center">
          <div className="mb-6 text-6xl">🎵</div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Event Not Found</h1>
          <p className="mb-6 text-gray-600">This event may have been removed or the link is incorrect.</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-colors rounded-lg bg-cyan-600 hover:bg-cyan-700"
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

  // Fixed timezone-safe date formatting (same as StableEventsShowcase)
  const formatDate = (isoDate) => {
    // If it's a string in YYYY-MM-DD format, parse it as local date
    if (typeof isoDate === 'string') {
      const [year, month, day] = isoDate.split('-').map(Number);
      // Create date at noon local time to avoid timezone shifts
      const localDate = new Date(year, month - 1, day, 12, 0, 0);
      return localDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    
    // Fallback for Date objects
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Simplified time formatting - just display what Sanity gives us
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // If it already contains am/pm or is a range, return as-is
    if (timeString.includes('am') || timeString.includes('pm') || timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    // If it contains a dash (range), return as-is
    if (timeString.includes(' - ') || timeString.includes('-')) {
      return timeString;
    }
    
    // Only convert if it's in 24-hour format (HH:MM)
    if (timeString.match(/^\d{1,2}:\d{2}$/)) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${ampm}`;
    }
    
    // Return original if we can't parse it
    return timeString;
  };

  // Check if event is today (same logic as StableEventsShowcase)
  const isEventToday = (eventDateString) => {
    const today = new Date();
    
    if (typeof eventDateString === 'string') {
      const [year, month, day] = eventDateString.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day, 12, 0, 0);
      
      return (
        today.getFullYear() === eventDate.getFullYear() &&
        today.getMonth() === eventDate.getMonth() &&
        today.getDate() === eventDate.getDate()
      );
    }
    
    const eventDate = new Date(eventDateString);
    return today.toDateString() === eventDate.toDateString();
  };

  const isToday = isEventToday(date);
  const eventDate = new Date(date);
  const today = new Date();
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
                className="object-cover w-full h-full filter blur-sm"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
              
              {/* Event Status Badge */}
              <div className="absolute top-6 right-6">
                {isToday ? (
                  <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-full animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    TODAY!
                  </div>
                ) : isPast ? (
                  <div className="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-full">
                    Past Event
                  </div>
                ) : (
                  <div className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-emerald-500">
                    Upcoming
                  </div>
                )}
              </div>

              {/* Back Button */}
              <div className="absolute top-6 left-6">
                <Link
                  href="/events"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 transition-all rounded-full shadow-lg bg-white/90 backdrop-blur-sm hover:text-cyan-700 hover:bg-white"
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
                  <div className="p-8 border bg-black/30 backdrop-blur-md rounded-2xl border-white/20">
                    <motion.h1
                      className="mb-4 font-serif text-4xl font-bold text-white md:text-6xl drop-shadow-2xl"
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
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-full bg-white/25 backdrop-blur-sm border-white/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">{formatDate(date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-full bg-white/25 backdrop-blur-sm border-white/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{formatTime(time)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-full bg-white/25 backdrop-blur-sm border-white/30">
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
        <div className="max-w-4xl px-6 py-16 mx-auto">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="mb-6 font-serif text-2xl font-bold text-gray-900">Event Details</h2>
                {description && (
                  <div className="mb-8 leading-relaxed prose prose-lg text-gray-700">
                    {description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
                
                {!description && (
                  <p className="mb-8 italic text-gray-600">
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
                    <h3 className="mb-4 font-serif text-xl font-bold text-gray-900">Event Poster</h3>
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => {
                        console.log("Poster clicked!"); // Debug log
                        setShowPosterLightbox(true);
                      }}
                    >
                      <img
                        src={urlFor(image).width(600).url()}
                        alt={`${title} Event Poster`}
                        className="w-full max-w-md mx-auto transition-all duration-300 shadow-lg rounded-xl group-hover:shadow-2xl group-hover:scale-105"
                      />
                      
                      {/* Overlay with zoom icon */}
                      <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 bg-black/0 group-hover:bg-black/20 rounded-xl group-hover:opacity-100">
                        <div className="p-3 rounded-full shadow-lg bg-white/90 backdrop-blur-sm">
                          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Click to view text */}
                      <div className="absolute transition-opacity duration-300 opacity-0 bottom-4 left-4 right-4 group-hover:opacity-100">
                        <div className="px-3 py-2 text-sm text-center text-white rounded-lg bg-black/70 backdrop-blur-sm">
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
                className="sticky p-8 bg-white border border-gray-100 shadow-xl rounded-2xl top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="mb-6 font-serif text-xl font-bold text-cyan-800">Event Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100">
                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(date)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100">
                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Time</p>
                        <p className="font-semibold text-gray-900">{formatTime(time)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100">
                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="font-semibold text-gray-900">Blue Heron Café</p>
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
                    className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-center text-white transition-colors rounded-lg bg-cyan-600 hover:bg-cyan-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call for Info
                  </a>
                  
                  <Link
                    href="/contact"
                    className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-center text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
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
                    className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-center transition-colors rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
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
        <div className="py-16 bg-gradient-to-r from-cyan-50 to-emerald-50">
          <div className="max-w-6xl px-6 mx-auto text-center">
            <h3 className="mb-6 font-serif text-3xl font-bold text-cyan-800">
              More Events at Blue Heron Café
            </h3>
            <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600">
              Don't miss out on our other amazing events featuring live music, community gatherings, and seasonal celebrations.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white transition-all shadow-lg bg-cyan-600 rounded-xl hover:bg-cyan-700"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
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
                className="absolute right-0 z-10 text-white transition-colors -top-12 hover:text-gray-300"
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
              <div className="absolute bottom-0 left-0 right-0 p-6 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
                <p className="text-sm text-white/80">
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