import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SplashScreen from "../components/SplashScreen";
import Head from "next/head";
import { useState, useEffect } from "react";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export default function App({ Component, pageProps }) {
  const [showSplash, setShowSplash] = useState(false); // Start with false to prevent SSR mismatch
  const [hasVisited, setHasVisited] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're now on the client side
    setIsClient(true);
    
    // Check if the user has visited before using localStorage
    // Only access localStorage after component mounts (client-side)
    if (typeof window !== 'undefined') {
      const visitedBefore = localStorage.getItem('hasVisitedBlueHeron');
      if (visitedBefore) {
        setShowSplash(false);
        setHasVisited(true);
      } else {
        // First time visitor - show splash
        setShowSplash(true);
      }
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Set localStorage item to 'true' after splash completion
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasVisitedBlueHeron', 'true');
    }
    console.log("Splash completed, showSplash is now false and localStorage updated.");
  };

  // Show a loading state during hydration to prevent mismatch
  if (!isClient) {
    return (
      <>
        <Head>
          <title>Blue Heron Café | Samuels, ID</title>
          <meta name="description" content="A cozy country café offering fresh eats, baked goods, and local events. Located in Samuels, Idaho." />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <LocalBusinessSchema />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <img
            src="/images/blue-heron-vertical-logo.png"
            alt="Blue Heron Café Logo"
            className="max-h-[40vh] w-auto opacity-50"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Blue Heron Café | Samuels, ID</title>
        <meta name="description" content="A cozy country café offering fresh eats, baked goods, and local events. Located in Samuels, Idaho." />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          <Footer />
        </>
      )}
    </>
  );
}