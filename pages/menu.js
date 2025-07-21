// pages/menu.js - Enhanced with Section Navigation
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MenuSection from "@/components/MenuSection";
import SEO from "@/components/SEO";
import { generateMenuSchema, generateBreadcrumbSchema } from "@/lib/structuredData";
import { getAllMenuItems } from "@/lib/sanity";

import breakfastImg from "@/public/images/menu-categories/breakfast.jpg";
import lunchImg from "@/public/images/menu-categories/lunch.jpg";
import tidbitsImg from "@/public/images/menu-categories/tidbits.jpg";
import dinnerImg from "@/public/images/menu-categories/dinner.jpg";
import dessertsImg from "@/public/images/menu-categories/dessert.jpg";
import drinksImg from "@/public/images/menu-categories/drinks.jpg";


export default function MenuPage({ menuItems }) {
  const [activeSection, setActiveSection] = useState("");
  const [showJumpButton, setShowJumpButton] = useState(false);
  const [showNavPanel, setShowNavPanel] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState(null);

  const menuSections = [
  { id: "breakfast", title: "Breakfast", icon: "🥞", image: breakfastImg },
  { id: "lunch", title: "Lunch", icon: "🥗", image: lunchImg },
  { id: "tidbits", title: "Tidbits", icon: "🍤", image: tidbitsImg },
  { id: "dinner", title: "Dinner", icon: "🍽️", image: dinnerImg },
  { id: "desserts", title: "Desserts", icon: "🧁", image: dessertsImg },
  { id: "drinks", title: "Drinks", icon: "🥤", image: drinksImg },
];


  // Intersection Observer to track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-20% 0px -20% 0px" }
    );

    menuSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Show/hide jump button based on scroll with timeout
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Show button after scrolling past hero
      if (scrollY > 400) {
        setShowJumpButton(true);
      }
      
      // Hide button and panel after scrolling (with timeout)
      if (Math.abs(scrollY - lastScrollY) > 50) {
        setShowNavPanel(false);
        
        // Clear existing timeout
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        
        // Set new timeout to hide button after 3 seconds of no scrolling
        const timeout = setTimeout(() => {
          setShowJumpButton(false);
        }, 3000);
        
        setScrollTimeout(timeout);
      }
      
      setLastScrollY(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [lastScrollY, scrollTimeout]);

  const toggleNavPanel = () => {
    setShowNavPanel(!showNavPanel);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for fixed navbar
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setShowNavPanel(false); // Close panel after clicking
    }
  };

  const menuSchema = generateMenuSchema(menuItems);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://blueheronsamuels.com/" },
    { name: "Menu", url: "https://blueheronsamuels.com/menu" }
  ]);

  return (
    <>
      <SEO
        title="Menu | Blue Heron Café - Fresh Breakfast, Lunch & Dinner in Samuels, ID"
        description="Browse our menu of fresh, elevated homestyle cuisine. Breakfast served all day, gourmet lunch options, and dinner specials. Farm-to-table ingredients in Samuels, Idaho."
        keywords="Blue Heron menu, breakfast Samuels Idaho, lunch Sandpoint, farm to table restaurant, fresh food menu, country dining Idaho"
        url="/menu"
        jsonLd={[menuSchema, breadcrumbSchema]}
      />

      {/* Hero Section with Quick Navigation */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div className="max-w-6xl px-6 mx-auto text-center">
          <motion.h1 
            className="mb-6 font-serif text-5xl font-bold md:text-6xl text-sky-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Menu
          </motion.h1>
          <motion.p 
            className="max-w-2xl mx-auto mb-12 text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Fresh, elevated homestyle cuisine made with love and local ingredients
          </motion.p>

          {/* Quick Navigation Cards */}
          <motion.div 
            className="grid max-w-4xl grid-cols-2 gap-4 mx-auto md:grid-cols-3 lg:grid-cols-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {menuSections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`group relative bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border-2 hover:border-sky-300 ${
                  activeSection === section.id ? 'border-sky-400 bg-sky-50' : 'border-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
              >
                <div className="mb-2 text-3xl transition-transform duration-200 group-hover:scale-110">
                  {section.icon}
                </div>
                <div className="text-sm font-semibold text-gray-700 group-hover:text-sky-700">
                  {section.title}
                </div>
                {activeSection === section.id && (
                  <motion.div
                    className="absolute inset-0 bg-sky-100 rounded-2xl -z-10"
                    layoutId="activeSection"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Floating Search/Navigation Button */}
      <AnimatePresence>
        {showJumpButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-40 bottom-6 right-6"
          >
            {/* Navigation Panel */}
            <AnimatePresence>
              {showNavPanel && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="absolute right-0 p-3 space-y-2 border shadow-2xl bottom-16 bg-white/95 backdrop-blur-md rounded-2xl border-sky-200 min-w-48"
                >
                  <div className="px-2 py-1 mb-2 text-xs font-semibold text-center border-b text-sky-700 border-sky-100">
                    Jump to Section
                  </div>
                  {menuSections.map((section) => (
                    <motion.button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-sky-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-sky-50 hover:text-sky-700'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg">{section.icon}</span>
                      <span className="flex-1 text-left">{section.title}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Magnifying Glass Button */}
            <motion.button
              onClick={toggleNavPanel}
              className="p-4 text-white transition-all duration-300 border rounded-full shadow-xl bg-sky-500/80 hover:bg-sky-600/90 backdrop-blur-sm border-sky-400/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.id} id={section.id}>
          <MenuSection
            title={section.title}
            imageSrc={section.image}
            items={menuItems.filter((item) => {
              if (section.id === "breakfast") {
                return item.category === "breakfast" || item.category === "sides";
              }
              return item.category === section.id;
            })}
          />
        </div>
      ))}


    </>
  );
}

export async function getStaticProps() {
  const menuItems = await getAllMenuItems();
  return {
    props: { menuItems },
    revalidate: 60,
  };
}