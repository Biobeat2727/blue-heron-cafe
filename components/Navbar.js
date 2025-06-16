import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const controls = useAnimation();
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Animate the navbar up and disappear when scrolling down (after a small threshold)
      // Animate it back down and appear when scrolling up or at the top
      if (currentY > lastY && currentY > 50) { // Scrolling down and past initial threshold
        controls.start({ y: -100, opacity: 0 });
      } else { // Scrolling up or near the top
        controls.start({ y: 0, opacity: 1 });
      }
      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY, controls]); // Dependencies for useEffect

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        animate={controls}
        initial={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-gradient-to-b from-black to-blue-400 fixed top-0 w-full z-50 shadow-md h-20 overflow-visible"
        // 'h-20' for the short navbar
        // 'fixed top-0 w-full z-50' to keep it at the top and on top of other content
        // 'overflow-visible' is crucial to allow the logo to extend beyond the navbar's height
      >
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between relative">
          {/* Left Links - Hidden on mobile, visible on medium screens and up */}
          <div className="hidden md:flex gap-4 text-white text-lg font-medium">
            <Link href="/menu">Menu</Link>
            <Link href="/events">Events</Link>
          </div>

          {/* Mobile Hamburger Menu Icon - Visible only on mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white text-3xl focus:outline-none"
              aria-label="Toggle menu"
            >
              &#9776; {/* Hamburger icon (Unicode character) */}
            </button>
          </div>

          {/* Logo - Centered, Tall, Overlapping, No Top Overflow */}
          <div
            className="absolute left-1/2 top-0 transform -translate-x-1/2 z-50"
            // 'absolute' positions it relative to the parent 'div' with 'relative'
            // 'left-1/2 transform -translate-x-1/2' horizontally centers the logo
            // 'top-0' aligns the logo's top edge with the navbar's top edge.
            //        Since the logo is h-40 and navbar is h-20, this means the logo
            //        will extend 20px below the navbar, achieving the 'hanging down' effect.
            //        It also ensures the logo does not overflow *above* the screen.
            // 'z-50' ensures the logo is always on top of other content
          >
            <Link href="/" className="pointer-events-auto block">
              <img
                src="/images/blue-heron-vertical-logo.png" // IMPORTANT: Replace with your actual logo path
                alt="Blue Heron Logo"
                className="h-40 w-auto" // h-40 as requested for the tall logo
              />
            </Link>
          </div>

          {/* Right Links - Hidden on mobile, visible on medium screens and up */}
          <div className="hidden md:flex gap-4 text-white text-lg font-medium">
            <Link href="/gallery">Gallery</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer (Sidebar Menu) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }} // Starts off-screen to the right
            animate={{ x: 0 }} // Slides into view
            exit={{ x: "100%" }} // Slides out to the right when closing
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden fixed top-0 right-0 h-full w-56 bg-black/90 backdrop-blur-md shadow-2xl z-50 rounded-l-xl p-6 flex flex-col gap-6"
          >
            <button
              onClick={toggleMenu}
              className="text-white hover:text-red-400 text-2xl self-end"
              aria-label="Close menu"
            >
              ✕ {/* Close icon */}
            </button>
            {/* Map over your navigation links for the mobile menu */}
            {["Home", "Menu", "Events", "Gallery", "About", "Contact"].map((label) => (
              <Link
                key={label}
                href={label === "Home" ? "/" : `/${label.toLowerCase()}`}
                onClick={toggleMenu} // Close menu when a link is clicked
                className="text-white text-lg font-semibold hover:text-emerald-300 w-full text-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;