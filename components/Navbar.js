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
      className="bg-gradient-to-b from-black to-cyan-700 fixed top-0 w-full z-50 shadow-md h-20"
    >
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between relative">

        {/* Left Links - Desktop Only */}
        <div className="hidden md:flex gap-4 text-white text-lg font-medium absolute left-6">
          <Link href="/menu" className="hover:text-cyan-200 transition-colors">Menu</Link>
          <Link href="/events" className="hover:text-cyan-200 transition-colors">Events</Link>
          <Link href="/gallery" className="hover:text-cyan-200 transition-colors">Gallery</Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white text-3xl focus:outline-none transition-transform duration-200"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
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
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <motion.img
                src="/images/blue-heron-vertical-logo.png"
                alt="Blue Heron Logo"
                className="relative z-10 w-auto drop-shadow-lg h-28"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </Link>
        </div>

        {/* Right Links - Desktop Only */}
        <div className="hidden md:flex gap-4 text-white text-lg font-medium absolute right-6">
          <Link href="/about" className="hover:text-cyan-200 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-cyan-200 transition-colors">Contact</Link>
          <Link href="/samuels" className="hover:text-cyan-200 transition-colors">Samuels Store</Link>
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
            className="md:hidden bg-black/95 backdrop-blur-md border-t border-cyan-600/30 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Menu", href: "/menu" },
                { label: "Events", href: "/events" },
                { label: "Gallery", href: "/gallery" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Samuels Store", href: "/samuels" }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={toggleMenu}
                    className="block text-white text-lg font-semibold hover:text-cyan-300 hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;