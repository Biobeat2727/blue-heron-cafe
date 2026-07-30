import { useEffect, useState } from "react";
import Link from "next/link";
import { getGalleryImages } from "@/lib/sanity";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const altFor = (img) =>
  img.alt ||
  img.title ||
  "Blue Heron Café dining, events, and outdoor patio in Samuels, Idaho";

const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getGalleryImages()
      .then(setImages)
      .finally(() => setLoaded(true));
  }, []);

  const handleImageClick = (idx) => {
    setIndex(idx);
    setOpen(true);
  };

  const mosaic = images.slice(0, 6);

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl bg-sky-950 text-white shadow-xl md:grid md:grid-cols-[1fr_1.5fr]">
          {/* Text panel */}
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
              From the café
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold md:text-5xl">
              Gallery
            </h2>
            <p className="mt-4 max-w-md text-sky-200">
              Fresh photos from the Customer Appreciation Party are up now. Tap
              a photo for a closer look.
            </p>
            <Link
              href="/gallery"
              className="mt-6 inline-block self-start rounded-full bg-amber-400 px-6 py-3 font-semibold text-sky-950 transition-colors hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              See the full gallery
            </Link>
          </div>

          {/* Photo mosaic */}
          <div className="p-4 sm:p-6 md:pl-0">
            {!loaded && (
              <div
                aria-busy="true"
                aria-label="Loading photos"
                className="grid animate-pulse grid-cols-3 gap-2 motion-reduce:animate-none"
              >
                <div className="col-span-2 row-span-2 aspect-square rounded-xl bg-sky-900 sm:aspect-auto" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-sky-900" />
                ))}
              </div>
            )}

            {loaded && mosaic.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {mosaic.map((img, i) => (
                  <button
                    key={img._id}
                    onClick={() => handleImageClick(i)}
                    aria-label={`View photo: ${altFor(img)}`}
                    className={`group block overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                      i === 0 ? "col-span-2 row-span-2" : ""
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={altFor(img)}
                      loading="lazy"
                      className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
                        i === 0 ? "aspect-square sm:aspect-auto" : "aspect-square"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({
          src: img.imageUrl,
          alt: altFor(img),
        }))}
      />
    </section>
  );
};

export default GallerySection;
