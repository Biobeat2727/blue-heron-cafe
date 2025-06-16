import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Animation variants for the logo
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2, // Duration of the main logo animation
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 1.2, // Slight zoom out on exit
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  };

  useEffect(() => {
    // Simulate content loading or simply set a timeout for the animation
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide the splash screen
      onComplete(); // Callback to parent to signal completion
    }, 3000); // Adjust this duration to match your animation time + a slight pause

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black flex items-center justify-center z-[9999]" // High z-index to cover everything
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.3 } }} // Fade out the entire screen after logo exit
        >
          <motion.img
            src="/images/blue-heron-vertical-logo.png" // Your vertical logo path
            alt="Blue Heron Restaurant Logo"
            className="max-h-[80vh] w-auto" // Adjust size as needed, using vh for vertical height
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;