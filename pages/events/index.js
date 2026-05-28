import SEO from "@/components/SEO";
import { generateBreadcrumbSchema } from "@/lib/structuredData";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { getAllEvents, getSponsors } from "@/lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity";

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}
import EventsCalendar from "@/components/EventsCalendar";

export default function EventsPage({ events, sponsors }) {
  // Use events directly since backend filtering now handles date logic properly
  const futureEvents = events;
  const [posterOpen, setPosterOpen] = useState(false);
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  // s=scale, tx/ty=translation, ox/oy=image layout offset relative to container
  const stRef = useRef({ s: 1, tx: 0, ty: 0, ox: 0, oy: 0 });

  const applyTransform = () => {
    if (!imgRef.current) return;
    const { s, tx, ty } = stRef.current;
    imgRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  };

  const closePoster = () => {
    if (imgRef.current) imgRef.current.style.transform = '';
    stRef.current = { s: 1, tx: 0, ty: 0, ox: 0, oy: 0 };
    setPosterOpen(false);
  };

  useEffect(() => {
    if (!posterOpen) return;
    const container = containerRef.current;
    if (!container) return;

    // Capture image layout position before any touch transforms
    requestAnimationFrame(() => {
      if (!imgRef.current || !containerRef.current) return;
      const ir = imgRef.current.getBoundingClientRect();
      const cr = containerRef.current.getBoundingClientRect();
      stRef.current.ox = ir.left - cr.left;
      stRef.current.oy = ir.top - cr.top;
    });

    const t = { dist: null, mid: null, pos: null };
    const D = (ts) => Math.hypot(ts[1].clientX - ts[0].clientX, ts[1].clientY - ts[0].clientY);
    const Mid = (ts) => ({ x: (ts[0].clientX + ts[1].clientX) / 2, y: (ts[0].clientY + ts[1].clientY) / 2 });

    const onStart = (e) => {
      e.preventDefault();
      const ts = Array.from(e.touches);
      if (ts.length === 2) {
        t.dist = D(ts);
        t.mid = Mid(ts);
        t.pos = null;
      } else {
        t.dist = null;
        t.mid = null;
        t.pos = { x: ts[0].clientX, y: ts[0].clientY };
      }
    };

    const onMove = (e) => {
      e.preventDefault();
      const ts = Array.from(e.touches);
      const cr = container.getBoundingClientRect();
      const { s, tx, ty, ox, oy } = stRef.current;

      if (ts.length === 2 && t.dist) {
        const d = D(ts);
        const m = Mid(ts);
        const ratio = d / t.dist;
        const newS = Math.min(Math.max(s * ratio, 1), 6);

        // Focal point relative to container
        const fx = m.x - cr.left;
        const fy = m.y - cr.top;

        // Keep the pinch focal point fixed under the fingers
        // With transform-origin:0 0, a container point (fx,fy) is at image offset
        // (fx - ox - tx) / s, so newTx = fx - ox - (fx - ox - tx) * (newS / s)
        stRef.current.tx = fx - ox - (fx - ox - tx) * (newS / s);
        stRef.current.ty = fy - oy - (fy - oy - ty) * (newS / s);
        stRef.current.s = newS;

        // Also pan by midpoint delta
        stRef.current.tx += m.x - t.mid.x;
        stRef.current.ty += m.y - t.mid.y;

        t.dist = d;
        t.mid = m;
        applyTransform();
      } else if (ts.length === 1) {
        const p = { x: ts[0].clientX, y: ts[0].clientY };
        if (t.pos) {
          stRef.current.tx += p.x - t.pos.x;
          stRef.current.ty += p.y - t.pos.y;
          applyTransform();
        }
        t.pos = p;
      }
    };

    const onEnd = (e) => {
      const ts = Array.from(e.touches);
      t.dist = null;
      t.mid = null;
      t.pos = ts.length >= 1 ? { x: ts[0].clientX, y: ts[0].clientY } : null;
    };

    container.addEventListener('touchstart', onStart, { passive: false });
    container.addEventListener('touchmove', onMove, { passive: false });
    container.addEventListener('touchend', onEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', onStart);
      container.removeEventListener('touchmove', onMove);
      container.removeEventListener('touchend', onEnd);
    };
  }, [posterOpen]);

  // Fixed timezone-safe date formatting
  const formatDate = (isoDate) => {
    // If it's a string in YYYY-MM-DD format, parse it as local date
    if (typeof isoDate === 'string') {
      const [year, month, day] = isoDate.split('-').map(Number);
      // Create date at noon local time to avoid timezone shifts
      const localDate = new Date(year, month - 1, day, 12, 0, 0);
      return localDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    
    // Fallback for Date objects
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    // Convert 24h to 12h format if needed
    const [hours, minutes] = timeString.split(':');
    const hour12 = ((parseInt(hours) + 11) % 12) + 1;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Show message if no upcoming events
  if (futureEvents.length === 0) {
    return (
      <>
        <SEO
          title="Live Events | Blue Heron Café — Outdoor Stage in Samuels, Idaho"
          description="Join us for live music, community gatherings, and seasonal events at Blue Heron Café's outdoor stage and patio in Samuels, Idaho near Sandpoint."
          keywords="live music near Sandpoint Idaho, outdoor events Samuels ID, Blue Heron Café events, North Idaho live music venue, concerts near Sandpoint"
          url="/events"
          jsonLd={generateBreadcrumbSchema([
            { name: "Home", url: "https://blueheronsamuels.com" },
            { name: "Events", url: "https://blueheronsamuels.com/events" },
          ])}
        />

        <main className="min-h-screen pt-24 pb-32 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-emerald-600/10 to-blue-600/10"></div>
            
            <section className="relative max-w-5xl px-6 mx-auto mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                New Outdoor Stage & Patio Now Open!
              </div>
              
              <h1 className="mb-6 text-6xl font-bold leading-tight text-transparent lg:text-7xl bg-gradient-to-r from-emerald-700 via-blue-700 to-emerald-600 bg-clip-text">
                Our Live Events
              </h1>
              
              <p className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed text-gray-700">
                Join us at our beautiful new outdoor stage and patio area for unforgettable evenings of live music, community gatherings, and seasonal celebrations in the heart of Samuels, Idaho.
              </p>
            </section>
          </div>

          {/* No Events Message */}
          <div className="max-w-4xl px-6 mx-auto text-center">
            <div className="p-12 bg-white border shadow-lg rounded-2xl border-emerald-100">
              <div className="mb-6 text-6xl">🎵</div>
              <h2 className="mb-4 text-3xl font-bold text-gray-800">
                No Upcoming Events Scheduled
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                We're planning some amazing events for our outdoor stage and patio! 
                Check back soon or follow us on social media for announcements.
              </p>
              
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href="tel:+12082631146" // Use your actual number
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition rounded-lg bg-emerald-600 hover:bg-emerald-700"
                >
                  📞 Call for Event Info
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition border-2 rounded-lg border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                >
                  📧 Contact Us
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Live Events | Blue Heron Café — Outdoor Stage in Samuels, Idaho"
        description="Join us for live music, community gatherings, and seasonal events at Blue Heron Café's outdoor stage and patio in Samuels, Idaho near Sandpoint."
        keywords="live music near Sandpoint Idaho, outdoor events Samuels ID, Blue Heron Café events, North Idaho live music venue, concerts near Sandpoint"
        url="/events"
        jsonLd={generateBreadcrumbSchema([
          { name: "Home", url: "https://blueheronsamuels.com" },
          { name: "Events", url: "https://blueheronsamuels.com/events" },
        ])}
      />

      <main className="min-h-screen pt-24 pb-32 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-emerald-600/10 to-blue-600/10"></div>
          
          <section className="relative max-w-5xl px-6 mx-auto mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              New Outdoor Stage & Patio Now Open!
            </div>
            
            <h1 className="mb-6 text-6xl font-bold leading-tight text-transparent lg:text-7xl bg-gradient-to-r from-emerald-700 via-blue-700 to-emerald-600 bg-clip-text">
              Come Enjoy Our Live Events
            </h1>

            {/* Season Poster */}
            <div className="max-w-3xl mx-auto mb-8">
              <button
                onClick={() => setPosterOpen(true)}
                className="w-full focus:outline-none group"
                aria-label="View full-size events poster"
              >
                <img
                  src="/images/hero/summer_sunset.png"
                  alt="Upcoming shows at Blue Heron Café"
                  className="w-full rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <p className="mt-2 text-sm font-medium text-emerald-600">Tap to view full size</p>
              </button>
            </div>

            <p className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed text-gray-700">
              Join us at our beautiful new outdoor stage and patio area for unforgettable evenings of live music, community gatherings, and seasonal celebrations in the heart of Samuels, Idaho.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="px-6 py-3 border rounded-lg shadow-lg bg-white/80 backdrop-blur-sm border-emerald-100">
                <span className="font-semibold text-emerald-600">🎵 Live Music</span>
              </div>
              <div className="px-6 py-3 border rounded-lg shadow-lg bg-white/80 backdrop-blur-sm border-emerald-100">
                <span className="font-semibold text-emerald-600">🌿 Garden Patio</span>
              </div>
              <div className="px-6 py-3 border rounded-lg shadow-lg bg-white/80 backdrop-blur-sm border-emerald-100">
                <span className="font-semibold text-emerald-600">🎭 Community Events</span>
              </div>
            </div>
          </section>
        </div>

        {/* Events Calendar - Pass filtered events */}
        <div className="px-6 mx-auto mb-16 max-w-7xl">
          <EventsCalendar events={futureEvents} />
        </div>

        {/* Events Grid */}
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              Upcoming Events ({futureEvents.length})
            </h2>
            <div className="flex-1 h-px ml-8 bg-gradient-to-r from-emerald-300 to-blue-300"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {futureEvents.map((event, index) => (
              <Link key={event._id} href={`/events/${event.slug}`}>
                <div 
                  className="overflow-hidden transition-all duration-500 transform bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl hover:border-emerald-200 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                  data-event-date={event.date} // Added for calendar clicking
                >
                  <div className="relative aspect-[5/3] w-full overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-100"></div>
                    <div className="absolute px-3 py-1 text-sm font-medium text-white rounded-full top-4 right-4 bg-emerald-600">
                      Outdoor Stage
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-sm font-medium tracking-wide uppercase text-emerald-600">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    
                    <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-emerald-600 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Outdoor Patio
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 pb-6">
                    <div className="flex items-center font-medium transition-colors text-emerald-600 group-hover:text-emerald-700">
                      <span className="mr-2">Learn More</span>
                      <svg className="w-4 h-4 transition-transform transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sponsors Section */}
          {sponsors && sponsors.length > 0 && (
            <div className="py-10 mt-16 border-t border-gray-100">
              <p className="mb-6 text-xs font-bold tracking-widest text-center text-gray-400 uppercase">
                Thanks to our sponsors
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {sponsors.map((sponsor, i) => {
                  const logo = (
                    <img
                      src={urlFor(sponsor.logo).height(80).format('png').url()}
                      alt={sponsor.name || 'Sponsor'}
                      className="object-contain h-10 max-w-[130px] grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                    />
                  );
                  return sponsor.url ? (
                    <a key={i} href={sponsor.url} target="_blank" rel="noopener noreferrer" title={sponsor.name}>
                      {logo}
                    </a>
                  ) : (
                    <span key={i}>{logo}</span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <div className="max-w-4xl p-8 mx-auto text-white bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl">
              <h3 className="mb-4 text-3xl font-bold">
                Ready to Experience Our Outdoor Stage?
              </h3>
              <p className="mb-6 text-lg text-emerald-100">
                Join us for an evening under the stars with live music and great food.
              </p>
              <Link
                href="/contact"
                className="px-8 py-3 font-bold transition-colors bg-white rounded-full shadow-lg text-emerald-600 hover:bg-emerald-50"
              >
                Get Event Updates
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Poster Lightbox */}
      {posterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closePoster}
        >
          {/* Close button */}
          <button
            onClick={closePoster}
            className="absolute z-10 text-4xl font-bold leading-none text-white top-4 right-4 hover:text-gray-300"
            aria-label="Close"
          >
            &times;
          </button>

          {/* Hint */}
          <p className="absolute z-10 text-sm -translate-x-1/2 pointer-events-none bottom-4 left-1/2 text-white/60">
            Pinch to zoom · Drag to pan · Double-tap to reset
          </p>

          {/* Zoomable image container */}
          <div
            ref={containerRef}
            className="flex items-center justify-center w-full h-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={() => {
              stRef.current.s = 1;
              stRef.current.tx = 0;
              stRef.current.ty = 0;
              applyTransform();
            }}
            style={{ touchAction: "none" }}
          >
            <img
              ref={imgRef}
              src="/images/hero/summer_sunset.png"
              alt="Upcoming shows at Blue Heron Café"
              style={{
                transformOrigin: "0 0",
                maxWidth: "95vw",
                maxHeight: "95vh",
                width: "auto",
                height: "auto",
                borderRadius: "0.75rem",
                userSelect: "none",
                WebkitUserDrag: "none",
              }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}

export async function getStaticProps() {
  const [events, sponsors] = await Promise.all([
    getAllEvents(),
    getSponsors(),
  ]);

  return {
    props: { events, sponsors },
    revalidate: 60,
  };
}