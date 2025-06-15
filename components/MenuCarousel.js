import { useEffect, useState } from "react";
import { getFeaturedMenuItems } from "@/lib/sanity";
import { motion, AnimatePresence } from "framer-motion";

const MenuCarousel = () => {
  const [items, setItems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getFeaturedMenuItems().then(setItems);
  }, []);

  return (
    <section className="bg-white py-12">
      <h2 className="text-3xl font-bold text-center mb-6">Featured Specials</h2>

      <div className="px-4">
        <div className="flex flex-wrap justify-center gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="w-64 bg-emerald-50 rounded-lg shadow-md p-4 text-center cursor-pointer hover:scale-105 transition"
              onClick={() => setExpandedId(item._id)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-40 w-full object-cover rounded"
              />
              <div className="flex flex-col justify-between h-24 mt-3">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                {item.price && (
                  <p className="text-emerald-800 mt-2">{item.price}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <a
          href="/menu"
          className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-md text-lg font-semibold hover:bg-emerald-700 transition"
        >
          View Full Menu
        </a>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {expandedId && (
          <motion.div
            key="modal"
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md h-[85vh] flex flex-col relative overflow-y-auto"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
                onClick={() => setExpandedId(null)}
              >
                ×
              </button>

              {(() => {
                const item = items.find((i) => i._id === expandedId);
                if (!item) return null;

                return (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-72 object-cover rounded-lg mb-6"
                    />
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-emerald-800 font-semibold mb-4">
                      {item.price}
                    </p>
                    <p className="text-gray-700">{item.description}</p>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MenuCarousel;
