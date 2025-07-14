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

        {/* Left Links - Back to Original Position */}
        <div className="hidden md:flex gap-4 text-white text-lg font-medium absolute left-6">
          <Link href="/menu" className="hover:text-cyan-200 transition-colors">Menu</Link>
          <Link href="/events" className="hover:text-cyan-200 transition-colors">Events</Link>
          <Link href="/gallery" className="hover:text-cyan-200 transition-colors">Gallery</Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white text-3xl focus:outline-none"
            aria-label="Toggle menu"
          >
            &#9776;
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

        {/* Right Links - Back to Original Position */}
        <div className="hidden md:flex gap-4 text-white text-lg font-medium absolute right-6">
          <Link href="/about" className="hover:text-cyan-200 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-cyan-200 transition-colors">Contact</Link>
          <Link href="/samuels" className="hover:text-cyan-200 transition-colors">Samuels Store</Link>
        </div>
      </div>

      {/* Mobile Drawer - Keep Original */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden fixed top-0 right-0 h-full w-56 bg-black/90 backdrop-blur-md shadow-2xl z-50 rounded-l-xl p-6 flex flex-col gap-6"
          >
            <button
              onClick={toggleMenu}
              className="text-white hover:text-red-400 text-2xl self-end"
              aria-label="Close menu"
            >
              ✕
            </button>
            {["Home", "Menu", "Events", "Gallery", "About", "Contact"].map((label) => (
              <Link
                key={label}
                href={label === "Home" ? "/" : `/${label.toLowerCase()}`}
                onClick={toggleMenu}
                className="text-white text-lg font-semibold hover:text-cyan-300 w-full text-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;