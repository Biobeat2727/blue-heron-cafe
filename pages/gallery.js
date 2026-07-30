// pages/gallery.js
import SEO from "@/components/SEO";
import { generateBreadcrumbSchema } from "@/lib/structuredData";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAllGalleryImages } from "@/lib/sanity";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const PARTY_CATEGORY = "customer-appreciation-2026";
const NEW_CATEGORY = "gallery-2026";

const altFor = (img) => img.alt || img.title || "Blue Heron Cafe photo";

function formatCategory(category) {
  if (!category) return "Other";
  return category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* Full-screen album view: sticky header, masonry grid, optional category filters */
function AlbumView({ album, onClose, onImageClick }) {
  const [category, setCategory] = useState("all");
  const scrollRef = useRef(null);
  const backRef = useRef(null);

  // The browser's scroll anchoring can open the overlay pre-scrolled;
  // always start at the top of the album, with focus on the back button.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    backRef.current?.focus();
  }, []);

  const categories = useMemo(() => {
    if (!album.showFilters) return [];
    const unique = [...new Set(album.images.map((img) => img.category))];
    return unique.length > 1 ? unique : [];
  }, [album]);

  const visible =
    category === "all"
      ? album.images
      : album.images.filter((img) => img.category === category);

  return (
    <div
      ref={scrollRef}
      role="dialog"
      aria-modal="true"
      aria-label={album.title}
      className="fixed inset-0 z-40 overflow-y-auto bg-white"
    >
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <button
            ref={backRef}
            onClick={onClose}
            aria-label="Back to all albums"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-cyan-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
              {album.title}
            </h2>
            <p className="text-sm text-gray-500">
              {visible.length} photo{visible.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {categories.length > 0 && (
          <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-6 pb-4">
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
                  category === cat
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat === "all" ? "All" : formatCategory(cat)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {visible.map((img) => (
            <button
              key={img._id}
              onClick={() => onImageClick(visible, visible.indexOf(img))}
              className="group mb-3 block w-full overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 sm:mb-4"
            >
              <img
                src={img.imageUrl}
                alt={altFor(img)}
                loading="lazy"
                style={img.aspectRatio ? { aspectRatio: img.aspectRatio } : undefined}
                className="w-full bg-gray-100 transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Featured collage band for the Customer Appreciation Party */
function PartyCollage({ album, onOpen }) {
  const preview = album.images.slice(0, 5);
  const remaining = album.images.length - preview.length;

  return (
    <section
      aria-label={album.title}
      className="overflow-hidden rounded-3xl bg-sky-950 text-white shadow-xl"
    >
      <div className="flex flex-col gap-2 px-6 pt-8 sm:flex-row sm:items-end sm:justify-between sm:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            Summer 2026 · Samuels, Idaho
          </p>
          <h2 className="mt-2 font-serif text-3xl italic text-amber-300 sm:text-4xl">
            Customer Appreciation Party 2026!
          </h2>
          <p className="mt-2 max-w-xl text-sm text-sky-200">
            Thanks to everyone who came out and celebrated with us. Here&apos;s
            to another great year at the Blue Heron.
          </p>
        </div>
        <button
          onClick={onOpen}
          className="mt-2 shrink-0 self-start rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-sky-950 transition-colors hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:self-auto"
        >
          View all {album.images.length} photos
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4 sm:gap-3 sm:p-6">
        {preview.map((img, i) => {
          const isLast = i === preview.length - 1 && remaining > 0;
          return (
            <button
              key={img._id}
              onClick={onOpen}
              className={`group relative block overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={i === 0 ? img.imageUrl : img.thumbUrl || img.imageUrl}
                alt={altFor(img)}
                loading="lazy"
                className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
                  i === 0 ? "aspect-square sm:aspect-auto" : "aspect-square"
                }`}
              />
              {isLast && (
                <span className="absolute inset-0 flex items-center justify-center bg-sky-950/70 text-lg font-bold text-white">
                  +{remaining} more
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* Card for a regular album: 3-photo strip + title + count */
function AlbumCard({ album, onOpen }) {
  const preview = album.images.slice(0, 3);

  return (
    <button
      onClick={onOpen}
      className="group block w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
    >
      <div className="grid grid-cols-3 gap-1 p-1">
        {preview.map((img) => (
          <img
            key={img._id}
            src={img.thumbUrl || img.imageUrl}
            alt={altFor(img)}
            loading="lazy"
            className="aspect-square w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ))}
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{album.title}</h2>
          <p className="text-sm text-gray-500">
            {album.images.length} photo{album.images.length === 1 ? "" : "s"}
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors group-hover:bg-cyan-600 group-hover:text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </button>
  );
}

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [openAlbumId, setOpenAlbumId] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { slides, index }

  useEffect(() => {
    getAllGalleryImages()
      .then(setImages)
      .finally(() => setLoaded(true));
  }, []);

  const albums = useMemo(() => {
    const party = images.filter((img) => img.category === PARTY_CATEGORY);
    const fresh = images.filter((img) => img.category === NEW_CATEGORY);
    const classics = images.filter(
      (img) =>
        img.category !== PARTY_CATEGORY && img.category !== NEW_CATEGORY
    );
    return [
      {
        id: "party",
        title: "Customer Appreciation Party 2026!",
        images: party,
        showFilters: false,
      },
      {
        id: "new-2026",
        title: "Photos from 2026",
        images: fresh,
        showFilters: false,
      },
      {
        id: "classics",
        title: "Gallery Classics 2025",
        images: classics,
        showFilters: true,
      },
    ].filter((album) => album.images.length > 0);
  }, [images]);

  const openAlbum = albums.find((a) => a.id === openAlbumId) || null;
  const triggerRef = useRef(null);

  const showAlbum = (id) => {
    triggerRef.current = document.activeElement;
    setOpenAlbumId(id);
  };

  const closeAlbum = () => {
    setOpenAlbumId(null);
    if (triggerRef.current?.focus) triggerRef.current.focus();
  };

  // Lock page scroll while an album is open
  useEffect(() => {
    document.body.style.overflow = openAlbumId ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openAlbumId]);

  // Escape closes the top layer only: lightbox first, then the album view
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !lightbox) closeAlbum();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const handleImageClick = (collection, index) => {
    setLightbox({
      slides: collection.map((img) => ({
        src: img.imageUrl,
        alt: altFor(img),
      })),
      index,
    });
  };

  const partyAlbum = albums.find((a) => a.id === "party");
  const cardAlbums = albums.filter((a) => a.id !== "party");

  return (
    <>
      <SEO
        title="Photo Gallery | Blue Heron Café in Samuels, Idaho"
        description="Browse photos of Blue Heron Café's outdoor patio, live music events, fresh food, and our Customer Appreciation Party in Samuels, Idaho near Sandpoint."
        keywords="Blue Heron Café photos, Samuels Idaho cafe gallery, outdoor dining North Idaho, live music venue Sandpoint area, customer appreciation party"
        url="/gallery"
        jsonLd={generateBreadcrumbSchema([
          { name: "Home", url: "https://blueheronsamuels.com" },
          { name: "Gallery", url: "https://blueheronsamuels.com/gallery" },
        ])}
      />
      <section className="bg-white pt-8 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="mb-2 text-center text-4xl font-bold text-cyan-700">
            Photo Gallery
          </h1>
          <p className="mb-10 text-center text-gray-500">
            Life around the café, in photos.
          </p>

          {!loaded && (
            <div
              aria-busy="true"
              aria-label="Loading photos"
              className="animate-pulse motion-reduce:animate-none"
            >
              <div className="mb-10 h-80 rounded-3xl bg-gray-100 sm:h-96" />
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="h-56 rounded-2xl bg-gray-100" />
                <div className="h-56 rounded-2xl bg-gray-100" />
              </div>
            </div>
          )}

          {loaded && images.length === 0 && (
            <p className="py-16 text-center text-gray-500">
              No photos here yet. Check back soon.
            </p>
          )}

          {partyAlbum && (
            <div className="mb-10">
              <PartyCollage
                album={partyAlbum}
                onOpen={() => showAlbum("party")}
              />
            </div>
          )}

          {cardAlbums.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {cardAlbums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onOpen={() => showAlbum(album.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {openAlbum && (
        <AlbumView
          album={openAlbum}
          onClose={closeAlbum}
          onImageClick={handleImageClick}
        />
      )}

      <Lightbox
        open={!!lightbox}
        close={() => setLightbox(null)}
        index={lightbox?.index || 0}
        slides={lightbox?.slides || []}
      />
    </>
  );
}
