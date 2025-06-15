import { useEffect, useState } from 'react';
import { getUpcomingEvents } from '@/lib/sanity';
import { motion, AnimatePresence } from 'framer-motion';

const EventsCarousel = () => {
  const [events, setEvents] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getUpcomingEvents().then(setEvents);
  }, []);

  const expandedEvent = events.find((event) => event._id === expandedId);

  return (
    <section className="bg-white py-12">
      <h2 className="text-3xl font-bold text-center mb-6">Upcoming Events</h2>

      <div className="px-4">
        <div className="flex flex-wrap justify-center gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              onClick={() => setExpandedId(event._id)}
              className="cursor-pointer w-64 bg-white rounded-lg shadow-md p-4 text-center border hover:shadow-xl transition-all"
            >
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-3">{event.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {event.date} • {event.time}
              </p>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {expandedEvent && (
          <motion.div
            key={expandedEvent._id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setExpandedId(null)}
          >
            <motion.div
              className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-[90%] md:w-[400px] text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={expandedEvent.imageUrl}
                alt={expandedEvent.title}
                className="h-60 w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-2xl font-bold">{expandedEvent.title}</h3>
              <p className="text-gray-600 mb-2">{expandedEvent.date} • {expandedEvent.time}</p>
              <p className="text-gray-700">{expandedEvent.description}</p>
              <button
                className="absolute top-3 right-4 text-2xl text-gray-600 hover:text-red-500"
                onClick={() => setExpandedId(null)}
              >
                ×
                
              </button>
              

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="text-center mt-8">
  <a
    href="/events"
    className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-md text-lg font-semibold hover:bg-emerald-700 transition"
  >
    View All Events
  </a>
</div>

    </section>
  );
};

export default EventsCarousel;
