import { useEffect, useState } from "react";
import { getFeaturedMenuItems } from "@/lib/sanity";
import { motion, AnimatePresence } from "framer-motion";

const MenuCarousel = () => {
  const [items, setItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getFeaturedMenuItems().then(setItems);
  }, []);

  const expandedItem = items.find((i) => i._id === expandedId);

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">Our Favorites</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => setExpandedId(item._id)}
              className="cursor-pointer bg-blue-100 rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold">{item.title}</h3>
                {item.price && (
                  <p className="text-yellow-700 mt-2 font-medium">{item.price}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <a
            href="/menu"
            className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-md text-lg font-semibold hover:bg-cyan-700 transition"
          >
            View Full Menu
          </a>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {expandedItem && (
          <motion.div
            key="modal"
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                onClick={() => setExpandedId(null)}
              >
                ×
              </button>

              <img
                src={expandedItem.imageUrl}
                alt={expandedItem.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h3 className="text-2xl font-bold mb-1">{expandedItem.title}</h3>
              {expandedItem.price && (
                <p className="text-cyan-700 font-semibold mb-4">
                  {expandedItem.price}
                </p>
              )}
              <p className="text-gray-700 whitespace-pre-line">
                {expandedItem.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MenuCarousel;
