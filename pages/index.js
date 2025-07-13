// pages/index.js - Homepage with SEO
import SEO from "@/components/SEO";
import { generateRestaurantSchema } from "@/lib/structuredData";
import HeroSection from "../components/HeroSection";
import MenuShowcase from "@/components/MenuShowcase";
import StableEventsShowcase from "@/components/StableEventsShowcase";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import ReviewsSection from "@/components/ReviewSection";

export default function Home() {
  const restaurantSchema = generateRestaurantSchema();

  return (
    <>
      <SEO
        title="Blue Heron Café | Fresh Country Dining in Samuels, Idaho"
        description="Hidden gem café in Samuels, Idaho serving fresh, elevated homestyle food. Live music events, outdoor patio dining, and cozy atmosphere near Sandpoint."
        keywords="restaurant Samuels Idaho, café Sandpoint, fresh food Idaho, live music events, outdoor dining, country store, homestyle cooking, farm to table"
        url="/"
        jsonLd={restaurantSchema}
      />
      
      <HeroSection />
      <MenuShowcase />
      <StableEventsShowcase />
      <AboutSection />
      <GallerySection />
      <ReviewsSection />
      <Footer />
    </>
  );
}