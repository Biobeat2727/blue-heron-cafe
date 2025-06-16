import Link from "next/link";
import { motion } from "framer-motion"; // Import motion for animations

const HeroSection = () => {
  // Variants for the overall section fade-in
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: "easeInOut" } },
  };

  return (
    <motion.section
      className="relative w-full h-screen"
      variants={sectionVariants} // Apply variants to the section
      initial="hidden" // Start from the hidden state
      animate="visible" // Animate to the visible state
    >
      {/* Background Image */}
      <img
        src="/images/blue-heron-hero.jpg"
        alt="Scenic view of Sandpoint, Idaho, possibly near Lake Pend Oreille, with a serene atmosphere suitable for a cafe."
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
        {/* Animated Headline */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-white"
          initial={{ opacity: 0, y: 20 }} // Start slightly below and invisible
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeInOut" } }} // Fade in and slide up
        >
          Blue Heron Café
        </motion.h1>

        {/* Animated Tagline */}
        <motion.p
          className="text-xl md:text-2xl mb-6 text-emerald-100"
          initial={{ opacity: 0, y: 20 }} // Start slightly below and invisible
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5, ease: "easeInOut" } }} // Fade in and slide up (with a slight delay after headline)
        >
          Fresh eats. Cozy vibes. Local love.
        </motion.p>

        {/* Animated Call to Action Button */}
        <motion.div // Using motion.div to wrap Link as Link itself isn't a motion component
          initial={{ opacity: 0, scale: 0.8 }} // Start smaller and invisible
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.7, ease: "easeOut" } }} // Fade in and scale up (with a slight delay after tagline)
        >
          <Link
            href="/menu"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-md text-lg font-semibold hover:bg-emerald-700 transition"
          >
            View Menu
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;