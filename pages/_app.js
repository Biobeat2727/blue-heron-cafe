import MenuCarousel from "@/components/MenuCarousel";
import HeroSection from "../components/HeroSection";
import EventsCarousel from "@/components/EventsCarousel";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Blue Heron Café | Fresh Eats & Local Events in Samuels, ID"
        description="Cozy country café offering fresh farm-to-table dining, baked goods, and live events near Sandpoint, Idaho. Visit our outdoor stage and patio!"
        image="/images/og-image.jpg"
        url="https://blueheronsamuels.com"
      />
      
      <HeroSection />
      <MenuCarousel />
      <EventsCarousel />
      <AboutSection />
      <GallerySection />
      <Footer />
    </>
  );
}