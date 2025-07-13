// components/MenuSection.js - Smooth UX Version
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import FastImage from "./FastImage";
import OptimizedImage from "./OptimizedImage";

export default function MenuSection({ title, imageSrc, items }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.4, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  const hasSubcategories = Array.isArray(items) && items.some((item) => item?.subcategory);
  const grouped = hasSubcategories ? groupBy(items, "subcategory") : null;

  const subcategoryNotes = {
    "salads / wraps / soups": "Choice of dressing: Blue Cheese, Ranch, 1000 Island, Balsamic, Italian, Caesar.",
    "burgers & sandwiches": "Comes with fries. +$2 for sweet potato fries or onion rings.",
  };

  const sectionNotes = {
    Dinner: "Starts @4pm. All *Entrees come with your choice of soup or salad, mashed potatoes or smashed baby yellows, and fresh steamed vegetables.",
  };

  // Container variants for staggered children animation (happens once on mount)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.08, // Fast stagger - 0.08s between items
        delayChildren: 0.2, // Small delay before starting
      }
    }
  };

  return (
    <section ref={ref} className="relative w-full py-24 bg-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <motion.div style={{ scale, opacity }} className="w-full h-full">
          <FastImage
            src={imageSrc}
            alt={`${title} menu section`}
            className="w-full h-full"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-serif text-center drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {title}
          </motion.h2>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-6 mt-16">
        {sectionNotes[title] && (
          <motion.p
            className="text-center text-base text-gray-600 italic mb-12 bg-cyan-50 p-4 rounded-lg border-l-4 border-cyan-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {sectionNotes[title]}
          </motion.p>
        )}

        {Array.isArray(items) && items.length > 0 ? (
          grouped
            ? Object.entries(grouped)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([sub, groupItems], groupIndex) => {
                  const normalizedSub = sub.trim().toLowerCase();
                  return (
                    <motion.div 
                      key={sub || "ungrouped"} 
                      className="mb-16"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 0.5 + (groupIndex * 0.1) // Stagger subcategories slightly
                      }}
                    >
                      {sub.trim() !== "" && (
                        <>
                          <h3 className="text-3xl font-bold text-cyan-800 mb-3 text-center font-serif">
                            {sub}
                          </h3>
                          {subcategoryNotes[normalizedSub] && (
                            <p className="text-sm text-gray-500 italic text-center mb-8 bg-gray-50 p-3 rounded-md">
                              {subcategoryNotes[normalizedSub]}
                            </p>
                          )}
                        </>
                      )}
                      <SmoothMenuList items={groupItems} startDelay={0.7 + (groupIndex * 0.2)} />
                    </motion.div>
                  );
                })
            : <SmoothMenuList items={items} startDelay={0.5} />
        ) : (
          <motion.p 
            className="text-center text-gray-600 italic text-lg py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            No items found in this section.
          </motion.p>
        )}
      </div>
    </section>
  );
}

function SmoothMenuList({ items, startDelay = 0 }) {
  if (!Array.isArray(items)) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.06, // Very fast stagger
        delayChildren: startDelay,
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 12 // Smaller movement - less jarring
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3, // Faster individual animations
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="grid gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible" // Animate immediately on mount, not on scroll
    >
      {items.map((item, index) => (
        <motion.div
          key={item._id}
          variants={itemVariants}
          className="group bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-cyan-200 hover:-translate-y-1"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-700 transition-colors">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
            {item.price && (
              <div className="ml-6 flex-shrink-0">
                <span className="text-xl font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
                  {item.price}
                </span>
              </div>
            )}
          </div>
          
          {item.imageUrl && (
            <div className="mt-4 h-32 w-full rounded-lg overflow-hidden">
              <OptimizedImage
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={75}
              />
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key] || "";
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {});
}