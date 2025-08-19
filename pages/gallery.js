// pages/gallery.js
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { getAllGalleryImages, getGalleryCategories } from "@/lib/sanity";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const [imagesData, categoriesData] = await Promise.all([
        getAllGalleryImages(),
        getGalleryCategories()
      ]);
      
      setImages(imagesData);
      setFilteredImages(imagesData);
      setCategories([
        { value: 'all', label: 'All Photos' },
        ...categoriesData
      ]);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory, images]);

  const handleImageClick = (idx) => {
    setIndex(idx);
    setOpen(true);
  };

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-8 text-cyan-700">
            Photo Gallery
          </h1>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredImages.map((img, idx) => (
              <div key={img._id} className="overflow-hidden rounded-lg shadow-md">
                <img
                  src={img.imageUrl}
                  alt={img.caption || "Blue Heron Cafe image"}
                  className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                  onClick={() => handleImageClick(idx)}
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
      
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={filteredImages.map((img) => ({
          src: img.imageUrl,
          alt: img.caption || "Blue Heron Cafe image",
        }))}
      />
    </>
  );
}
