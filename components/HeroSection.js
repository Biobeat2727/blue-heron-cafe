// components/HeroSection.js - Enhanced Version
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const HOURS = [
  { day: "Sun", range: "6am – 2pm" },
  { day: "Mon", range: "6am – 2pm" },
  { day: "Tue", range: "6am – 7:30pm" },
  { day: "Wed", range: "6am – 7:30pm" },
  { day: "Thu", range: "6am – 7:30pm" },
  { day: "Fri", range: "6am – 8:30pm" },
  { day: "Sat", range: "6am – 8:30pm" },
];

const TODAY_SHORT = new Date().toLocaleDateString("en-US", { weekday: "short" });

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
          src="/images/blue-heron-hero2.webp"
          alt="Blue Heron Café outdoor patio and live music stage in Samuels, Idaho near Sandpoint"
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

          {/* Hours */}
          <motion.div
            variants={itemVariants}
            className="mt-8 inline-block backdrop-blur-sm bg-black/40 rounded-2xl px-5 py-4 w-full max-w-xs sm:max-w-none sm:w-auto"
          >
            <p className="text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3">Hours of Operation</p>

            {/* Mobile: 1-col list */}
            <div className="flex flex-col gap-1 sm:hidden">
              {HOURS.map(({ day, range }) => {
                const isToday = day === TODAY_SHORT;
                return (
                  <div key={day} className={`flex items-center justify-center gap-2 rounded-lg px-2 py-1.5 ${isToday ? "bg-cyan-500" : ""}`}>
                    <span className={`text-sm font-bold ${isToday ? "text-white" : "text-cyan-300"}`}>
                      {day}
                    </span>
                    <span className="text-white/50 text-xs">–</span>
                    <span className="text-sm text-white">{range}</span>
                    {isToday && <span className="text-white/70 text-xs">★</span>}
                  </div>
                );
              })}
            </div>

            {/* Desktop: 7-col grid */}
            <div className="hidden sm:grid grid-cols-7 gap-1.5">
              {HOURS.map(({ day, range }) => {
                const isToday = day === TODAY_SHORT;
                return (
                  <div
                    key={day}
                    className={`flex flex-col items-center rounded-lg px-2 py-2 ${
                      isToday ? "bg-cyan-500 text-white" : "text-white/80"
                    }`}
                  >
                    <span className={`text-xs font-bold mb-1 ${isToday ? "text-white" : "text-cyan-300"}`}>{day}</span>
                    <span className="text-xs leading-tight text-center whitespace-nowrap">{range}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default HeroSection;