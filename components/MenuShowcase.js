// components/MenuShowcase.js - Professional replacement for MenuCarousel
import { useEffect, useState } from "react";
import { getFeaturedMenuItems } from "@/lib/sanity";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const MenuShowcase = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    getFeaturedMenuItems().then(setItems);
  }, []);

  // Group items by category
  const categories = [
    { id: "all", name: "All Favorites", icon: "⭐" },
    { id: "breakfast", name: "Breakfast", icon: "🥞" },
    { id: "lunch", name: "Lunch", icon: "🥗" },
    { id: "dinner", name: "Dinner", icon: "🍽️" },
    { id: "desserts", name: "Desserts", icon: "🧁" }
  ];

  const filteredItems = activeCategory === "all" 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-cyan-25 to-slate-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-600 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-cyan-700 font-serif" style={{ lineHeight: '1.2', paddingBottom: '8px' }}>
            Signature Favorites
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the dishes that make Blue Heron Café special. Fresh, elevated comfort food that brings people together.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`group relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-cyan-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 shadow-md hover:shadow-lg hover:scale-105"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{category.icon}</span>
                {category.name}
              </span>
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-cyan-600 rounded-full -z-10"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Menu Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                onClick={() => setSelectedItem(item)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Price Badge */}
                  {item.price && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-cyan-700 font-bold px-3 py-1 rounded-full shadow-lg">
                      {item.price}
                    </div>
                  )}
                  
                  {/* View Details Button */}
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-full bg-white/95 backdrop-blur-sm text-cyan-700 font-semibold py-2 px-4 rounded-lg hover:bg-white transition-colors">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-700 transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            href="/menu"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-xl text-lg font-semibold hover:from-cyan-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Explore Full Menu</span>
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Modal for Item Details */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Image */}
              <div className="relative h-80">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 hover:text-red-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all shadow-lg"
                  onClick={() => setSelectedItem(null)}
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-3xl font-bold text-gray-900">{selectedItem.title}</h3>
                  {selectedItem.price && (
                    <span className="text-2xl font-bold text-cyan-700 bg-cyan-50 px-4 py-2 rounded-full">
                      {selectedItem.price}
                    </span>
                  )}
                </div>
                
                {selectedItem.description && (
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {selectedItem.description}
                  </p>
                )}

                <div className="flex gap-4">
                  <Link
                    href="/menu"
                    className="flex-1 bg-cyan-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
                    onClick={() => setSelectedItem(null)}
                  >
                    View Full Menu
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MenuShowcase;