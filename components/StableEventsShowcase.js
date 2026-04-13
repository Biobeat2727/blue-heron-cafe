// Enhanced StableEventsShowcase with Poster Lightbox
import { useEffect, useState, useRef } from "react";
import { getUpcomingEvents } from "@/lib/sanity";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const StableEventsShowcase = () => {
  const [events, setEvents] = useState([]);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seasonPosterOpen, setSeasonPosterOpen] = useState(false);
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const stRef = useRef({ s: 1, tx: 0, ty: 0, ox: 0, oy: 0 });

  const applyTransform = () => {
    if (!imgRef.current) return;
    const { s, tx, ty } = stRef.current;
    imgRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  };

  const closeSeasonPoster = () => {
    if (imgRef.current) imgRef.current.style.transform = '';
    stRef.current = { s: 1, tx: 0, ty: 0, ox: 0, oy: 0 };
    setSeasonPosterOpen(false);
  };

  useEffect(() => {
    if (!seasonPosterOpen) return;
    const container = containerRef.current;
    if (!container) return;

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
        t.dist = D(ts); t.mid = Mid(ts); t.pos = null;
      } else {
        t.dist = null; t.mid = null;
        t.pos = { x: ts[0].clientX, y: ts[0].clientY };
      }
    };

    const onMove = (e) => {
      e.preventDefault();
      const ts = Array.from(e.touches);
      const cr = container.getBoundingClientRect();
      const { s, tx, ty, ox, oy } = stRef.current;

      if (ts.length === 2 && t.dist) {
        const d = D(ts), m = Mid(ts);
        const ratio = d / t.dist;
        const newS = Math.min(Math.max(s * ratio, 1), 6);
        const fx = m.x - cr.left, fy = m.y - cr.top;
        stRef.current.tx = fx - ox - (fx - ox - tx) * (newS / s);
        stRef.current.ty = fy - oy - (fy - oy - ty) * (newS / s);
        stRef.current.s = newS;
        stRef.current.tx += m.x - t.mid.x;
        stRef.current.ty += m.y - t.mid.y;
        t.dist = d; t.mid = m;
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
      t.dist = null; t.mid = null;
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
  }, [seasonPosterOpen]);

  useEffect(() => {
    getUpcomingEvents().then((data) => {
      // Remove client-side filtering since backend now handles it properly
      setEvents(data);
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching events:', error);
      setEvents([]);
      setLoading(false);
    });
  }, []);

  const formatDate = (isoDate) => {
    if (typeof isoDate === 'string') {
      const [year, month, day] = isoDate.split('-').map(Number);
      const localDate = new Date(year, month - 1, day, 12, 0, 0);
      return localDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    });
  };

  const formatDateShort = (isoDate) => {
    if (typeof isoDate === 'string') {
      const [year, month, day] = isoDate.split('-').map(Number);
      const localDate = new Date(year, month - 1, day, 12, 0, 0);
      return {
        month: localDate.toLocaleDateString("en-US", { month: "short" }),
        day: localDate.getDate()
      };
    }
    
    const date = new Date(isoDate);
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      day: date.getDate()
    };
  };

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

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-slate-50 via-emerald-25 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-emerald-700 font-serif">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Loading our latest events...
            </p>
          </div>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-emerald-25 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-emerald-700 font-serif">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join us for live music, community gatherings, and seasonal celebrations at our beautiful outdoor stage and patio.
          </p>
        </div>

        {/* Season Poster */}
        <div className="mb-16 max-w-3xl mx-auto">
          <button
            onClick={() => setSeasonPosterOpen(true)}
            className="w-full focus:outline-none group"
            aria-label="View full-size events poster"
          >
            <img
              src="/images/hero/SUMMER SUNSET.png"
              alt="Upcoming shows at Blue Heron Café"
              className="w-full rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <p className="text-sm text-emerald-600 mt-2 font-medium">Tap to view full size</p>
          </button>
        </div>

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {events.map((event, index) => {
              const dateInfo = formatDateShort(event.date);
              const isToday = isEventToday(event.date);
              
              return (
                <div
                  key={event._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-[5/3] w-full overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Poster View Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Poster button clicked for:', event.title); // Debug log
                        setSelectedPoster(event);
                      }}
                      className="absolute top-4 left-4 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 z-10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Poster
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Date Badge */}
                    <div className={`absolute top-4 right-4 ${isToday ? 'bg-red-500' : 'bg-white/95'} backdrop-blur-sm rounded-xl overflow-hidden shadow-lg`}>
                      <div className={`${isToday ? 'bg-red-600' : 'bg-emerald-600'} text-white text-center py-1 px-3`}>
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          {isToday ? 'TODAY' : dateInfo.month}
                        </span>
                      </div>
                      <div className={`${isToday ? 'text-white' : 'text-gray-900'} text-center py-2 px-3`}>
                        <span className="text-xl font-bold">{dateInfo.day}</span>
                      </div>
                    </div>

                    {/* Live Event Badge */}
                    <div className={`absolute bottom-4 right-4 ${isToday ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      {isToday ? 'Today!' : 'Live Event'}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
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
                        Outdoor Stage
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {event.description.length > 100 
                          ? event.description.substring(0, 100) + "..." 
                          : event.description
                        }
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <Link
                        href={`/events/${event.slug}`}
                        className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors flex items-center gap-1"
                      >
                        <span>Learn More</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* No Events State */
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto border border-gray-100">
              <div className="text-6xl mb-6">🎵</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Upcoming Events</h3>
              <p className="text-lg text-gray-600 mb-8">
                We're planning some amazing events for our outdoor stage! 
                Check back soon or contact us for private event bookings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact for Events
                </Link>
                <a
                  href="tel:+12082631146"
                  className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  📞 Call Us
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {events.length > 0 && (
          <div className="relative bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-3xl p-12 text-center text-white overflow-visible">
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-normal">
                Experience Our Outdoor Stage
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join us for unforgettable evenings of live music and community under the Idaho sky.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg"
                >
                  <span>View All Events</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </Link>
                
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-emerald-700 transition-all duration-300"
                >
                  <span>Book Private Event</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Season Poster Lightbox */}
      {seasonPosterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeSeasonPoster}
        >
          <button
            onClick={closeSeasonPoster}
            className="absolute top-4 right-4 text-white text-4xl font-bold leading-none hover:text-gray-300 z-10"
            aria-label="Close"
          >
            &times;
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm z-10 pointer-events-none">
            Pinch to zoom · Drag to pan · Double-tap to reset
          </p>
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden"
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
              src="/images/hero/SUMMER SUNSET.png"
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

      {/* Poster Lightbox */}
      <AnimatePresence>
        {selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPoster(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Inside viewport */}
              <button
                onClick={() => setSelectedPoster(null)}
                className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white hover:text-gray-300 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-10 transition-all duration-200 hover:bg-black/80"
              >
                ✕
              </button>
              
              {/* Poster Image */}
              <img
                src={selectedPoster.imageUrl}
                alt={`${selectedPoster.title} - Full Event Poster`}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />
              
              {/* Event Info - Below Image */}
              <div className="mt-6 text-center bg-black/60 backdrop-blur-sm rounded-xl p-6 max-w-2xl">
                <h3 className="text-white text-2xl font-bold mb-2">{selectedPoster.title}</h3>
                <p className="text-gray-200 text-lg">
                  {formatDate(selectedPoster.date)} • {selectedPoster.time}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Image */}
              <div className="relative h-80">
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 hover:text-red-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all shadow-lg"
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </button>
                
                {/* Date Badge in Modal */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-emerald-600 text-white text-center py-1 px-3">
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {formatDateShort(selectedEvent.date).month}
                    </span>
                  </div>
                  <div className="text-gray-900 text-center py-2 px-3">
                    <span className="text-2xl font-bold">
                      {formatDateShort(selectedEvent.date).day}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h3>
                
                <div className="flex items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{selectedEvent.time}</span>
                  </div>
                </div>
                
                {selectedEvent.description && (
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {selectedEvent.description}
                  </p>
                )}

                <div className="flex gap-4">
                  <Link
                    href={`/events/${selectedEvent.slug}`}
                    className="flex-1 bg-emerald-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    onClick={() => setSelectedEvent(null)}
                  >
                    View Full Details
                  </Link>
                  <button
                    onClick={() => setSelectedPoster(selectedEvent)}
                    className="flex-1 bg-gray-100 text-gray-700 text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    View Poster
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StableEventsShowcase;