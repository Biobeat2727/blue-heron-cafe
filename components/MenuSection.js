// components/MenuSection.js
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function MenuSection({ title, imageSrc, items }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.4, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  const hasSubcategories = Array.isArray(items) && items.some((item) => item?.subcategory);
  const grouped = hasSubcategories ? groupBy(items, "subcategory") : null;

  // Optional taglines based on subcategory (normalized keys)
  const subcategoryNotes = {
    "salads / wraps / soups": "Choice of dressing: Blue Cheese, Ranch, 1000 Island, Balsamic, Italian, Caesar.",
    "burgers & sandwiches": "Comes with fries. +$2 for sweet potato fries or onion rings.",
  };

  // Optional notes based on full section
  const sectionNotes = {
    Dinner: "Starts @4pm. All *Entrees come with your choice of soup or salad, mashed potatoes or smashed baby yellows, and fresh steamed vegetables.",
  };

  return (
    <section ref={ref} className="relative w-full py-24 bg-white">
      {/* Top Banner Image */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <motion.img
          src={imageSrc}
          alt={title}
          style={{ scale, opacity }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h2 className="text-5xl font-extrabold text-white tracking-tight font-serif text-center drop-shadow-md">
            {title}
          </h2>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-3xl mx-auto px-6 mt-12">
        {sectionNotes[title] && (
          <motion.p
            className="text-center text-sm text-gray-600 italic mb-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {sectionNotes[title]}
          </motion.p>
        )}

        {Array.isArray(items) && items.length > 0 ? (
          grouped
            ? Object.entries(grouped)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([sub, groupItems]) => {
                  const normalizedSub = sub.trim().toLowerCase();
                  return (
                    <div key={sub || "ungrouped"} className="mb-12">
                      {sub.trim() !== "" && (
                        <>
                          <motion.h3
                            className="text-2xl font-semibold text-cyan-800 mb-2 text-center"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            viewport={{ once: true, amount: 0.3 }}
                          >
                            {sub}
                          </motion.h3>
                          {subcategoryNotes[normalizedSub] && (
                            <motion.p
                              className="text-sm text-gray-500 italic text-center mb-4"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4 }}
                              viewport={{ once: true, amount: 0.3 }}
                            >
                              {subcategoryNotes[normalizedSub]}
                            </motion.p>
                          )}
                        </>
                      )}
                      <AnimatedMenuList items={groupItems} />
                    </div>
                  );
                })
            : <AnimatedMenuList items={items} />
        ) : (
          <p className="text-center text-gray-600 italic">No items found in this section.</p>
        )}
      </div>
    </section>
  );
}

function AnimatedMenuList({ items }) {
  if (!Array.isArray(items)) return null;

  return (
    <ul className="space-y-8">
      {items.map((item, index) => (
        <motion.li
          key={item._id}
          className="border-b border-cyan-200 pb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.04 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
            <span>{item.title}</span>
            {item.price && <span className="text-cyan-700">{item.price}</span>}
          </div>
          {item.description && (
            <p className="text-sm text-gray-600 mt-1 italic">{item.description}</p>
          )}
        </motion.li>
      ))}
    </ul>
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