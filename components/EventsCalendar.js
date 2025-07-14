import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import Link from "next/link";
import 'react-calendar/dist/Calendar.css';

// Fixed timezone-aware date formatting
const formatDate = (date) => {
  // If date is a string from Sanity (YYYY-MM-DD format)
  if (typeof date === 'string') {
    // Return the string as-is since it's already in YYYY-MM-DD format
    return date;
  }
  
  // If it's a Date object, convert to YYYY-MM-DD in local timezone
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return date;
};

const EventsCalendar = ({ events = [] }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  
  // Modal state for event details
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const eventDates = useMemo(() => {
    const map = {};
    // Safety check: ensure events exists and is an array
    if (events && Array.isArray(events)) {
      events.forEach((event) => {
        const dateStr = formatDate(event.date);
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(event);
      });
    }
    return map;
  }, [events]);

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
    if (!eventsOnDate || eventsOnDate.length === 0) return;

    setSelectedDate(clickedDate);
    setSelectedEvents(eventsOnDate);
  };

  const closeModal = () => {
    setSelectedDate(null);
    setSelectedEvents([]);
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (typeof dateString === 'string') {
      const [year, month, day] = dateString.split('-').map(Number);
      const localDate = new Date(year, month - 1, day, 12, 0, 0);
      return localDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return dateString;
  };

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
            Click on any highlighted date to view scheduled events and details.
          </motion.p>
        </motion.div>

        {/* Calendar Container */}
        <div className="flex justify-center">
          <motion.div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-cyan-100 mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -2 }}
          >
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 text-white text-center">
              <h3 className="text-xl font-semibold">Upcoming Events</h3>
              <p className="text-cyan-100 text-sm mt-1">Select a date to view details</p>
            </div>

            {/* Calendar Body */}
            <div className="p-6">
              <Calendar
                onClickDay={handleClickDay}
                tileContent={tileContent}
                className="w-full border-0 bg-transparent custom-blue-heron-calendar mx-auto"
                locale="en-US"
                calendarType="gregory"
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
          </motion.div>
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedDate && selectedEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
                onClick={closeModal}
              >
                ×
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Events on {formatDateForDisplay(selectedDate)}
                </h3>
                <p className="text-gray-600">
                  {selectedEvents.length} event{selectedEvents.length > 1 ? 's' : ''} scheduled
                </p>
              </div>

              <div className="space-y-6">
                {selectedEvents.map((event, index) => (
                  <div
                    key={event._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 transition-colors"
                  >
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">
                          {event.title}
                        </h4>
                        
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
                            Outdoor Patio
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-gray-700 mb-4 line-clamp-3">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {event.slug && (
                      <div className="flex justify-end">
                        <Link
                          href={`/events/${event.slug.current}`}
                          className="inline-flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition font-medium"
                          onClick={closeModal}
                        >
                          View Details
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Styles */}
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