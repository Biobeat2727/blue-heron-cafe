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

      if (currentY > lastY && currentY > 50) {
        controls.start({ y: -100, opacity: 0 });
      } else {
        controls.start({ y: 0, opacity: 1 });
      }

      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY, controls]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <motion.nav
        animate={controls}
        initial={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-black fixed top-0 w-full z-50 shadow-md"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-36 px-6">
          {/* Left Links */}
          <div className="hidden md:flex gap-6 text-white text-lg font-medium">
            <Link href="/menu">Menu</Link>
            <Link href="/events">Events</Link>
          </div>

          {/* Center Logo */}
          <div className="flex-shrink-0 flex justify-center items-center">
            <Link href="/">
              <img
                src="/images/blue-heron-vertical-logo.png"
                alt="Blue Heron Logo"
                className="h-32 w-auto drop-shadow-xl hidden md:block"
              />
            </Link>
          </div>

          {/* Right Links */}
          <div className="hidden md:flex gap-6 text-white text-lg font-medium">
            <Link href="/gallery">Gallery</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>

          {/* Mobile Logo */}
          <Link href="/" className="md:hidden flex items-center">
            <img
              src="/images/blue-heron-logo.png"
              alt="Blue Heron Café logo"
              className="max-h-16 w-auto object-contain"
            />
          </Link>

          {/* Mobile Hamburger */}
          {!isMenuOpen && (
            <div className="md:hidden ml-auto">
              <button onClick={toggleMenu} className="text-white">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </motion.nav>

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
            {["Home", "Menu", "Events", "Gallery", "About", "Contact"].map(
              (label) => (
                <Link
                  key={label}
                  href={label === "Home" ? "/" : `/${label.toLowerCase()}`}
                  onClick={toggleMenu}
                  className="text-white text-lg font-semibold hover:text-emerald-300 w-full text-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                  {label}
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
