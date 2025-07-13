import { useEffect, useState } from "react";
import { getGalleryImages } from "@/lib/sanity";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getGalleryImages().then(setImages);
  }, []);

  const handleImageClick = (idx) => {
    setIndex(idx);
    setOpen(true);
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <section className="bg-white py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">Gallery</h2>

      <div className="max-w-6xl mx-auto">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4"
          columnClassName="flex flex-col gap-4"
        >
          {images.map((img, idx) => (
            <img
              key={img._id}
              src={img.imageUrl}
              alt={img.caption || "Gallery image"}
              className="rounded-lg cursor-pointer hover:opacity-80 transition"
              onClick={() => handleImageClick(idx)}
            />
          ))}
        </Masonry>
      </div>

      <div className="text-center mt-10">
        <a
          href="/gallery"
          className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-md text-lg font-semibold hover:bg-cyan-700 transition"
        >
          View Full Gallery
        </a>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({
          src: img.imageUrl,
          alt: img.caption || "Gallery image",
        }))}
      />
    </section>
  );
};

export default GallerySection;
