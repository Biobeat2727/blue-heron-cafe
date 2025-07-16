import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const controls = useAnimation();
  const [lastY, setLastY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      
      setScrollY(currentY); // Track scroll position for logo scaling

      if (Math.abs(delta) > 25) {
        if (delta > 0 && currentY > 100) {
          // Scrolling down
          controls.start({ 
            y: -100, 
            opacity: 0,
            transition: { duration: 0.2, ease: "easeOut" }
          });
        } else {
          // Scrolling up
          if (scrollTimeout) clearTimeout(scrollTimeout);
          const timeout = setTimeout(() => {
            controls.start({ 
              y: 0, 
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" }
            });
          }, 50);
          setScrollTimeout(timeout);
        }
        setLastY(currentY);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [lastY, controls, scrollTimeout]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // Determine if logo should be compact
  const isCompact = scrollY > 50;

  return (
    <motion.nav
      animate={controls}
      initial={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-gradient-to-r from-sky-900/90 via-blue-800/90 to-cyan-800/90 backdrop-blur-md fixed top-0 w-full z-50 shadow-xl border-b border-sky-400/30 h-20"
    >
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between relative">

        {/* Left Links - Desktop Only */}
        <div className="hidden md:flex gap-6 text-white text-lg font-medium absolute left-6">
          <Link href="/menu" className="relative group hover:text-sky-200 transition-all duration-300">
            <span className="relative z-10">Menu</span>
            <div className="absolute inset-0 bg-sky-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-300 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link href="/events" className="relative group hover:text-sky-200 transition-all duration-300">
            <span className="relative z-10">Events</span>
            <div className="absolute inset-0 bg-sky-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-300 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link href="/gallery" className="relative group hover:text-sky-200 transition-all duration-300">
            <span className="relative z-10">Gallery</span>
            <div className="absolute inset-0 bg-sky-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-300 group-hover:w-full transition-all duration-300"></div>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white p-2 rounded-lg bg-sky-500/25 hover:bg-sky-500/40 border border-sky-400/40 transition-all duration-200 backdrop-blur-sm"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl"
            >
              {isMenuOpen ? "✕" : "☰"}
            </motion.div>
          </button>
        </div>

        {/* Centered Logo with Scaling and Hover Effects */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-50">
          <Link href="/" className="pointer-events-auto block group">
            <motion.div
              className="relative"
              animate={{ 
                scale: isCompact ? 0.95 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-sky-300/40 via-blue-300/40 to-cyan-300/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <motion.img
                src="/images/blue-heron-vertical-logo.png"
                alt="Blue Heron Logo"
                className="relative z-10 w-auto drop-shadow-2xl h-28 filter group-hover:brightness-110 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </motion.div>
          </Link>
        </div>

        {/* Right Links - Desktop Only */}
        <div className="hidden md:flex gap-6 text-white text-lg font-medium absolute right-6">
          <Link href="/about" className="relative group hover:text-sky-200 transition-all duration-300">
            <span className="relative z-10">About</span>
            <div className="absolute inset-0 bg-sky-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-300 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link href="/contact" className="relative group hover:text-sky-200 transition-all duration-300">
            <span className="relative z-10">Contact</span>
            <div className="absolute inset-0 bg-sky-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-300 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link href="/samuels" className="relative group hover:text-sky-200 transition-all duration-300">
            <span className="relative z-10">Samuels Store</span>
            <div className="absolute inset-0 bg-sky-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-300 group-hover:w-full transition-all duration-300"></div>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden bg-gradient-to-r from-sky-900/98 via-blue-800/98 to-cyan-800/98 backdrop-blur-lg border-t border-sky-400/40 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-6 space-y-2">
              {[
                { label: "Home", href: "/", icon: "🏠" },
                { label: "Menu", href: "/menu", icon: "📋" },
                { label: "Events", href: "/events", icon: "🎵" },
                { label: "Gallery", href: "/gallery", icon: "📸" },
                { label: "About", href: "/about", icon: "ℹ️" },
                { label: "Contact", href: "/contact", icon: "📞" },
                { label: "Samuels Store", href: "/samuels", icon: "🏪" }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={toggleMenu}
                    className="flex items-center gap-3 text-white text-lg font-semibold hover:text-sky-200 hover:bg-gradient-to-r hover:from-sky-400/25 hover:to-cyan-400/25 px-4 py-4 rounded-xl transition-all duration-300 border border-transparent hover:border-sky-400/40 backdrop-blur-sm group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              ))}
              
              {/* Decorative bottom border */}
              <div className="mt-4 pt-4 border-t border-sky-400/30">
                <div className="flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;