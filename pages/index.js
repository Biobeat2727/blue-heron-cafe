import MenuCarousel from "@/components/MenuCarousel";
import HeroSection from "../components/HeroSection";
import EventsCarousel from "@/components/EventsCarousel";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

<SEO
  title="Blue Heron Café | Samuels, ID"
  description="Cozy country café offering fresh eats, baked goods, and local events. Located in Samuels, Idaho."
  image="/images/blue-heron-hero.jpg"
/>


export default function Home() {
  return (

    <>
    <HeroSection />
    <MenuCarousel />
    <EventsCarousel />
    <AboutSection />
    <GallerySection />
    <Footer />


    
    </>
  );
}
