// components/StableEventsShowcase.js - Professional but stable version with date filtering
import { useEffect, useState } from "react";
import { getUpcomingEvents } from "@/lib/sanity";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";

const StableEventsShowcase = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUpcomingEvents().then((data) => {
      // Additional client-side filtering as backup to ensure past events don't show
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      
      const futureEvents = data.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today; // Shows events on the day of and future events
      });
      
      setEvents(futureEvents);
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching events:', error);
      setEvents([]);
      setLoading(false);
    });
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateShort = (isoDate) => {
    const date = new Date(isoDate);
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      day: date.getDate()
    };
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-slate-50 via-emerald-25 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-emerald-700 font-serif" style={{ lineHeight: '1.2', paddingBottom: '8px' }}>
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
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-emerald-700 font-serif" style={{ lineHeight: '1.2', paddingBottom: '8px' }}>
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join us for live music, community gatherings, and seasonal celebrations at our beautiful outdoor stage and patio.
          </p>
        </div>

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {events.map((event) => {
              const dateInfo = formatDateShort(event.date);
              
              // Check if event is today
              const today = new Date();
              const eventDate = new Date(event.date);
              const isToday = today.toDateString() === eventDate.toDateString();
              
              return (
                <div
                  key={event._id}
                  onClick={() => setSelectedEvent(event)}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden bg-gray-200">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.className = "w-full h-full object-cover bg-gray-200 group-hover:scale-105 transition-transform duration-500";
                      }}
                    />
                    
                    {/* Date Badge */}
                    <div className={`absolute top-4 left-4 ${isToday ? 'bg-red-500' : 'bg-white/95'} backdrop-blur-sm rounded-xl overflow-hidden shadow-lg`}>
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
                    <div className={`absolute top-4 right-4 ${isToday ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      {isToday ? 'Today!' : 'Live Event'}
                    </div>
                  </div>

                  {/* Content */}
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

                    {/* Click indicator */}
                    <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Click for details</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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

        {/* Call to Action - Only show if there are events */}
        {events.length > 0 && (
          <div className="relative bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-3xl p-12 text-center text-white overflow-visible">
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-normal" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.4' }}>
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

      {/* Modal for Event Details */}
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
                    href="/events"
                    className="flex-1 bg-emerald-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    onClick={() => setSelectedEvent(null)}
                  >
                    View All Events
                  </Link>
                  <Link
                    href="/contact"
                    className="flex-1 bg-gray-100 text-gray-700 text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Contact Us
                  </Link>
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