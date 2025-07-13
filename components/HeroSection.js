// components/HeroSection.js - Enhanced Version
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 1.2, 
        ease: "easeOut",
        staggerChildren: 0.2
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.section
      ref={ref}
      className="relative w-full h-screen overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y, opacity }}
      >
        <img
          src="/images/blue-heron-hero2.jpg"
          alt="Scenic view of Sandpoint, Idaho near Lake Pend Oreille"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div variants={itemVariants} className="max-w-4xl">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-white font-serif"
            variants={itemVariants}
          >
            Blue Heron Café
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl lg:text-3xl mb-8 text-cyan-100 font-light leading-relaxed"
            variants={itemVariants}
          >
            Fresh eats. Cozy vibes. Local love.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/menu"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-cyan-600 text-white rounded-lg text-lg font-semibold hover:bg-cyan-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10">View Menu</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-cyan-800 transition-all duration-300 transform hover:scale-105"
            >
              Upcoming Events
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <div className="flex flex-col items-center text-white/80">
            <span className="text-sm mb-2 tracking-wider">SCROLL</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-8 bg-white/60"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;