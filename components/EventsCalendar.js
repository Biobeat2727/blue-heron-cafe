// components/EventsCalendar.js - Now actually functional!
import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const formatDate = (date) => date.toISOString().split("T")[0];

const EventsCalendar = ({ events }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventPopup, setShowEventPopup] = useState(false);

  const eventDates = useMemo(() => {
    const map = {};
    events.forEach((event) => {
      const dateStr = event.date;
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(event);
    });
    return map;
  }, [events]);

  const formatEventDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const tileContent = ({ date, view }) => {
    const dateStr = formatDate(date);
    if (view === 'month' && eventDates[dateStr]) {
      const eventCount = eventDates[dateStr].length;
      return (
        <div className="mt-1 flex justify-center">
          <div className="flex gap-1">
            {eventCount > 1 ? (
              <div className="flex gap-0.5">
                <span className="block w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                <span className="block w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                <span className="block w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
              </div>
            ) : (
              <span className="block w-2 h-2 rounded-full bg-cyan-600"></span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const handleClickDay = (value) => {
    const clickedDate = formatDate(value);
    const eventsOnDate = eventDates[clickedDate];
    
    if (!eventsOnDate || eventsOnDate.length === 0) {
      setShowEventPopup(false);
      return;
    }

    setSelectedDate(clickedDate);
    setShowEventPopup(true);

    // Also scroll to the first event of that date in the main events grid
    setTimeout(() => {
      const targetId = `event-${eventsOnDate[0]._id}`;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        
        // Add a brief highlight effect
        targetEl.classList.add('ring-4', 'ring-cyan-300', 'ring-opacity-75');
        setTimeout(() => {
          targetEl.classList.remove('ring-4', 'ring-cyan-300', 'ring-opacity-75');
        }, 2000);
      }
    }, 100);
  };

  const selectedEvents = selectedDate ? eventDates[selectedDate] || [] : [];

  return (
    <section ref={ref} className="relative w-full py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header with parallax effect */}
        <motion.div
          style={{ scale, opacity }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-5xl font-extrabold text-cyan-800 tracking-tight font-serif mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Event Calendar
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Click on any highlighted date to view event details and jump to them below.
          </motion.p>
        </motion.div>

        {/* Calendar Container */}
        <div className="flex justify-center">
          <motion.div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-cyan-100 mx-auto relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -2 }}
          >
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 text-white text-center">
              <h3 className="text-xl font-semibold">Upcoming Events</h3>
              <p className="text-cyan-100 text-sm mt-1">Click a date to see event details</p>
            </div>

            {/* Calendar Body */}
            <div className="p-6">
              <Calendar
                onClickDay={handleClickDay}
                tileContent={tileContent}
                className="w-full border-0 bg-transparent custom-blue-heron-calendar mx-auto"
              />
            </div>

            {/* Legend */}
            <div className="px-6 pb-6 border-t border-cyan-100 pt-4">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="block w-2 h-2 rounded-full bg-cyan-600"></span>
                  <span>Event</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    <span className="block w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                    <span className="block w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                    <span className="block w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                  </div>
                  <span>Multiple Events</span>
                </div>
              </div>
            </div>

            {/* Event Popup */}
            <AnimatePresence>
              {showEventPopup && selectedEvents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  className="absolute inset-x-4 top-4 bg-white rounded-xl shadow-2xl border-2 border-cyan-200 z-50 max-h-80 overflow-y-auto"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-lg text-cyan-800">
                        {formatEventDate(selectedDate)}
                      </h4>
                      <button
                        onClick={() => setShowEventPopup(false)}
                        className="text-gray-400 hover:text-red-500 text-xl font-bold w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedEvents.map((event) => (
                        <div key={event._id} className="border-l-4 border-cyan-500 pl-3 py-2">
                          <a 
                            href={`/events/${event.slug?.current || event.slug}`}
                            className="block hover:bg-gray-50 rounded p-2 -m-2 transition-colors"
                          >
                            <h5 className="font-semibold text-gray-900 hover:text-cyan-700">{event.title}</h5>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {event.time}
                            </p>
                            {event.description && (
                              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                                {event.description.length > 80 
                                  ? event.description.substring(0, 80) + "..." 
                                  : event.description}
                              </p>
                            )}
                            <p className="text-xs text-cyan-600 mt-1 flex items-center gap-1">
                              Click to view full details
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </p>
                          </a>
                        </div>
                      ))}
                    </div>
                    
                    {selectedEvents.length === 1 ? (
                      <a
                        href={`/events/${selectedEvents[0].slug?.current || selectedEvents[0].slug}`}
                        className="w-full mt-4 bg-cyan-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-colors block text-center"
                      >
                        View Full Event Details
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setShowEventPopup(false);
                          // Scroll to events section for multiple events
                          const eventsSection = document.getElementById('events-grid') || 
                                              document.querySelector('[data-events-section]') ||
                                              document.querySelector('.grid') ||
                                              document.querySelector('main > div:last-child');
                          
                          if (eventsSection) {
                            eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          } else {
                            window.scrollBy({ top: 600, behavior: 'smooth' });
                          }
                        }}
                        className="w-full mt-4 bg-cyan-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-colors"
                      >
                        View All Events for This Day
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Custom Styles - Same as before */}
      <style jsx global>{`
        .custom-blue-heron-calendar {
          font-family: inherit;
        }

        .custom-blue-heron-calendar .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1rem;
        }

        .custom-blue-heron-calendar .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          border: none;
          color: #0891b2;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .custom-blue-heron-calendar .react-calendar__navigation button:hover {
          background-color: #f0f9ff;
          color: #0e7490;
          border-radius: 8px;
        }

        .custom-blue-heron-calendar .react-calendar__navigation button:disabled {
          color: #94a3b8;
        }

        .custom-blue-heron-calendar .react-calendar__month-view,
        .custom-blue-heron-calendar .react-calendar__month-view__weekdays,
        .custom-blue-heron-calendar .react-calendar__month-view__days {
          width: 100% !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding: 0 !important;
        }

        .custom-blue-heron-calendar .react-calendar__month-view__weekdays {
          margin-bottom: 8px !important;
          display: table !important;
          table-layout: fixed !important;
          border-spacing: 0 !important;
        }

        .custom-blue-heron-calendar .react-calendar__month-view__weekdays__weekday {
          display: table-cell !important;
          width: 14.28571% !important;
          padding: 8px 0 !important;
          text-align: center !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          color: #0891b2 !important;
          border-bottom: 2px solid #f0f9ff !important;
          margin: 0 !important;
        }

        .custom-blue-heron-calendar .react-calendar__month-view__days {
          display: table !important;
          table-layout: fixed !important;
          border-spacing: 2px !important;
        }

        .custom-blue-heron-calendar .react-calendar__tile {
          display: table-cell !important;
          width: 14.28571% !important;
          height: 48px !important;
          padding: 12px 6px !important;
          background: none !important;
          border: none !important;
          color: #374151 !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          text-align: center !important;
          vertical-align: middle !important;
          border-radius: 8px !important;
          margin: 0 !important;
          transition: all 0.2s ease !important;
          position: relative !important;
        }

        .custom-blue-heron-calendar .react-calendar__tile:hover {
          background-color: #f0f9ff;
          color: #0e7490;
          transform: translateY(-1px);
        }

        .custom-blue-heron-calendar .react-calendar__tile--active {
          background: linear-gradient(135deg, #0891b2, #0e7490) !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
        }

        .custom-blue-heron-calendar .react-calendar__tile--active:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(8, 145, 178, 0.4);
        }

        .custom-blue-heron-calendar .react-calendar__tile--now {
          background-color: #ecfeff;
          color: #0891b2;
          font-weight: 600;
        }

        .custom-blue-heron-calendar .react-calendar__tile--now:hover {
          background-color: #cffafe;
        }

        .custom-blue-heron-calendar .react-calendar__tile--hasActive {
          background: #f0f9ff;
          color: #0891b2;
        }

        .custom-blue-heron-calendar .react-calendar__tile--neighbor-month {
          color: #9ca3af;
        }

        .custom-blue-heron-calendar .react-calendar__tile--neighbor-month:hover {
          color: #6b7280;
        }

        .custom-blue-heron-calendar .react-calendar__month-view__days__day--weekend {
          color: #7c3aed;
        }

        .custom-blue-heron-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #d1d5db;
        }

        /* Mobile responsiveness */
        @media (max-width: 640px) {
          .custom-blue-heron-calendar .react-calendar__tile {
            padding: 8px 4px;
            font-size: 12px;
            min-height: 40px;
          }

          .custom-blue-heron-calendar .react-calendar__navigation button {
            min-width: 36px;
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
};

export default EventsCalendar;