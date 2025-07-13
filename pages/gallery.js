// pages/gallery.js
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { getGalleryImages } from "@/lib/sanity";

export default function GalleryPage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const data = await getGalleryImages();
      setImages(data);
    }
    fetchImages();
  }, []);

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-10 text-cyan-700">
            Photo Gallery
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img._id} className="overflow-hidden rounded-lg shadow-md">
                <img
                  src={img.imageUrl}
                  alt={img.caption || "Blue Heron Cafe image"}
                  className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                />
                {img.caption && (
                  <p className="text-sm text-gray-600 text-center mt-2 italic">
                    {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
