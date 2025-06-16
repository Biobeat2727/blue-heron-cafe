// components/MenuSection.js
import { motion } from "framer-motion";

export default function MenuSection({ title, imageSrc, items }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <motion.img
        src={imageSrc}
        alt={title}
        initial={{ scale: 1.1, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay content box */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 bg-white/80 backdrop-blur-md rounded-xl p-10 max-w-3xl mx-4 shadow-2xl border border-white/40"
      >
        <motion.h2
          className="text-5xl font-extrabold text-emerald-900 mb-8 text-center tracking-tight font-serif"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>

        <motion.ul
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {items.map((item) => (
            <motion.li
              key={item._id}
              className="border-b border-emerald-200 pb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                <span>{item.title}</span>
                {item.price && <span className="text-emerald-700">{item.price}</span>}
              </div>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1 italic">{item.description}</p>
              )}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
