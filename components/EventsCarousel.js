import { useEffect, useState } from "react";
import { getUpcomingEvents } from "@/lib/sanity";
import { motion, AnimatePresence } from "framer-motion";

const EventsCarousel = () => {
  const [events, setEvents] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getUpcomingEvents().then(setEvents);
  }, []);

  const expandedEvent = events.find((event) => event._id === expandedId);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="bg-cyan-50 py-16">
      <h2 className="text-4xl font-bold text-center mb-8">Upcoming Events</h2>

      <div className="px-6">
        <div className="flex flex-wrap justify-center gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              onClick={() => setExpandedId(event._id)}
              className="cursor-pointer w-64 bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden hover:scale-105"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(event.date)} • {event.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {expandedEvent && (
          <motion.div
            key={expandedEvent._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
            onClick={() => setExpandedId(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl"
                onClick={() => setExpandedId(null)}
              >
                ×
              </button>
              <img
                src={expandedEvent.imageUrl}
                alt={expandedEvent.title}
                className="w-full h-60 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold mb-2">{expandedEvent.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {formatDate(expandedEvent.date)} • {expandedEvent.time}
              </p>
              <p className="text-gray-700 text-base leading-relaxed">
                {expandedEvent.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mt-10">
        <a
          href="/events"
          className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-md text-lg font-semibold hover:bg-cyan-700 transition"
        >
          View All Events
        </a>
      </div>
    </section>
  );
};

export default EventsCarousel;
