// pages/about.js
import SEO from "@/components/SEO";
import { generateBreadcrumbSchema } from "@/lib/structuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://blueheronsamuels.com/" },
    { name: "About", url: "https://blueheronsamuels.com/about" }
  ]);

  return (
    <>
      <SEO
        title="About Us | Blue Heron Café - Hidden Gem in Samuels, Idaho"
        description="Discover the story behind Blue Heron Café, a hidden gem tucked behind Samuels Store. Fresh, elevated homestyle eats in a nature-inspired setting near Sandpoint, Idaho."
        keywords="Blue Heron story, Samuels Idaho restaurant, hidden gem café, nature inspired dining, behind Samuels Store, Sandpoint area restaurant"
        url="/about"
        jsonLd={breadcrumbSchema}
      />
      
      <Navbar />

      {/* Hero Video Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/heron-logo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 flex items-center justify-center h-full bg-black/40">
          <div className="text-center px-6 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg font-serif mb-6">
              Welcome to the Blue Heron Café
            </h1>
            <p className="text-white text-lg md:text-xl font-light drop-shadow-md">
              A hidden gem tucked behind Samuels Store — fresh, elevated homestyle eats in a cozy, nature-inspired setting.
            </p>
          </div>
        </div>
      </section>

      {/* About Text Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="/images/about-cafe.jpg"
            alt="Inside Blue Heron Café"
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-cyan-800 mb-4 font-serif">About Us</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We are a hidden gem that most don’t even know about — tucked away behind The Samuels Store and gas station. We pride ourselves on fresh eats with a spin on traditional items. Our food reflects the care we put into every plate, combining elevated quality with homestyle comfort.
            <br /><br />
            The Blue Heron Café is more than just a place to eat; it’s a gathering place for our community. Inspired by the warmth of a family, we’ve created a welcoming space where friends and families come together over delicious meals. Rooted in a deep love for mother nature, we’re proud to share this experience with you.
          </p>
        </div>
      </section>

      {/* YouTube Exposé Section */}
<section className="bg-white py-24 px-6">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-cyan-800 mb-6 font-serif">
      Watch Our Café Exposé
    </h2>
    <p className="text-lg text-gray-700 mb-8">
      Discover the heart behind the Blue Heron Café in this special feature.
    </p>
    <div
  style={{
    position: "relative",
    paddingBottom: "56.25%",
    height: 0,
    overflow: "hidden",
    maxWidth: "100%",
    backgroundColor: "#000",
  }}
>
  <iframe
    src="https://www.youtube.com/embed/wX5M8ct-nHg"
    title="Blue Heron Café Exposé"
    allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      border: 0,
      display: "block",
    }}
  ></iframe>
</div>



  </div>
</section>


      {/* Gallery Section */}
      <section className="py-12 pb-32 bg-cyan-50">
        <h2 className="text-center text-4xl font-bold text-cyan-800 mb-12 font-serif">
          A Glimpse Inside
        </h2>
        <GallerySection />
      </section>

      <Footer />
    </>
  );
}
