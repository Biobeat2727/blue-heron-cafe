import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const controls = useAnimation();
  const [lastY, setLastY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (Math.abs(delta) > 25) {
        if (delta > 0 && currentY > 100) {
          controls.start({ y: -100, opacity: 0 });
        } else {
          if (scrollTimeout) clearTimeout(scrollTimeout);
          const timeout = setTimeout(() => {
            controls.start({ y: 0, opacity: 1 });
          }, 100);
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

  return (
    <motion.nav
      animate={controls}
      initial={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-gradient-to-b from-black to-cyan-700 fixed top-0 w-full z-50 shadow-md h-20 overflow-visible"
    >
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between relative">

        {/* Left Links */}
        <div className="hidden md:flex gap-4 text-white text-lg font-medium absolute left-1/4 -translate-x-1/2">

          <Link href="/menu">Menu</Link>
          <Link href="/events">Events</Link>
          <Link href="/gallery">Gallery</Link>
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

        {/* Centered Logo */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-50">
          <Link href="/" className="pointer-events-auto block">
            <img
              src="/images/blue-heron-vertical-logo.png"
              alt="Blue Heron Logo"
              className="h-28 w-auto"
            />
          </Link>
        </div>

        {/* Right Links */}
        <div className="hidden md:flex gap-4 text-white text-lg font-medium absolute right-1/4 translate-x-1/2">

          
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/samuels">Samuels Store</Link>
        </div>
      </div>

      {/* Mobile Drawer */}
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
