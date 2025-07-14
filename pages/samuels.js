// pages/samuels.js
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SamuelsPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full h-[60vh] overflow-hidden">
        <motion.img
          src="/images/samuels/hero.jpg"
          alt="Samuels Store"
          style={{ scale, opacity }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-5xl font-extrabold drop-shadow-md text-center font-serif">
            Samuels Store
          </h1>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/samuels/about1.JPG"
            alt="Inside Samuels Store"
            width={600}
            height={400}
            className="rounded-xl shadow-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold mb-4 text-cyan-800 font-serif">More Than a Store</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Tucked beside the Blue Heron Café, the Samuels Store offers a charming blend of local
            convenience and country character. Whether you're fueling up at the pumps, or picking up some snacks for the road, Samuels serves as a community
            hub for locals and travelers alike. Owned and operated alongside the Blue Heron,
            everything here reflects a commitment to small-town warmth and honest essentials.
          </p>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-4xl font-bold text-center mb-12 text-cyan-900 font-serif"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            A Glimpse Inside
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {["about1.jpg", "interior-1.jpg", "interior-2.jpg", "shelves.jpg", "local-products.jpg", "register.jpg", "sign.JPG"].map(
              (img, idx) => (
                <motion.div
                  key={img}
                  className="overflow-hidden rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={`/images/samuels/${img}`}
                    alt={img.replace(".jpg", "")}
                    width={500}
                    height={400}
                    className="object-cover w-full h-64"
                  />
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
