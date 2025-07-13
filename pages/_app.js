import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // Add this import
import SplashScreen from "../components/SplashScreen";
import Head from "next/head";
import { useState, useEffect } from "react";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export default function App({ Component, pageProps }) {
  const [showSplash, setShowSplash] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    // Check if the user has visited before using localStorage
    const visitedBefore = localStorage.getItem('hasVisitedBlueHeron');
    if (visitedBefore) {
      setShowSplash(false); // If visited, skip splash screen
      setHasVisited(true);  // Mark as visited in state
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Set localStorage item to 'true' after splash completion
    localStorage.setItem('hasVisitedBlueHeron', 'true');
    console.log("Splash completed, showSplash is now false and localStorage updated.");
  };

  return (
    <>
      <Head>
        <title>Blue Heron Restaurant Sandpoint ID</title>
        <meta name="description" content="A unique dining experience in Sandpoint, Idaho." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LocalBusinessSchema />

      {/* Conditional rendering: Show splash only if showSplash is true AND hasVisited is false */}
      {showSplash && !hasVisited ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <>
          <Navbar />
          <main className="pt-20">
            <Component {...pageProps} />
          </main>
          <Footer /> {/* Add this line */}
        </>
      )}
    </>
  );
}